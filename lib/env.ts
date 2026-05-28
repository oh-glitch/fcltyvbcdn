/**
 * Server-only environment helpers.
 * Import this file only from API routes or server components.
 */
export function getServerEnv() {
  const openaiApiKey = process.env.OPENAI_API_KEY?.trim() || null;
  const openaiModel = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const enableDemoChat = process.env.ENABLE_DEMO_CHAT === "true";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || null;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || null;
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || null;

  const supabaseConfigured = Boolean(
    supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey
  );

  return {
    openaiApiKey,
    openaiModel,
    enableDemoChat,
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
    supabaseConfigured
  };
}

export function hasOpenAIKey() {
  return Boolean(getServerEnv().openaiApiKey);
}

export function hasSupabaseConfig() {
  return getServerEnv().supabaseConfigured;
}
