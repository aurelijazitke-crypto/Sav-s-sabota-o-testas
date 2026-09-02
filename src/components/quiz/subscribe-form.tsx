"use client";

import { CheckIcon, MailIcon } from "@/components/icons";
import { QUIZ_VERSION } from "@/lib/quiz-content";
import type {
  PatternProfileId,
  ResultProfileId
} from "@/lib/quiz-types";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type SubscribeFormProps = {
  emailEnabled: boolean;
  primaryId: ResultProfileId;
  secondaryId?: PatternProfileId;
  level: string;
};

type SubmitState =
  | { status: "idle"; message: "" }
  | { status: "submitting"; message: "" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function SubscribeForm({
  emailEnabled,
  primaryId,
  secondaryId,
  level
}: SubscribeFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: ""
  });
  const formStartedAt = useRef(0);
  const resultSubject =
    primaryId === "savo-puseje"
      ? "šią kryptį"
      : primaryId === "kelios-strategijos"
        ? "šias strategijas"
        : "šį vaidmenį";

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!emailEnabled || submitState.status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitState({ status: "submitting", message: "" });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          consent: formData.get("consent") === "on",
          website: formData.get("website"),
          startedAt: formStartedAt.current,
          primaryId,
          secondaryId,
          level,
          version: QUIZ_VERSION
        })
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        setSubmitState({
          status: "error",
          message:
            payload.message ||
            "Nepavyko išsiųsti. Patikrink duomenis ir pabandyk dar kartą."
        });
        return;
      }

      form.reset();
      setSubmitState({
        status: "success",
        message:
          payload.message ||
          "Viskas pavyko. Patikrink savo el. paštą ir patvirtink prenumeratą."
      });

      window.dispatchEvent(
        new CustomEvent("aurelija:quiz-event", {
          detail: { event: "lead_submit_success" }
        })
      );
    } catch {
      setSubmitState({
        status: "error",
        message: "Ryšys trumpam sutriko. Pabandyk dar kartą."
      });
    }
  }

  return (
    <section className="subscribe-card" aria-labelledby="subscribe-title">
      <div className="subscribe-card__icon" aria-hidden="true">
        <MailIcon width={25} height={25} />
      </div>
      <div className="subscribe-card__intro">
        <span>Gilesnis žvilgsnis į tavo rezultatą</span>
        <h2 id="subscribe-title">Nori suprasti {resultSubject} giliau?</h2>
        <p>
          Atsiųsiu išsamesnį paaiškinimą, pirmą praktinį žingsnį ir laiškus
          apie ribas, kaltę, kūną bei grįžimą į savo pusę.
        </p>
      </div>

      {!emailEnabled ? (
        <div className="form-preview-state" role="note">
          <strong>El. laiškai bandomojoje versijoje dar neįjungti</strong>
          <p>
            Testas ir rezultato puslapis jau veikia. Prenumeratos formą
            įjungsime tik paruošę „MailerLite“ grupę ir laiškus.
          </p>
        </div>
      ) : submitState.status === "success" ? (
        <div className="form-success" role="status">
          <span>
            <CheckIcon width={20} height={20} />
          </span>
          <div>
            <strong>Dar vienas mažas žingsnis</strong>
            <p>{submitState.message}</p>
          </div>
        </div>
      ) : (
        <form
          className="subscribe-form"
          onSubmit={handleSubmit}
        >
          <div className="form-grid">
            <label className="field">
              <span>Vardas <small>(nebūtina)</small></span>
              <input
                type="text"
                name="name"
                autoComplete="given-name"
                maxLength={80}
                placeholder="Tavo vardas"
              />
            </label>
            <label className="field">
              <span>El. paštas</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                placeholder="tavo@email.lt"
                required
              />
            </label>
          </div>

          <label className="honeypot" aria-hidden="true">
            Svetainė
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          <label className="consent">
            <input type="checkbox" name="consent" required />
            <span className="consent__box" aria-hidden="true">
              <CheckIcon width={14} height={14} />
            </span>
            <span>
              Sutinku el. paštu gauti išsamų testo rezultato paaiškinimą ir
              Aurelijos laiškus apie ribas, savivertę, kūną bei pasąmonę.
              Žinau, kad šį sutikimą galiu bet kada atšaukti.{" "}
              <Link href="/privatumas" target="_blank">
                Privatumo politika
              </Link>
            </span>
          </label>

          <button
            className="button button--light"
            type="submit"
            disabled={submitState.status === "submitting"}
          >
            {submitState.status === "submitting"
              ? "Siunčiama…"
              : "Gauti išsamų paaiškinimą"}
            <MailIcon />
          </button>

          {submitState.status === "error" ? (
            <p className="form-error" role="alert">
              {submitState.message}
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
