import { z } from "zod";

import { parseModelJson } from "@/lib/ai/parse-json";
import { createAnthropicProvider } from "@/lib/ai/providers/anthropic";
import { createGroqProvider } from "@/lib/ai/providers/groq";
import { createOpenAiProvider } from "@/lib/ai/providers/openai";
import type { AiProvider, AiProviderName } from "@/lib/ai/providers/types";
import {
  aiReflectionSchema,
  normalizeAiReflection,
  type AiReflectionPayload,
} from "@/lib/ai/schema";
import { REFLECT_SYSTEM_PROMPT, buildReflectUserPrompt } from "@/lib/ai/system-prompt";

export type { AiReflectionPayload };

function resolveProvider(name: string): AiProvider {
  const normalized = name.toLowerCase() as AiProviderName;
  switch (normalized) {
    case "anthropic":
      return createAnthropicProvider();
    case "groq":
      return createGroqProvider();
    case "openai":
      return createOpenAiProvider();
    default:
      throw new Error(`Unknown AI_PROVIDER "${name}".`);
  }
}

export function getAiProvider(): AiProvider {
  const name = process.env.AI_PROVIDER?.trim();
  if (!name) {
    throw new Error("AI_PROVIDER is not set");
  }
  return resolveProvider(name);
}

export async function generateReflection(input: {
  category: string;
  rawInput: string;
  personContext?: string | null;
  intensity?: number | null;
}): Promise<AiReflectionPayload> {
  const provider = getAiProvider();
  const raw = await provider.complete({
    system: REFLECT_SYSTEM_PROMPT,
    user: buildReflectUserPrompt(input),
  });
  let parsed: unknown;
  try {
    parsed = parseModelJson(raw);
  } catch (e) {
    console.error("Unsaid AI returned non-JSON or malformed JSON", e);
    throw new Error("AI_OUTPUT_PARSE");
  }
  try {
    const validated = aiReflectionSchema.parse(parsed);
    return normalizeAiReflection(validated);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error("Unsaid AI output failed validation", e.flatten());
    }
    throw new Error("AI_OUTPUT_VALIDATE");
  }
}
