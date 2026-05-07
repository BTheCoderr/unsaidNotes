export const UNSAID_SAFETY_NOTE =
  "This is a reflection tool, not therapy, legal advice, crisis support, or professional counseling.";

/** Stored in DB `category`; UI-only emotional modes for the guided flow. */
export const REFLECTION_CATEGORIES = [
  "I'm angry",
  "I feel ignored",
  "I need to apologize",
  "I need a boundary",
  "I miss someone",
  "I'm overthinking",
  "I'm about to send a risky text",
  "I need closure",
  "I need to calm down",
  "Workplace tension",
] as const;

export type ReflectionCategory = (typeof REFLECTION_CATEGORIES)[number];

/** Dashboard “Texts I didn’t send” shelf. */
export const CATEGORY_RISKY_TEXT = "I'm about to send a risky text";

/** Dashboard “Boundaries I’m practicing” shelf. */
export const CATEGORY_BOUNDARY_MODE = "I need a boundary";
