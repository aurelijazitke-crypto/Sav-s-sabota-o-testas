import {
  DIMENSIONS,
  PROFILES,
  QUESTIONS
} from "./quiz-content.ts";
import {
  DIMENSION_IDS,
  PROFILE_IDS,
  type AnswerId,
  type Answers,
  type DimensionId,
  type Frequency,
  type PatternProfileId,
  type QuizResult,
  type ResultProfileId
} from "./quiz-types.ts";

const MAX_DIMENSION_SCORE = 9;
const HEALTHY_THRESHOLD = 30;
const HEALTHY_DIMENSION_THRESHOLD = 50;
const SECONDARY_MIN_SCORE = 35;
const SECONDARY_MAX_GAP = 8;

const PROFILE_WEIGHTS: Record<
  PatternProfileId,
  Record<DimensionId, number>
> = {
  "tyli-taikdare": {
    anger: 0.45,
    connection: 0.35,
    boundaries: 0.15,
    responsibility: 0.05,
    worth: 0
  },
  "visu-atrama": {
    responsibility: 0.55,
    boundaries: 0.25,
    worth: 0.15,
    connection: 0.05,
    anger: 0
  },
  nepriekaistingoji: {
    worth: 0.6,
    responsibility: 0.2,
    connection: 0.15,
    anger: 0.05,
    boundaries: 0
  },
  prisitaikanti: {
    boundaries: 0.45,
    connection: 0.3,
    worth: 0.15,
    responsibility: 0.1,
    anger: 0
  }
};

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function getFrequency(score: number): Frequency {
  if (score < 25) return "mažai ryšku";
  if (score < 50) return "šiek tiek ryšku";
  if (score < 75) return "ryšku";
  return "labai ryšku";
}

export function isResultProfileId(value: unknown): value is ResultProfileId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(PROFILES, value)
  );
}

export function calculateResult(answers: Answers): QuizResult {
  const missingQuestion = QUESTIONS.find((question) => !answers[question.id]);
  if (missingQuestion) {
    throw new Error("Atsakyk į visus 15 klausimų prieš skaičiuojant rezultatą.");
  }

  const rawScores = Object.fromEntries(
    DIMENSION_IDS.map((id) => [id, 0])
  ) as Record<DimensionId, number>;

  for (const question of QUESTIONS) {
    const answerId = answers[question.id] as AnswerId;
    const selectedOption = question.options.find(
      (option) => option.id === answerId
    );

    if (!selectedOption) {
      throw new Error("Vienas iš atsakymų neatitinka testo versijos.");
    }

    rawScores[question.dimension] += selectedOption.score;
  }

  const normalizedScores = Object.fromEntries(
    DIMENSION_IDS.map((id) => [
      id,
      round((rawScores[id] / MAX_DIMENSION_SCORE) * 100)
    ])
  ) as Record<DimensionId, number>;

  const patternScores = Object.fromEntries(
    PROFILE_IDS.map((profileId) => {
      const weightedScore = DIMENSION_IDS.reduce(
        (sum, dimensionId) =>
          sum +
          normalizedScores[dimensionId] *
            PROFILE_WEIGHTS[profileId][dimensionId],
        0
      );
      return [profileId, round(weightedScore)];
    })
  ) as Record<PatternProfileId, number>;

  const overallScore = round(
    DIMENSION_IDS.reduce(
      (sum, dimensionId) => sum + normalizedScores[dimensionId],
      0
    ) / DIMENSION_IDS.length
  );

  const sortedPatterns = [...PROFILE_IDS].sort((a, b) => {
    const difference = patternScores[b] - patternScores[a];
    return difference === 0
      ? PROFILE_IDS.indexOf(a) - PROFILE_IDS.indexOf(b)
      : difference;
  });

  const leadingPattern = sortedPatterns[0];
  const secondPattern = sortedPatterns[1];
  const leadingScore = patternScores[leadingPattern];
  const secondaryGap =
    leadingScore - patternScores[secondPattern];
  const highestDimensionScore = Math.max(
    ...Object.values(normalizedScores)
  );
  const isLowPattern =
    overallScore < HEALTHY_THRESHOLD &&
    highestDimensionScore < HEALTHY_DIMENSION_THRESHOLD;
  const nearTopPatterns = sortedPatterns.filter(
    (profileId) =>
      patternScores[profileId] >= SECONDARY_MIN_SCORE &&
      leadingScore - patternScores[profileId] <= SECONDARY_MAX_GAP
  );
  const primaryId: ResultProfileId = isLowPattern
    ? "savo-puseje"
    : nearTopPatterns.length >= 3
      ? "kelios-strategijos"
      : leadingPattern;
  const secondaryId =
    PROFILE_IDS.includes(primaryId as PatternProfileId) &&
    patternScores[secondPattern] >= SECONDARY_MIN_SCORE &&
    secondaryGap <= SECONDARY_MAX_GAP
      ? secondPattern
      : undefined;

  return {
    primaryId,
    secondaryId,
    isMixed: primaryId === "kelios-strategijos" || Boolean(secondaryId),
    overallScore,
    overallFrequency: getFrequency(overallScore),
    patternScores,
    dimensions: DIMENSION_IDS.map((id) => ({
      ...DIMENSIONS[id],
      raw: rawScores[id],
      score: normalizedScores[id],
      frequency: getFrequency(normalizedScores[id])
    }))
  };
}
