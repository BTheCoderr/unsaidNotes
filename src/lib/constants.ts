export const UNSAID_SAFETY_NOTE =
  "This is a reflection tool, not therapy, legal advice, crisis support, or professional counseling.";

export const REFLECTION_CATEGORIES = [
  "Argument",
  "Apology",
  "Boundary",
  "Breakup",
  "Friendship",
  "Family",
  "Workplace",
  "Text I Should Not Send",
  "Hard Conversation",
  "I Need To Calm Down",
] as const;

export type ReflectionCategory = (typeof REFLECTION_CATEGORIES)[number];
