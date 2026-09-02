"use client";

import { ArrowRightIcon, RefreshIcon, ShareIcon } from "@/components/icons";
import { DimensionBars } from "@/components/quiz/dimension-bars";
import { SubscribeForm } from "@/components/quiz/subscribe-form";
import { PROFILES } from "@/lib/quiz-content";
import type { PatternProfileId, QuizResult } from "@/lib/quiz-types";
import Link from "next/link";
import { type RefObject, useState } from "react";

type ResultScreenProps = {
  result: QuizResult;
  embedded: boolean;
  emailEnabled: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  programUrl: string;
  onRestart: () => void;
};

export function ResultScreen({
  result,
  embedded,
  emailEnabled,
  headingRef,
  programUrl,
  onRestart
}: ResultScreenProps) {
  const [shareMessage, setShareMessage] = useState("");
  const profile = PROFILES[result.primaryId];
  const isHealthy = result.primaryId === "savo-puseje";
  const isBroad = result.primaryId === "kelios-strategijos";
  const secondary = result.secondaryId
    ? PROFILES[result.secondaryId]
    : undefined;
  const secondaryIsTied =
    Boolean(secondary) &&
    !isHealthy &&
    !isBroad &&
    result.patternScores[result.primaryId as PatternProfileId] ===
      result.patternScores[result.secondaryId as PatternProfileId];

  async function shareResult() {
    const url =
      window.location.origin + "/rezultatas/" + encodeURIComponent(profile.id);
    const data = {
      title: profile.shareTitle,
      text:
        profile.statement +
        " Atlik testą ir sužinok, kuri strategija ryškiausia tavo atsakymuose.",
      url
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
        setShareMessage("");
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Rezultato nuoroda nukopijuota.");
      }

      window.dispatchEvent(
        new CustomEvent("aurelija:quiz-event", {
          detail: { event: "share_click" }
        })
      );
    } catch {
      setShareMessage("Dalijimasis atšauktas.");
    }
  }

  return (
    <section className="result-screen screen-enter" aria-labelledby="result-title">
      <div className="result-hero">
        <div className="result-hero__ornament result-hero__ornament--one" />
        <div className="result-hero__ornament result-hero__ornament--two" />
        <div className="result-hero__content">
          <p className="result-eyebrow">
            {isHealthy
              ? "Tavo dabartinė kryptis"
              : isBroad
                ? "Kelios strategijos veikia kartu"
                : secondaryIsTied
                  ? "Du vienodai ryškūs vaidmenys"
                  : result.isMixed
                ? "Dvi strategijos veikia greta"
                : "Tavo ryškiausias vaidmuo"}
          </p>
          <h1 id="result-title" ref={headingRef} tabIndex={-1}>
            {profile.title}
          </h1>
          <p className="result-statement">{profile.statement}</p>

          {secondary ? (
            <div className="secondary-profile">
              {secondaryIsTied ? "Vienodai ryšku: " : "Greta pasirodo: "}
              <strong>{secondary.title}</strong>
            </div>
          ) : null}
        </div>
      </div>

      <div className="result-body">
        <div className="result-anchor">
          <span aria-hidden="true">“</span>
          <p>
            {isHealthy
              ? "Tai nėra pažadas, kad senos reakcijos daugiau nepasirodys. Tai ženklas, kad vis dažniau gali išgirsti save ir likti ryšyje su kitu."
              : isBroad
                ? "Šios strategijos nėra tavo esmė ar keli skirtingi charakteriai. Tai išmokti būdai išsaugoti ryšį, pripažinimą ar saugumą skirtingose situacijose."
                : "Tai nėra tavo esmė ar charakterio trūkumas. Tai vaidmuo, kurį galėjai išmokti tam, kad išsaugotum ryšį, ramybę ar saugumą."}
          </p>
        </div>

        <section className="result-section" aria-labelledby="mirror-title">
          <div className="section-heading">
            <span>Tavo atsakymų veidrodis</span>
            <h2 id="mirror-title">Kaip tai gali pasireikšti</h2>
          </div>
          <p className="result-summary">{profile.summary}</p>

          <div className="sign-list">
            {profile.signs.map((sign, index) => (
              <div className="sign-item" key={sign}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{sign}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="result-duo"
          aria-label={
            isHealthy
              ? "Kontekstas ir stiprybė"
              : isBroad
                ? "Strategijų kilmė ir stiprybė"
                : "Vaidmens kilmė ir stiprybė"
          }
        >
          <article className="insight-card insight-card--warm">
            <span>
              {isHealthy
                ? "Svarbu prisiminti"
                : isBroad
                  ? "Ką jos mėgina apsaugoti"
                  : "Ką jis mėgina apsaugoti"}
            </span>
            <p>{profile.protection}</p>
          </article>
          <article className="insight-card">
            <span>Tavo stiprybė</span>
            <p>{profile.strength}</p>
          </article>
        </section>

        <section className="inner-rule" aria-labelledby="inner-rule-title">
          <span id="inner-rule-title">
            {isHealthy
              ? "Nauja vidinė atrama"
              : isBroad
                ? "Bendra vidinė taisyklė"
                : "Tylioji vidinė taisyklė"}
          </span>
          <p>„{profile.innerRule}“</p>
        </section>

        <DimensionBars
          broad={isBroad}
          dimensions={result.dimensions}
        />

        <section className="practice-card" aria-labelledby="practice-title">
          <div className="practice-card__number" aria-hidden="true">
            01
          </div>
          <div>
            <span>Mažas žingsnis šiandien</span>
            <h2 id="practice-title">{profile.practice.title}</h2>
            <p>{profile.practice.instruction}</p>
            <blockquote>{profile.practice.phrase}</blockquote>
          </div>
        </section>

        <SubscribeForm
          emailEnabled={emailEnabled}
          primaryId={result.primaryId}
          secondaryId={result.secondaryId}
          level={result.overallFrequency}
        />

        <section className="program-card" aria-labelledby="program-title">
          <p className="program-card__kicker">Daugiau nei gera</p>
          <h2 id="program-title">
            Ne dar viena pamoka, kaip būti geresnei. Kelias atgal į savo pusę.
          </h2>
          <p>
            Ribos, sveikas pyktis, balsas ir kūnas – ten, kur gerumas nustoja
            reikšti savęs atsisakymą.
          </p>
          <Link
            className="button button--outline"
            href={programUrl}
            target={embedded ? "_blank" : undefined}
            rel={embedded ? "noopener" : undefined}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("aurelija:quiz-event", {
                  detail: { event: "result_cta_click" }
                })
              )
            }
          >
            Sužinoti daugiau
            <ArrowRightIcon />
          </Link>
        </section>

        <div className="result-actions">
          <button className="button button--secondary" type="button" onClick={shareResult}>
            <ShareIcon />
            Pasidalyti savo rezultatu
          </button>
          <button className="text-button text-button--center" type="button" onClick={onRestart}>
            <RefreshIcon />
            Atlikti testą iš naujo
          </button>
          <p className="share-status" aria-live="polite">
            {shareMessage}
          </p>
        </div>

        <p className="result-disclaimer">
          Šis testas yra edukacinė savirefleksijos priemonė. Jis nėra
          moksliškai validuotas psichologinis testas, nepateikia diagnozės ir
          neatstoja individualaus specialisto įvertinimo. Rezultatas atspindi
          tavo pačios atsakymus apie dabartinę patirtį ir gali keistis
          priklausomai nuo gyvenimo aplinkybių bei santykių.
        </p>
      </div>
    </section>
  );
}
