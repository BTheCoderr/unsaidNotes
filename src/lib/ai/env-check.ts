/**
 * Returns which AI-related env is misconfigured (for server logs only — do not
 * expose this string to clients; use reflect error `missing_env` instead).
 */
export function getReflectAiEnvViolation(): string | null {
  const name = process.env.AI_PROVIDER?.trim();
  if (!name) {
    return "AI_PROVIDER";
  }
  const normalized = name.toLowerCase();
  switch (normalized) {
    case "groq":
      if (!process.env.GROQ_API_KEY?.trim()) {
        return "GROQ_API_KEY";
      }
      return null;
    case "openai":
      if (!process.env.OPENAI_API_KEY?.trim()) {
        return "OPENAI_API_KEY";
      }
      if (!process.env.OPENAI_MODEL?.trim()) {
        return "OPENAI_MODEL";
      }
      return null;
    case "anthropic":
      if (!process.env.ANTHROPIC_API_KEY?.trim()) {
        return "ANTHROPIC_API_KEY";
      }
      if (!process.env.ANTHROPIC_MODEL?.trim()) {
        return "ANTHROPIC_MODEL";
      }
      return null;
    default:
      return "AI_PROVIDER_UNSUPPORTED";
  }
}
