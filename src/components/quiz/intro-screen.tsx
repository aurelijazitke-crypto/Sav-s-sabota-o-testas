import { BrandMark } from "@/components/brand-mark";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  LockIcon,
  SparkIcon
} from "@/components/icons";
import type { RefObject } from "react";

export function IntroScreen({
  headingRef,
  onStart
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  onStart: () => void;
}) {
  return (
    <section className="intro-screen screen-enter" aria-labelledby="intro-title">
      <div className="intro-screen__top">
        <BrandMark />
        <div className="intro-screen__edition">Savirefleksijos testas</div>
      </div>

      <div className="intro-screen__content">
        <div className="intro-kicker">
          <SparkIcon width={17} height={17} />
          Ne apie tai, ar esi gera
        </div>

        <h1
          id="intro-title"
          className="intro-title"
          ref={headingRef}
          tabIndex={-1}
        >
          Kiek tavo gyvenimą vis dar valdo{" "}
          <em>„geros mergaitės“</em> vaidmuo?
        </h1>

        <p className="intro-lead">
          15 kasdienių situacijų padės pamatyti, kur dėl ramybės, ryšio ar
          pripažinimo palieki save paskutinę – ir kuri prisitaikymo strategija
          tavo atsakymuose išryškėja labiausiai.
        </p>

        <div className="intro-note">
          <span className="intro-note__line" aria-hidden="true" />
          <p>
            Kartais tai, ką vadiname gerumu, yra seniai išmoktas būdas
            neprarasti ryšio.
          </p>
        </div>

        <button className="button button--primary button--large" onClick={onStart}>
          Pradėti testą
          <ArrowRightIcon />
        </button>

        <div className="intro-facts" aria-label="Informacija apie testą">
          <span>
            <CheckIcon /> 15 situacijų
          </span>
          <span>
            <ClockIcon /> 4–6 minutės
          </span>
          <span>
            <LockIcon /> Klausimų atsakymai neišsaugomi
          </span>
        </div>
      </div>

      <p className="intro-disclaimer">
        Tai edukacinė savirefleksijos priemonė, o ne psichologinė diagnozė.
      </p>
    </section>
  );
}
