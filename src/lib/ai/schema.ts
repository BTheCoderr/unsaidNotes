import { z } from "zod";

import { UNSAID_SAFETY_NOTE } from "@/lib/constants";

export const aiReflectionSchema = z.object({
  title: z.string(),
  summary: z.string(),
  feeling: z.string(),
  need: z.string(),
  notToSay: z.string(),
  repairMessage: z.string(),
  boundary: z.string(),
  nextStep: z.string(),
  shareCardText: z.string(),
  /** One memorable line to carry with them (repair ritual / saved reminder). */
  reminder: z.string(),
  safetyNote: z.string(),
});

export type AiReflectionPayload = z.infer<typeof aiReflectionSchema>;

export function normalizeAiReflection(raw: AiReflectionPayload): AiReflectionPayload {
  return {
    ...raw,
    safetyNote: UNSAID_SAFETY_NOTE,
  };
}
