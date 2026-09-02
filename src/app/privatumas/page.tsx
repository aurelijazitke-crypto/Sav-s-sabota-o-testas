import { ArrowLeftIcon } from "@/components/icons";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privatumo politika",
  description:
    "Informacija apie asmens duomenų tvarkymą naudojantis „Geros mergaitės“ testu.",
  robots: { index: false, follow: true }
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <article className="legal-card">
        <Link className="text-button" href="/">
          <ArrowLeftIcon />
          Grįžti į testą
        </Link>

        <p className="legal-kicker">Privatumo politika</p>
        <h1>Kaip tvarkomi tavo duomenys</h1>
        <p className="legal-updated">Versija: 2026 m. rugsėjo 2 d.</p>

        <div className="legal-summary">
          <strong>Duomenų valdytoja: Aurelija Žitkuvienė</strong>
          <span>Individuali veikla pagal pažymą Nr. 1497373</span>
          <span>Veiklos kodas 855900 · Lietuva</span>
          <a href="mailto:hipnoterapija@aurelijazitke.lt">
            hipnoterapija@aurelijazitke.lt
          </a>
        </div>

        <section>
          <h2>1. Ką renku</h2>
          <p>
            Pats testas apskaičiuojamas tavo naršyklėje. Atsakymų į 15
            klausimų nesiunčiu į serverį ir jų nesaugau. Tik tada, kai pati
            nusprendi užsisakyti laiškus, renku tavo el. pašto adresą,
            neprivalomą vardą, pagrindinį rezultato tipą, galimą antrinį tipą ir
            testo versiją.
          </p>
        </section>

        <section>
          <h2>2. Kam tai naudoju</h2>
          <p>
            Duomenis naudoju išsamesniam testo paaiškinimui, edukaciniams
            laiškams ir informacijai apie mano paslaugas ar programas
            siųsti. Teisinis pagrindas – tavo aiškiai išreikštas sutikimas.
          </p>
        </section>

        <section>
          <h2>3. Kas padeda tvarkyti duomenis</h2>
          <p>
            Svetainės veikimui naudojama Vercel, o laiškų prenumeratai –
            MailerLite. Šie paslaugų teikėjai duomenis tvarko pagal savo
            sutartines ir saugumo sąlygas. Perduodu tik tiek duomenų, kiek
            reikia šioms funkcijoms suteikti.
          </p>
        </section>

        <section>
          <h2>4. Kiek laiko saugau</h2>
          <p>
            Prenumeratos duomenys saugomi tol, kol galioja tavo sutikimas arba
            kol jų reikia nurodytiems tikslams. Sutikimą gali bet kada atšaukti
            paspaudusi atsisakymo nuorodą bet kuriame laiške.
          </p>
        </section>

        <section>
          <h2>5. Tavo teisės</h2>
          <p>
            Gali prašyti susipažinti su savo duomenimis, juos ištaisyti,
            ištrinti, apriboti tvarkymą ar pateikti prieštaravimą. Taip pat
            gali kreiptis į Valstybinę duomenų apsaugos inspekciją. Dėl savo
            duomenų parašyk nurodytu el. paštu.
          </p>
        </section>

        <p className="legal-note">
          Šis puslapis yra projekto privatumo informacijos juodraštis. Prieš
          viešą paleidimą jis turi būti sutikrintas su faktiniais naudojamais
          įrankiais, saugojimo terminais ir verslo rekvizitais.
        </p>
      </article>
    </main>
  );
}
