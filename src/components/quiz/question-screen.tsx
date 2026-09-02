import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "@/components/icons";
import type {
  AnswerId,
  QuizQuestion
} from "@/lib/quiz-types";
import type { RefObject } from "react";

type QuestionScreenProps = {
  question: QuizQuestion;
  questionIndex: number;
  questionCount: number;
  selectedAnswer?: AnswerId;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onSelect: (answerId: AnswerId) => void;
  onBack: () => void;
  onNext: () => void;
};

export function QuestionScreen({
  question,
  questionIndex,
  questionCount,
  selectedAnswer,
  headingRef,
  onSelect,
  onBack,
  onNext
}: QuestionScreenProps) {
  const progress = ((questionIndex + 1) / questionCount) * 100;
  const isLast = questionIndex === questionCount - 1;

  return (
    <section className="question-screen screen-enter" aria-labelledby="question-title">
      <header className="quiz-header">
        <button className="text-button" type="button" onClick={onBack}>
          <ArrowLeftIcon />
          Atgal
        </button>
        <span className="quiz-header__counter">
          {questionIndex + 1} iš {questionCount}
        </span>
      </header>

      <div
        className="progress-track"
        role="progressbar"
        aria-label="Testo eiga"
        aria-valuemin={1}
        aria-valuemax={questionCount}
        aria-valuenow={questionIndex + 1}
      >
        <span style={{ width: progress + "%" }} />
      </div>

      <div className="question-card" key={question.id}>
        {questionIndex === 0 ? (
          <p className="question-guidance">
            Rinkis ne gražiausiai skambantį atsakymą, o tą, kuris arčiausiai
            tavo automatinės reakcijos per pastaruosius 3 mėnesius.
          </p>
        ) : null}

        <div className="question-number" aria-hidden="true">
          {String(question.id).padStart(2, "0")}
        </div>

        <h1 id="question-title" className="question-title" ref={headingRef} tabIndex={-1}>
          {question.prompt}
        </h1>

        <fieldset className="answer-list">
          <legend className="sr-only">Pasirink vieną atsakymą</legend>
          {question.options.map((option) => {
            const checked = option.id === selectedAnswer;
            return (
              <label className="answer-card" key={option.id}>
                <input
                  type="radio"
                  name={"question-" + question.id}
                  value={option.id}
                  checked={checked}
                  onChange={() => onSelect(option.id)}
                />
                <span className="answer-card__marker" aria-hidden="true">
                  {checked ? <CheckIcon width={16} height={16} /> : null}
                </span>
                <span className="answer-card__text">{option.text}</span>
              </label>
            );
          })}
        </fieldset>

        <button
          className="button button--primary question-next"
          type="button"
          onClick={onNext}
          disabled={!selectedAnswer}
        >
          {isLast ? "Pamatyti rezultatą" : "Toliau"}
          <ArrowRightIcon />
        </button>
      </div>

      <p className="question-footnote">
        Čia nėra teisingų atsakymų. Svarbi tavo tikra patirtis.
      </p>
    </section>
  );
}
