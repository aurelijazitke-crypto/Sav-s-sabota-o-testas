import assert from "node:assert/strict";
import { test } from "node:test";

import { DIMENSIONS, QUESTIONS } from "../src/lib/quiz-content.ts";
import { calculateResult, getFrequency } from "../src/lib/scoring.ts";
import {
  DIMENSION_IDS,
  type AnswerId,
  type Answers,
  type DimensionId,
  type Score
} from "../src/lib/quiz-types.ts";

function answersForDimensionLevels(
  levels: Record<DimensionId, Score>
): Answers {
  return Object.fromEntries(
    QUESTIONS.map((question) => {
      const targetScore = levels[question.dimension];
      const option = question.options.find(
        (candidate) => candidate.score === targetScore
      );
      assert.ok(
        option,
        "Question " + question.id + " needs an option scoring " + targetScore
      );
      return [question.id, option.id as AnswerId];
    })
  );
}

const zeroLevels: Record<DimensionId, Score> = {
  boundaries: 0,
  connection: 0,
  anger: 0,
  responsibility: 0,
  worth: 0
};

test("test content has 15 balanced questions and four unique options each", () => {
  assert.equal(QUESTIONS.length, 15);
  assert.equal(new Set(QUESTIONS.map((question) => question.id)).size, 15);

  for (const dimensionId of DIMENSION_IDS) {
    assert.equal(
      QUESTIONS.filter((question) => question.dimension === dimensionId).length,
      3
    );
    assert.ok(DIMENSIONS[dimensionId]);
  }

  for (const question of QUESTIONS) {
    assert.equal(question.options.length, 4);
    assert.equal(
      new Set(question.options.map((option) => option.id)).size,
      4
    );
    assert.deepEqual(
      [...question.options.map((option) => option.score)].sort(),
      [0, 1, 2, 3]
    );
  }
});

test("healthy response pattern is not forced into a problem profile", () => {
  const result = calculateResult(answersForDimensionLevels(zeroLevels));
  assert.equal(result.primaryId, "savo-puseje");
  assert.equal(result.overallScore, 0);
  assert.equal(result.secondaryId, undefined);
});

test("one extreme dimension is not hidden by a low overall average", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      ...zeroLevels,
      boundaries: 3
    })
  );

  assert.equal(result.overallScore, 20);
  assert.equal(result.primaryId, "prisitaikanti");
});

test("one mildly raised dimension can remain in the low-pattern result", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      ...zeroLevels,
      boundaries: 1
    })
  );

  assert.equal(result.overallScore, 6.7);
  assert.equal(result.primaryId, "savo-puseje");
});

test("anger plus disapproval sensitivity maps to Tyli taikdarė", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      ...zeroLevels,
      anger: 3,
      connection: 3
    })
  );
  assert.equal(result.primaryId, "tyli-taikdare");
});

test("over-responsibility plus weak boundaries maps to Visų atrama", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      ...zeroLevels,
      responsibility: 3,
      boundaries: 3
    })
  );
  assert.equal(result.primaryId, "visu-atrama");
});

test("conditional worth with over-responsibility maps to Nepriekaištingoji", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      ...zeroLevels,
      worth: 3,
      responsibility: 2
    })
  );
  assert.equal(result.primaryId, "nepriekaistingoji");
});

test("boundaries plus disapproval sensitivity maps to Prisitaikanti", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      ...zeroLevels,
      boundaries: 3,
      connection: 3
    })
  );
  assert.equal(result.primaryId, "prisitaikanti");
});

test("all calculated values remain within 0–100", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      boundaries: 3,
      connection: 3,
      anger: 3,
      responsibility: 3,
      worth: 3
    })
  );

  for (const dimension of result.dimensions) {
    assert.ok(dimension.score >= 0 && dimension.score <= 100);
  }
  for (const score of Object.values(result.patternScores)) {
    assert.ok(score >= 0 && score <= 100);
  }
});

test("all maximum dimensions return the broad mixed result", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      boundaries: 3,
      connection: 3,
      anger: 3,
      responsibility: 3,
      worth: 3
    })
  );

  assert.equal(result.overallScore, 100);
  assert.deepEqual(Object.values(result.patternScores), [100, 100, 100, 100]);
  assert.equal(result.primaryId, "kelios-strategijos");
  assert.equal(result.isMixed, true);
  assert.equal(result.secondaryId, undefined);
});

test("uniform medium-high dimensions return the broad mixed result", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      boundaries: 2,
      connection: 2,
      anger: 2,
      responsibility: 2,
      worth: 2
    })
  );

  assert.equal(result.overallScore, 66.7);
  assert.equal(result.primaryId, "kelios-strategijos");
  assert.equal(result.isMixed, true);
});

test("two equal profiles are retained as primary and secondary", () => {
  const result = calculateResult(
    answersForDimensionLevels({
      ...zeroLevels,
      anger: 3,
      worth: 2
    })
  );

  assert.equal(result.patternScores["tyli-taikdare"], 45);
  assert.equal(result.patternScores.nepriekaistingoji, 45);
  assert.equal(result.isMixed, true);
  assert.deepEqual(
    new Set([result.primaryId, result.secondaryId]),
    new Set(["tyli-taikdare", "nepriekaistingoji"])
  );
});

test("incomplete answers are rejected", () => {
  assert.throws(
    () => calculateResult({ 1: "a" }),
    /Atsakyk į visus 15 klausimų/
  );
});

test("frequency labels use the documented boundaries", () => {
  assert.equal(getFrequency(0), "mažai ryšku");
  assert.equal(getFrequency(25), "šiek tiek ryšku");
  assert.equal(getFrequency(50), "ryšku");
  assert.equal(getFrequency(75), "labai ryšku");
});
