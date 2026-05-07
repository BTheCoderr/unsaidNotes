export type AiProviderName = "openai" | "anthropic" | "groq";

export interface AiProvider {
  complete(input: { system: string; user: string }): Promise<string>;
}
