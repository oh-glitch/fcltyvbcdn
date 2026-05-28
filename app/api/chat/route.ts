import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage
} from "ai";
import { jsonError, getErrorMessage } from "@/lib/api-errors";
import { getLastUserText } from "@/lib/chat-utils";
import { trimMessagesForMemory } from "@/lib/chat-memory";
import { getServerEnv, hasOpenAIKey, hasSupabaseConfig } from "@/lib/env";
import { getOpenAIProvider } from "@/lib/openai";
import { buildRagSystemPrompt, formatSourcesList } from "@/lib/rag/build-prompt";
import { retrieveContextForQuestion } from "@/lib/rag/retrieve";

export const maxDuration = 60;

type ChatRequestBody = {
  messages?: UIMessage[];
  conversationId?: string;
};

function buildDemoReply(userText: string, hasDocuments: boolean) {
  const question = userText || "your facility question";

  if (hasDocuments) {
    return `I'm in **demo mode** (no OpenAI key), so I cannot run live RAG search.

You asked: "${question}"

Your documents are uploaded — add \`OPENAI_API_KEY\` to \`.env.local\` and restart the server to get answers with citations from your PDFs.`;
  }

  return `I'm your **Facility AI Assistant** (demo mode).

You asked: "${question}"

Upload PDFs on the **Documents** page, then add \`OPENAI_API_KEY\` for semantic search and cited answers.`;
}

function streamDemoResponse(
  messages: UIMessage[],
  userText: string,
  hasDocuments: boolean
) {
  const reply = buildDemoReply(userText, hasDocuments);
  const textId = "demo-assistant-text";

  const stream = createUIMessageStream({
    originalMessages: messages,
    async execute({ writer }) {
      writer.write({ type: "text-start", id: textId });

      for (const chunk of reply.match(/.{1,12}/g) ?? [reply]) {
        writer.write({ type: "text-delta", id: textId, delta: chunk });
        await new Promise((resolve) => setTimeout(resolve, 20));
      }

      writer.write({ type: "text-end", id: textId });
    }
  });

  return createUIMessageStreamResponse({ stream });
}

function parseRequestBody(
  body: ChatRequestBody
):
  | { ok: true; messages: UIMessage[]; conversationId: string }
  | { ok: false; response: Response } {
  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return {
      ok: false,
      response: jsonError("At least one message is required.", 400)
    };
  }

  return {
    ok: true,
    messages: trimMessagesForMemory(body.messages),
    conversationId: body.conversationId ?? "anonymous"
  };
}

export async function POST(req: Request) {
  let body: ChatRequestBody;

  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const parsed = parseRequestBody(body);
  if (!parsed.ok) {
    return parsed.response;
  }

  const { messages, conversationId } = parsed;
  const userText = getLastUserText(messages);
  const { enableDemoChat, openaiModel } = getServerEnv();
  const supabaseReady = hasSupabaseConfig();

  if (!hasOpenAIKey()) {
    if (enableDemoChat) {
      return streamDemoResponse(messages, userText, supabaseReady);
    }

    return jsonError(
      "OPENAI_API_KEY is not configured. Copy .env.example to .env.local, add your key, and restart the dev server.",
      503
    );
  }

  try {
    const openai = getOpenAIProvider();

    // RAG: retrieve relevant chunks for the latest user question
    const ragResult = await retrieveContextForQuestion(userText);
    const systemPrompt = buildRagSystemPrompt(ragResult.chunks);

    if (ragResult.chunks.length > 0) {
      console.info(
        `[chat] conversation=${conversationId} RAG sources:\n${formatSourcesList(ragResult.chunks)}`
      );
    }

    const result = streamText({
      model: openai(openaiModel),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: ({ finishReason }) => {
        console.info(
          `[chat] conversation=${conversationId} finish=${finishReason} ragChunks=${ragResult.chunks.length}`
        );
      }
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(`[chat] conversation=${conversationId}`, error);

    if (enableDemoChat) {
      return streamDemoResponse(
        messages,
        `${userText}\n\n_(OpenAI error: ${getErrorMessage(error)} — showing demo reply.)_`,
        supabaseReady
      );
    }

    return jsonError(getErrorMessage(error), 500);
  }
}
