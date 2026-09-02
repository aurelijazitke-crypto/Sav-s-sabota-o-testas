import { ArrowRightIcon } from "@/components/icons";
import { PROFILES } from "@/lib/quiz-content";
import {
  RESULT_PROFILE_IDS,
  type ResultProfileId
} from "@/lib/quiz-types";
import { isResultProfileId } from "@/lib/scoring";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type ResultPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return RESULT_PROFILE_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: ResultPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isResultProfileId(slug)) return {};
  const profile = PROFILES[slug];

  return {
    title: profile.title,
    description: profile.statement,
    alternates: { canonical: "/rezultatas/" + slug },
    openGraph: {
      title: profile.shareTitle,
      description: profile.statement,
      url: "/rezultatas/" + slug
    },
    twitter: {
      card: "summary_large_image",
      title: profile.shareTitle,
      description: profile.statement
    }
  };
}

export default async function SharedResultPage({ params }: ResultPageProps) {
  const { slug } = await params;
  if (!isResultProfileId(slug)) notFound();

  const profile = PROFILES[slug as ResultProfileId];

  return (
    <main className="share-page">
      <div className="page-orbit page-orbit--left" aria-hidden="true" />
      <article className="share-card">
        <p className="share-card__eyebrow">
          {slug === "savo-puseje"
            ? "Tavo dabartinė kryptis"
            : slug === "kelios-strategijos"
              ? "Kelios „geros mergaitės“ strategijos"
              : "Vienas iš „geros mergaitės“ vaidmenų"}
        </p>
        <h1>{profile.title}</h1>
        <p className="share-card__statement">{profile.statement}</p>

        <div className="share-card__body">
          <p>{profile.summary}</p>
          <div className="share-card__insight">
            <span>
              {slug === "savo-puseje"
                ? "Nauja vidinė atrama"
                : slug === "kelios-strategijos"
                  ? "Bendra vidinė taisyklė"
                  : "Tylioji vidinė taisyklė"}
            </span>
            <strong>„{profile.innerRule}“</strong>
          </div>
          <p className="share-card__note">
            Vienas pavadinimas neapibrėžia žmogaus. Visas rezultatas
            apskaičiuojamas iš penkių krypčių, o kartais greta veikia ir
            antrinis vaidmuo.
          </p>
          <Link className="button button--primary button--large" href="/">
            Atlikti testą ir sužinoti savo rezultatą
            <ArrowRightIcon />
          </Link>
        </div>
      </article>
    </main>
  );
}
