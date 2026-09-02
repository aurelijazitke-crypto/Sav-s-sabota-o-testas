# „Geros mergaitės“ savirefleksijos testas

Mobilus 15 situacijų testas, sukurtas Aurelijos Žitkės prekės ženklui. Jis
vertina penkias prisitaikymo kryptis ir pateikia pagrindinį bei, kai aktualu,
antrinį rezultatų profilį. Jei vienodai išryškėja kelios kryptys, pateikiamas
neutralus mišrus rezultatas. Tai edukacinė priemonė, o ne diagnostinis ar
moksliškai validuotas psichologinis testas.

## Kas jau veikia

- 15 situacinių klausimų su grįžimu atgal ir progreso juosta.
- Penkios vertinimo kryptys, keturi vaidmenys, mišrus ir žemo ryškumo
  rezultatai.
- Apsauga nuo klaidinančio profilio: žemų balų rezultatas „Vis labiau savo
  pusėje“.
- Rezultato paaiškinimas, požymiai, vidinė taisyklė, stiprybė ir praktika.
- Savanoriška MailerLite forma po išsamaus rezultato.
- Vieši dalijimosi puslapiai adresu /rezultatas/profilis.
- Įterpiama versija adresu /embed.
- Privatumo informacijos juodraštis.
- Mobilus, prieinamas ir sumažintą judesį gerbiantis dizainas.

## Paleidimas kompiuteryje

~~~bash
npm install
npm run dev
~~~

Atverk http://localhost:3000.

Visos patikros:

~~~bash
npm run check
~~~

## MailerLite paruošimas

Rekomenduojama viena grupė:

GEROS_MERGAITES_TESTAS_OPTIN

MailerLite paskyroje sukurk keturis tekstinius pasirinktinius laukus:

- gg_primary_type
- gg_secondary_type
- gg_level
- gg_test_version

Galimos `gg_primary_type` reikšmės:

- tyli-taikdare
- visu-atrama
- nepriekaistingoji
- prisitaikanti
- kelios-strategijos
- savo-puseje

Tada Vercel projekto aplinkoje pridėk:

~~~text
MAILERLITE_API_TOKEN
MAILERLITE_GROUP_ID
MAILERLITE_PRIMARY_FIELD=gg_primary_type
MAILERLITE_SECONDARY_FIELD=gg_secondary_type
MAILERLITE_LEVEL_FIELD=gg_level
MAILERLITE_VERSION_FIELD=gg_test_version
~~~

API raktas naudojamas tik serverio maršrute ir niekada nepatenka į naršyklę.
Forma siunčia vardą, el. paštą ir rezultato žymas, bet nesiunčia 15 jautrių
atsakymų.

Prieš viešą paleidimą MailerLite paskyroje rekomenduojama įjungti double opt-in
API ir integracijoms. Viena automatizacija gali prasidėti žmogui prisijungus
prie grupės, o vėliau šakotis pagal gg_primary_type lauką.

## Įterpimas į svetainę

Pagrindinis variantas:

~~~html
<iframe
  id="geros-mergaites-testas"
  src="https://testas.aurelijazitke.lt/embed"
  title="Geros mergaitės savirefleksijos testas"
  loading="lazy"
  style="width:100%;min-height:850px;border:0;"
></iframe>
<script>
  window.addEventListener("message", function (event) {
    if (event.origin !== "https://testas.aurelijazitke.lt") return;
    if (event.data?.type !== "aurelija:geros-mergaites-testas:resize") return;
    document.getElementById("geros-mergaites-testas").style.height =
      Math.max(650, Number(event.data.height)) + "px";
  });
</script>
~~~

Jei svetainės kūrimo įrankis neleidžia pridėti skripto, palik maždaug 900 px
aukštį ir iframe slinkimą.

## GitHub ir Vercel eiga

- Darbo šaka sukuria Vercel Preview nuorodą.
- Dabartinis savęs sabotažo testas lieka main šakoje, kol naujas testas
  patvirtinamas.
- Po turinio, dizaino ir MailerLite bandymo nauja šaka gali būti sujungta į
  main ir pakeisti esamą testą.
- Produkcijai rekomenduojamas domenas testas.aurelijazitke.lt.

## Prieš viešą paleidimą

1. Patvirtinti visus klausimus ir rezultatų tekstus su Aurelija.
2. Sukurti atskirą MailerLite grupę bei laukus.
3. Sutikrinti privatumo puslapio rekvizitus ir faktinius saugojimo terminus.
4. Išbandyti double opt-in su tikru el. paštu.
5. Įjungti patvarų API užklausų ribojimą per Vercel Firewall ar kitą bendrą
   saugyklą.
6. Nuspręsti, kur turi vesti „Daugiau nei gera“ mygtukas.
7. Tik tada sujungti peržiūros šaką į main.
