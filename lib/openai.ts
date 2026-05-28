import { createOpenAI } from "@ai-sdk/openai";
import { getServerEnv } from "@/lib/env";

/**
 * Creates an OpenAI provider for the Vercel AI SDK.
 * Throws if OPENAI_API_KEY is missing — call hasOpenAIKey() first in routes.
 */
export function getOpenAIProvider() {
  const { openaiApiKey } = getServerEnv();

  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  return createOpenAI({ apiKey: openaiApiKey });
}
