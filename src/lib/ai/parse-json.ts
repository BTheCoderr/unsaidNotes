/** Best-effort: strip ```json fences from model output, then parse JSON safely. */
export function parseModelJson(text: string): unknown {
  let trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    trimmed = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    throw new Error("Invalid JSON from model");
  }
}
