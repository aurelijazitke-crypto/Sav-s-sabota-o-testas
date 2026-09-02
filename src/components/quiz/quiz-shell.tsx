"use client";

import { IntroScreen } from "@/components/quiz/intro-screen";
import { QuestionScreen } from "@/components/quiz/question-screen";
import { ResultScreen } from "@/components/quiz/result-screen";
import { QUESTIONS } from "@/lib/quiz-content";
import { calculateResult } from "@/lib/scoring";
import type {
  AnswerId,
  Answers,
  QuizResult
} from "@/lib/quiz-types";
import { useEffect, useMemo, useRef, useState } from "react";

type QuizScreen = "intro" | "questions" | "result";

type QuizShellProps = {
  embedded?: boolean;
  emailEnabled: boolean;
  programUrl: string;
};

export function QuizShell({
  embedded = false,
  emailEnabled,
  programUrl
}: QuizShellProps) {
  const [screen, setScreen] = useState<QuizScreen>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);
  const introHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const previousScreenRef = useRef<QuizScreen>("intro");

  const currentQuestion = QUESTIONS[questionIndex];
  const selectedAnswer = answers[currentQuestion?.id];

  const calculatedProgress = useMemo(
    () => Object.keys(answers).length,
    [answers]
  );

  useEffect(() => {
    const screenChanged = previousScreenRef.current !== screen;
    const heading =
      screen === "questions"
        ? questionHeadingRef.current
        : screen === "result"
          ? resultHeadingRef.current
          : screenChanged
            ? introHeadingRef.current
            : null;

    if (heading) {
      heading.focus({ preventScroll: true });
    }
    previousScreenRef.current = screen;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  }, [questionIndex, screen]);

  useEffect(() => {
    if (!embedded) return;

    const sendHeight = () => {
      window.parent.postMessage(
        {
          type: "aurelija:geros-mergaites-testas:resize",
          height: document.documentElement.scrollHeight
        },
        "*"
      );
    };

    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);
    window.addEventListener("load", sendHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", sendHeight);
    };
  }, [embedded, screen]);

  function startQuiz() {
    setAnswers({});
    setFinalResult(null);
    setQuestionIndex(0);
    setScreen("questions");
    emitEvent("quiz_start");
  }

  function chooseAnswer(answerId: AnswerId) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: answerId
    }));
  }

  function goBack() {
    if (questionIndex === 0) {
      setScreen("intro");
      return;
    }
    setQuestionIndex((current) => current - 1);
  }

  function goNext() {
    if (!selectedAnswer) return;

    if (questionIndex < QUESTIONS.length - 1) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      if ([5, 10].includes(nextIndex)) {
        emitEvent("quiz_progress", { completed: nextIndex });
      }
      return;
    }

    const result = calculateResult(answers);
    setFinalResult(result);
    setScreen("result");
    emitEvent("quiz_complete");
  }

  function restartQuiz() {
    setAnswers({});
    setFinalResult(null);
    setQuestionIndex(0);
    setScreen("intro");
  }

  return (
    <main
      className={
        embedded ? "quiz-page quiz-page--embedded" : "quiz-page"
      }
      data-completed={calculatedProgress}
    >
      <div className="page-orbit page-orbit--left" aria-hidden="true" />
      <div className="page-orbit page-orbit--right" aria-hidden="true" />
      <div className="quiz-container">
        {screen === "intro" ? (
          <IntroScreen headingRef={introHeadingRef} onStart={startQuiz} />
        ) : null}

        {screen === "questions" ? (
          <QuestionScreen
            question={currentQuestion}
            questionIndex={questionIndex}
            questionCount={QUESTIONS.length}
            selectedAnswer={selectedAnswer}
            headingRef={questionHeadingRef}
            onSelect={chooseAnswer}
            onBack={goBack}
            onNext={goNext}
          />
        ) : null}

        {screen === "result" && finalResult ? (
          <ResultScreen
            result={finalResult}
            embedded={embedded}
            emailEnabled={emailEnabled}
            headingRef={resultHeadingRef}
            programUrl={programUrl}
            onRestart={restartQuiz}
          />
        ) : null}
      </div>
    </main>
  );
}

function emitEvent(
  event: string,
  extra: Record<string, string | number> = {}
) {
  window.dispatchEvent(
    new CustomEvent("aurelija:quiz-event", {
      detail: { event, ...extra }
    })
  );
}
