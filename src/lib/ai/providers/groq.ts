import Groq from "groq-sdk";

import type { AiProvider } from "./types";

/** Default Groq model for the MVP (fast, cost-effective). */
export const GROQ_DEFAULT_MVP_MODEL = "llama-3.1-8b-instant";

/**
 * Larger model on Groq — optional if `llama-3.1-8b-instant` outputs feel too generic.
 * Set `GROQ_MODEL=llama-3.3-70b-versatile` in `.env.local`.
 */
export const GROQ_OPTIONAL_QUALITY_MODEL = "llama-3.3-70b-versatile";

export function createGroqProvider(): AiProvider {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }
  const model =
    process.env.GROQ_MODEL?.trim() && process.env.GROQ_MODEL.trim().length > 0
      ? process.env.GROQ_MODEL.trim()
      : GROQ_DEFAULT_MVP_MODEL;
  const client = new Groq({ apiKey });

  return {
    async complete({ system, user }) {
      try {
        const res = await client.chat.completions.create({
          model,
          temperature: 0.4,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        });
        const content = res.choices[0]?.message?.content;
        if (!content) {
          console.error("[groq] empty completion content", { model });
          throw new Error("Groq returned empty content");
        }
        return content;
      } catch (err: unknown) {
        const e = err as {
          status?: number;
          message?: string;
          error?: { message?: string };
        };
        const safeMessage =
          typeof e?.message === "string"
            ? e.message.slice(0, 240)
            : typeof e?.error?.message === "string"
              ? e.error.message.slice(0, 240)
              : "request_failed";
        console.error("[groq] chat.completions failed", {
          model,
          status: e?.status,
          message: safeMessage,
        });
        throw err;
      }
    },
  };
}
