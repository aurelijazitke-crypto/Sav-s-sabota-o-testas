export const DIMENSION_IDS = [
  "boundaries",
  "connection",
  "anger",
  "responsibility",
  "worth"
] as const;

export type DimensionId = (typeof DIMENSION_IDS)[number];

export const PROFILE_IDS = [
  "tyli-taikdare",
  "visu-atrama",
  "nepriekaistingoji",
  "prisitaikanti"
] as const;

export type PatternProfileId = (typeof PROFILE_IDS)[number];
export const RESULT_PROFILE_IDS = [
  ...PROFILE_IDS,
  "kelios-strategijos",
  "savo-puseje"
] as const;

export type ResultProfileId = (typeof RESULT_PROFILE_IDS)[number];
export type AnswerId = "a" | "b" | "c" | "d";
export type Score = 0 | 1 | 2 | 3;

export type QuizOption = {
  id: AnswerId;
  text: string;
  score: Score;
};

export type QuizQuestion = {
  id: number;
  dimension: DimensionId;
  prompt: string;
  options: QuizOption[];
};

export type Answers = Partial<Record<number, AnswerId>>;

export type DimensionDefinition = {
  id: DimensionId;
  shortLabel: string;
  label: string;
  description: string;
};

export type Practice = {
  title: string;
  instruction: string;
  phrase: string;
};

export type ProfileDefinition = {
  id: ResultProfileId;
  title: string;
  shareTitle: string;
  statement: string;
  summary: string;
  innerRule: string;
  protection: string;
  strength: string;
  signs: string[];
  practice: Practice;
};

export type DimensionResult = DimensionDefinition & {
  raw: number;
  score: number;
  frequency: Frequency;
};

export type Frequency =
  | "mažai ryšku"
  | "šiek tiek ryšku"
  | "ryšku"
  | "labai ryšku";

export type QuizResult = {
  primaryId: ResultProfileId;
  secondaryId?: PatternProfileId;
  isMixed: boolean;
  overallScore: number;
  overallFrequency: Frequency;
  patternScores: Record<PatternProfileId, number>;
  dimensions: DimensionResult[];
};
