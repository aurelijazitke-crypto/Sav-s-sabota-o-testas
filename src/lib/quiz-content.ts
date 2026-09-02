import type {
  DimensionDefinition,
  DimensionId,
  ProfileDefinition,
  QuizQuestion,
  ResultProfileId
} from "./quiz-types.ts";

export const QUIZ_VERSION = "1.0.0-preview";

export const DIMENSIONS: Record<DimensionId, DimensionDefinition> = {
  boundaries: {
    id: "boundaries",
    shortLabel: "Ribos",
    label: "Ribų nutylėjimas",
    description: "Kaip lengva išgirsti savo ribą ir ją parodyti kitam."
  },
  connection: {
    id: "connection",
    shortLabel: "Ryšys",
    label: "Jautrumas nepritarimui",
    description: "Kiek kito nepasitenkinimas ar atstumas keičia tavo pasirinkimus."
  },
  anger: {
    id: "anger",
    shortLabel: "Pyktis",
    label: "Pykčio slopinimas",
    description: "Kaip anksti pastebi nepasitenkinimą ir leidiesi jį išreikšti."
  },
  responsibility: {
    id: "responsibility",
    shortLabel: "Atsakomybė",
    label: "Kitų naštos perėmimas",
    description: "Kiek atsakomybės už kitų savijautą ir gyvenimą pasiimi sau."
  },
  worth: {
    id: "worth",
    shortLabel: "Vertė",
    label: "Sąlyginė savivertė",
    description: "Kiek savo vertę sieji su geru rezultatu, naudingumu ir neklydimu."
  }
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    dimension: "boundaries",
    prompt:
      "Dienos pabaigoje tavęs paprašo paslaugos, nors viduje iškart pajunti: „Aš nenoriu.“ Kas dažniausiai nutinka?",
    options: [
      {
        id: "a",
        text: "Pasakau „taip“ dar nespėjusi pasitikrinti, ar tikrai galiu.",
        score: 3
      },
      {
        id: "b",
        text: "Sustojusi įvertinu savo laiką bei jėgas ir atsakau pagal realias galimybes.",
        score: 0
      },
      {
        id: "c",
        text: "Atsisakau, bet jaučiu poreikį ilgai paaiškinti savo priežastis.",
        score: 1
      },
      {
        id: "d",
        text: "Sutinku, nes išbūti su kito nusivylimu atrodo sunkiau negu persitempti.",
        score: 2
      }
    ]
  },
  {
    id: 2,
    dimension: "connection",
    prompt:
      "Artimas žmogus nepritaria tavo svarbiam sprendimui. Kaip dažniausiai reaguoji?",
    options: [
      {
        id: "a",
        text: "Pradedu keisti savo sprendimą, kol jis kitam tampa priimtinesnis.",
        score: 3
      },
      {
        id: "b",
        text: "Pasakau, kad man nesvarbu, tačiau vėliau mintyse vis grįžtu prie pokalbio.",
        score: 2
      },
      {
        id: "c",
        text: "Išklausau, pasitikrinu jo argumentus, bet neatsisakau savo pasirinkimo vien dėl nepritarimo.",
        score: 0
      },
      {
        id: "d",
        text: "Iš pradžių imu gintis, tačiau nurimusi galiu grįžti ir pasikalbėti.",
        score: 1
      }
    ]
  },
  {
    id: 3,
    dimension: "anger",
    prompt: "Kaip dažniausiai atpažįsti, kad pyksti?",
    options: [
      {
        id: "a",
        text: "Suprantu tai tik tada, kai kūnas jau labai įsitempęs arba pratrūkstu.",
        score: 3
      },
      {
        id: "b",
        text: "Pirmiausia imu aiškinti sau, kodėl kitas žmogus taip pasielgė.",
        score: 2
      },
      {
        id: "c",
        text: "Pajuntu pyktį, atsitraukiu ir vėliau bandau jį įvardyti, nors tai ne visada lengva.",
        score: 1
      },
      {
        id: "d",
        text: "Pastebiu ankstyvą signalą ir pasitikrinu, kokia mano riba ar vertybė buvo paliesta.",
        score: 0
      }
    ]
  },
  {
    id: 4,
    dimension: "responsibility",
    prompt:
      "Tau svarbus žmogus išgyvena sunkų laikotarpį. Kas geriausiai apibūdina tavo reakciją?",
    options: [
      {
        id: "a",
        text: "Išklausau, paklausiu, kokios pagalbos jam reikia, tačiau neperimu atsakomybės už visą situaciją.",
        score: 0
      },
      {
        id: "b",
        text: "Iškart pradedu ieškoti sprendimų, net jei žmogus to neprašė.",
        score: 3
      },
      {
        id: "c",
        text: "Man sunku jaustis ramiai, kol kitas žmogus nesijaučia geriau.",
        score: 2
      },
      {
        id: "d",
        text: "Pasiūlau tiek pagalbos, kiek galiu suteikti, nors atsitraukusi dar pajuntu kaltę.",
        score: 1
      }
    ]
  },
  {
    id: 5,
    dimension: "worth",
    prompt: "Padarai klaidą svarbiame darbe. Kas vyksta tavo viduje?",
    options: [
      {
        id: "a",
        text: "Ilgai ją analizuoju, ieškau patvirtinimo ir stengiuosi papildomai įrodyti savo gebėjimus.",
        score: 2
      },
      {
        id: "b",
        text: "Norisi klaidą nuslėpti arba sumažinti, nes bijau prarasti kitų pagarbą.",
        score: 3
      },
      {
        id: "c",
        text: "Pripažįstu klaidą, kiek įmanoma ją ištaisau ir atskiriu rezultatą nuo savo vertės.",
        score: 0
      },
      {
        id: "d",
        text: "Iš pradžių pajuntu gėdą, tačiau vėliau galiu apie klaidą kalbėti ir iš jos mokytis.",
        score: 1
      }
    ]
  },
  {
    id: 6,
    dimension: "boundaries",
    prompt:
      "Žmogus užduoda asmeninį klausimą, į kurį nenori atsakyti. Ką dažniausiai darai?",
    options: [
      {
        id: "a",
        text: "Nusišypsau ir atsakau, nors viduje jaučiuosi nejaukiai.",
        score: 3
      },
      {
        id: "b",
        text: "Pasakau, kad apie tai kalbėti nenoriu, ir pakeičiu temą.",
        score: 0
      },
      {
        id: "c",
        text: "Pajuokauju arba nukreipiu pokalbį kitur, tiesiai neįvardydama ribos.",
        score: 1
      },
      {
        id: "d",
        text: "Tą akimirką sustingstu, o vėliau pykstu ant savęs, kad nieko nepasakiau.",
        score: 2
      }
    ]
  },
  {
    id: 7,
    dimension: "connection",
    prompt:
      "Tau svarbus žmogus staiga tampa šaltesnis nei įprastai. Kokia pirma tavo reakcija?",
    options: [
      {
        id: "a",
        text: "Imu ieškoti, ką pasakiau ar padariau ne taip.",
        score: 3
      },
      {
        id: "b",
        text: "Stengiuosi būti dar rūpestingesnė ir naudingesnė, kad atkurčiau artumą.",
        score: 2
      },
      {
        id: "c",
        text: "Pajuntu nerimą, tačiau tęsiu savo dieną ir prie situacijos grįžtu vėliau.",
        score: 1
      },
      {
        id: "d",
        text: "Primenu sau, kad kol kas tai tik mano spėjimas, ir prireikus paklausiu tiesiai.",
        score: 0
      }
    ]
  },
  {
    id: 8,
    dimension: "anger",
    prompt:
      "Žmogus kitų akivaizdoje nevykusiai pajuokauja apie tave. Kaip reaguoji?",
    options: [
      {
        id: "a",
        text: "Ramiai pasakau, kad toks juokas man netinka.",
        score: 0
      },
      {
        id: "b",
        text: "Nusijuokiu kartu, nors viduje pasidaro skaudu.",
        score: 3
      },
      {
        id: "c",
        text: "Nutylu, bet vėliau mintyse vis kartoju tai, ko nepasakiau.",
        score: 2
      },
      {
        id: "d",
        text: "Atsakau kandžiai, o vėliau bandau suprasti, kas mane taip stipriai palietė.",
        score: 1
      }
    ]
  },
  {
    id: 9,
    dimension: "responsibility",
    prompt:
      "Po įtemptos savaitės turi laisvą vakarą. Kaip dažniausiai jį praleidi?",
    options: [
      {
        id: "a",
        text: "Leidžiu sau ilsėtis tik atlikusi viską taip gerai, kaip iš savęs tikiuosi.",
        score: 2
      },
      {
        id: "b",
        text: "Atsisėdu pailsėti, tačiau mintyse vis dar stebiu, kam ko reikia ir ko dar nepadariau.",
        score: 3
      },
      {
        id: "c",
        text: "Pasirenku poilsį ar malonią veiklą nebandydama jos pirmiausia užsitarnauti.",
        score: 0
      },
      {
        id: "d",
        text: "Padarau vieną nedidelį darbą ir sąmoningai leidžiu sau sustoti.",
        score: 1
      }
    ]
  },
  {
    id: 10,
    dimension: "worth",
    prompt: "Sulauki nuoširdaus komplimento. Kas dažniausiai nutinka?",
    options: [
      {
        id: "a",
        text: "Paaiškinu, kad man tiesiog pasisekė arba kad tai nebuvo taip sunku.",
        score: 2
      },
      {
        id: "b",
        text: "Priimu komplimentą ir tiesiog padėkoju.",
        score: 0
      },
      {
        id: "c",
        text: "Jaučiuosi kiek nejaukiai, bet vėliau galiu leisti sau tuo pasidžiaugti.",
        score: 1
      },
      {
        id: "d",
        text: "Komplimentas greitai tampa nauju standartu, kurį dabar privalau išlaikyti.",
        score: 3
      }
    ]
  },
  {
    id: 11,
    dimension: "boundaries",
    prompt:
      "Šeima tikisi, kad dalyvausi ar padėsi, tačiau tai kertasi su tavo planais. Ką darai?",
    options: [
      {
        id: "a",
        text: "Sutinku, kad niekas nenusiviltų.",
        score: 3
      },
      {
        id: "b",
        text: "Atsisakau, tačiau sugalvoju „pakankamai rimtą“ priežastį.",
        score: 1
      },
      {
        id: "c",
        text: "Atidėlioju atsakymą ir galiausiai dažnai sutinku paskutinę minutę.",
        score: 2
      },
      {
        id: "d",
        text: "Įvertinu situacijos svarbą ir savo galimybes, tada priimu sprendimą, net jei jis kažkam nepatiks.",
        score: 0
      }
    ]
  },
  {
    id: 12,
    dimension: "connection",
    prompt:
      "Nubrėžus naują ribą tau pasako: „Tu pasikeitei. Anksčiau su tavimi buvo lengviau.“ Kaip reaguoji?",
    options: [
      {
        id: "a",
        text: "Pasitikrinu, ar mano riba pagarbi, tačiau vien dėl šios frazės jos neatšaukiu.",
        score: 0
      },
      {
        id: "b",
        text: "Sušvelninu ribą, kad įrodyčiau, jog vis dar esu gera.",
        score: 3
      },
      {
        id: "c",
        text: "Atšaunu arba visiškai nutraukiu pokalbį, kad nepasijusčiau kontroliuojama.",
        score: 1
      },
      {
        id: "d",
        text: "Ribą išlaikau, tačiau dar kelias dienas abejoju ir jaučiu kaltę.",
        score: 2
      }
    ]
  },
  {
    id: 13,
    dimension: "anger",
    prompt:
      "Žmogus pakartotinai peržengia ribą, apie kurią jau mėginai užsiminti. Ką darai?",
    options: [
      {
        id: "a",
        text: "Tikiuosi, kad jis pats supras mano užuominas.",
        score: 2
      },
      {
        id: "b",
        text: "Toleruoju, kol susikaupusi įtampa prasiveržia stipria reakcija.",
        score: 3
      },
      {
        id: "c",
        text: "Aiškiai įvardiju prašymą, pasekmę ir jos laikausi, jei elgesys kartojasi.",
        score: 0
      },
      {
        id: "d",
        text: "Pamažu mažinu bendravimą, tačiau nepasakau tikrosios priežasties.",
        score: 1
      }
    ]
  },
  {
    id: 14,
    dimension: "responsibility",
    prompt:
      "Tą pačią savaitę pagalbos prašo du žmonės, o tu pati esi išsekusi. Ką dažniausiai darai?",
    options: [
      {
        id: "a",
        text: "Sutinku padėti abiem, sumažindama savo miego ar poilsio laiką.",
        score: 3
      },
      {
        id: "b",
        text: "Įvertinu skubumą, aiškiai pasakau, kiek galiu, ir prireikus atsisakau.",
        score: 0
      },
      {
        id: "c",
        text: "Padedu vienam, tačiau jaučiuosi atsakinga už kito žmogaus nusivylimą.",
        score: 2
      },
      {
        id: "d",
        text: "Atidėlioju atsakymus, nes tiesiai pasakyti apie savo ribas sunku.",
        score: 1
      }
    ]
  },
  {
    id: 15,
    dimension: "worth",
    prompt:
      "Atsiranda galimybė, kurios iš tiesų nori, bet ji nedera prie „protingos, patikimos ir geros moters“ įvaizdžio. Kaip renkiesi?",
    options: [
      {
        id: "a",
        text: "Pasirenku saugesnį ir aplinkiniams priimtinesnį variantą, pavadindama jį praktišku.",
        score: 3
      },
      {
        id: "b",
        text: "Klausiu daugelio žmonių nuomonės, kol tampa sunku suprasti, ko noriu pati.",
        score: 2
      },
      {
        id: "c",
        text: "Pasirenku priešingai vien tam, kad įrodyčiau savo nepriklausomybę, o vėliau stipriai suabejoju.",
        score: 1
      },
      {
        id: "d",
        text: "Pirmiausia pasitikrinu, ko noriu ir kas dera su mano vertybėmis, tada priimu sprendimą.",
        score: 0
      }
    ]
  }
];

export const PROFILES: Record<ResultProfileId, ProfileDefinition> = {
  "tyli-taikdare": {
    id: "tyli-taikdare",
    title: "Tyli taikdarė",
    shareTitle: "Mano ryškiausias „geros mergaitės“ vaidmuo – Tyli taikdarė",
    statement: "Tu išsaugai ramybę, tačiau kartais jos kaina tampi tu.",
    summary:
      "Gali mėginti sumažinti įtampą dar prieš spėdama išgirsti save. Gali nutylėti, paaiškinti kito elgesį, nusišypsoti arba atsitraukti. Pyktis dėl to nebūtinai dingsta – kartais jis grįžta kaip vidinė įtampa, nuovargis, ašaros ar vėlyvas pratrūkimas.",
    innerRule: "Kad ryšys išliktų, neturiu kelti nepatogumo.",
    protection:
      "Ši strategija mėgina apsaugoti ryšį ir sumažinti konflikto kainą. Ji galėjo tapti svarbi aplinkoje, kur nesutikti, pykti ar turėti kitokią nuomonę buvo nesaugu.",
    strength:
      "Jautrumas žmonėms, gebėjimas matyti kelias puses ir kurti ramybę. Ši stiprybė lieka tavo net tada, kai ramybės nebereikia pirkti savo balsu.",
    signs: [
      "Pirmiau supranti kito priežastis, negu pripažįsti savo skausmą.",
      "Nusišypsai arba nutyli, nors kūnas jau įsitempęs.",
      "Tikslų atsakymą sugalvoji tada, kai pokalbis seniai baigėsi."
    ],
    practice: {
      title: "Pasakyk anksčiau",
      instruction:
        "Šiandien pastebėk vieną mažą nepasitenkinimą ir įvardyk jį dar prieš jam tampant susierzinimu. Trumpai, be ilgo pasiaiškinimo.",
      phrase: "„Man taip netinka.“ / „Noriu kitaip.“ / „Dabar negaliu.“"
    }
  },
  "visu-atrama": {
    id: "visu-atrama",
    title: "Visų atrama",
    shareTitle: "Mano ryškiausias „geros mergaitės“ vaidmuo – Visų atrama",
    statement: "Tu laikai kitus net tada, kai pati jau pradedi linkti.",
    summary:
      "Greitai pastebi, kam ko reikia, ir dažnai pradedi spręsti dar žmogui nė nepaprašius pagalbos. Rūpestis gali nepastebimai susilieti su atsakomybe: ilsėtis sunku, kol aplinkui kas nors kenčia, pyksta ar nesusitvarko.",
    innerRule: "Jeigu aš nelaikysiu, viskas subyrės.",
    protection:
      "Ši strategija mėgina kurti saugumą per naudingumą ir kontrolę. Kai esi reikalinga, gali atrodyti, kad ryšys bei tavo vieta jame tampa saugesni.",
    strength:
      "Patikimumas, jautrumas ir gebėjimas veikti sudėtingoje situacijoje. Sveikesnėje formoje tai tampa sąmoningu rūpesčiu, o ne automatine pareiga.",
    signs: [
      "Sprendimų ieškai dar nepaklaususi, ar jų iš tavęs reikia.",
      "Kito nusivylimą jauti kaip savo atsakomybę.",
      "Poilsį atidedi, kol visi aplinkui jausis gerai."
    ],
    practice: {
      title: "Grąžink atsakomybę ten, kur ji priklauso",
      instruction:
        "Kitą kartą, prieš puldama gelbėti, sustok, tris kartus lėtai iškvėpk ir atsakyk sau į tris klausimus.",
      phrase: "„Ar manęs prašė? Ar tai mano? Kiek galiu duoti nepalikdama savęs?“"
    }
  },
  nepriekaistingoji: {
    id: "nepriekaistingoji",
    title: "Nepriekaištingoji",
    shareTitle:
      "Mano ryškiausias „geros mergaitės“ vaidmuo – Nepriekaištingoji",
    statement:
      "Tu mėgini būti tokia gera, kad niekas neturėtų priežasties tavimi nusivilti.",
    summary:
      "Saugumo ir vertės jausmą dažnai kuri per gerą rezultatą, teisingą elgesį ir savikontrolę. Klaida gali skambėti ne kaip informacija apie vieną veiksmą, o kaip nuosprendis tau pačiai. Net komplimentas kartais tampa nauju standartu, kurį dabar privalai išlaikyti.",
    innerRule: "Esu verta, kai manimi nėra dėl ko nusivilti.",
    protection:
      "Ši strategija mėgina apsaugoti nuo gėdos, kritikos ir atstūmimo. Nepriekaištingumas žada: jei nepaliksi spragų, niekas negalės tavęs nuvertinti.",
    strength:
      "Atsakingumas, kokybės pojūtis ir gebėjimas ištesėti. Šios savybės nepradingsta, kai leidi sau būti žmogumi, o ne nuolatiniu projektu.",
    signs: [
      "Klaidą ilgai nešiojiesi kaip abejonę savo verte.",
      "Komplimentą sumenkini arba iškart paverti nauju standartu sau.",
      "Sunku pajusti, kad jau padarei pakankamai."
    ],
    practice: {
      title: "Atskirk kokybę nuo gėdos",
      instruction:
        "Kai norėsi dar kartą taisyti jau pakankamai gerą darbą, trumpam atitrauk rankas ir pajusk atramą po pėdomis.",
      phrase:
        "„Ar dabar gerinu rezultatą, ar mėginu nuraminti baimę, kad nesu pakankama?“"
    }
  },
  prisitaikanti: {
    id: "prisitaikanti",
    title: "Prisitaikanti",
    shareTitle: "Mano ryškiausias „geros mergaitės“ vaidmuo – Prisitaikanti",
    statement:
      "Tu greitai pajunti, ko reikia kitiems, tačiau savo norą kartais išgirsti vėliausiai.",
    summary:
      "Puikiai skaitai aplinką ir prisitaikai prie žmonių, nuotaikų bei lūkesčių. Skirtinguose santykiuose gali tapti vis kitokia savo versija. Kadangi tai vyksta greitai, savęs atsisakymas kartais atrodo kaip paprastas gerumas, lankstumas ar praktiškumas.",
    innerRule: "Kad likčiau priimta, turiu būti patogi.",
    protection:
      "Ši strategija mėgina išsaugoti priklausymo jausmą ir apsaugoti nuo atstūmimo. Ji padeda greitai nuskaityti aplinką, tačiau tavo balsą palieka paskutiniu informacijos šaltiniu.",
    strength:
      "Socialinis jautrumas, lankstumas ir gebėjimas kurti ryšį. Kai turi tvirtą ryšį su savimi, gali prisitaikyti neatsisakydama savęs.",
    signs: [
      "Savo nuomonę patikrini pagal kito veidą ar toną.",
      "Skirtinguose santykiuose tampi vis kitokia savo versija.",
      "Kai sprendi, ko nori, kitų balsai greitai užgožia tavąjį."
    ],
    practice: {
      title: "Vienas pasirinkimas be pasiaiškinimo",
      instruction:
        "Trumpam pajusk atramą po pėdomis ir garsiai įvardyk bent vieną mažą savo pasirinkimą. Neįrodinėk, kad jis teisingas, ir nepaversk jo atsiprašymu.",
      phrase: "„Aš noriu šito.“ / „Man labiau patinka taip.“ / „Šį kartą nedalyvausiu.“"
    }
  },
  "kelios-strategijos": {
    id: "kelios-strategijos",
    title: "Kelios strategijos kartu",
    shareTitle:
      "Mano atsakymuose kelios „geros mergaitės“ strategijos veikia kartu",
    statement:
      "Viena vidinė užduotis, keli būdai išsaugoti ryšį, saugumą ar pripažinimą.",
    summary:
      "Tavo atsakymuose nėra vieno aiškiai dominuojančio „geros mergaitės“ vaidmens. Priklausomai nuo situacijos, gali nutylėti ribas, perimti kitų atsakomybę, slopinti pyktį arba mėginti savo vertę įrodyti rezultatais. Tai nereiškia, kad tavo situacija sunkesnė – greičiau panašią vidinę užduotį skirtingomis aplinkybėmis sprendi keliais būdais.",
    innerRule:
      "Turiu prisitaikyti taip, kaip šioje situacijoje atrodo saugiausia.",
    protection:
      "Šios strategijos mėgina išsaugoti ryšį, saugumą ar pripažinimą. Kuri iš jų įsijungia, gali priklausyti nuo žmogaus, situacijos ir tuo metu patiriamos įtampos.",
    strength:
      "Jautrumas kontekstui, platus situacijos matymas ir gebėjimas rasti skirtingų būdų išbūti santykyje. Atrama savyje leidžia šias savybes rinktis sąmoningiau.",
    signs: [
      "Vienose situacijose nutyli, kitose skubi gelbėti ar padaryti nepriekaištingai.",
      "Tavo automatinė reakcija gali keistis priklausomai nuo santykio ir aplinkybių.",
      "Skirtingas strategijas gali jungti tas pats polinkis savo poreikį išgirsti vėliausiai."
    ],
    practice: {
      title: "Trys klausimai prieš automatinę reakciją",
      instruction:
        "Trumpam pajusk atramą po pėdomis, lėtai iškvėpk ir prieš atsakydama pasitikrink tris dalykus.",
      phrase:
        "„Ką dabar jaučiu? Ko iš tiesų noriu? Kas čia yra mano atsakomybė, o kas – ne?“"
    }
  },
  "savo-puseje": {
    id: "savo-puseje",
    title: "Vis labiau savo pusėje",
    shareTitle: "Mano rezultatas – vis labiau savo pusėje",
    statement:
      "Ryšys su kitais tau vis rečiau reikalauja nutraukti ryšį su savimi.",
    summary:
      "Tavo atsakymai rodo, kad „geros mergaitės“ prisitaikymo modeliai šiuo metu nėra labai ryškūs. Gali būti, kad jau gebi išlaikyti savo ribas, toleruoti kitų nepasitenkinimą ir nebesieti savo vertės vien su tuo, kiek padarai dėl kitų.",
    innerRule: "Galiu rinktis save ir likti ryšyje su kitu.",
    protection:
      "Tai nereiškia, kad senos reakcijos niekada nepasirodo. Skirtinguose santykiuose ir patiriant daugiau įtampos galime elgtis nevienodai.",
    strength:
      "Gebėjimas girdėti save, išbūti kitų reakcijas ir priimti sprendimus pagal savo vertybes. Tai ne galutinė būsena, o santykis su savimi, kurį toliau kuri.",
    signs: [
      "Ribą gali išlaikyti net tada, kai kitam ji nepatinka.",
      "Kito jausmą matai, bet neprivalai jo sutvarkyti.",
      "Klaida ar nesutarimas vis rečiau tampa nuosprendžiu tavo vertei."
    ],
    practice: {
      title: "Pastebėk, ką jau darai kitaip",
      instruction:
        "Prisimink vieną neseną situaciją, kurioje neišdavei savęs vien tam, kad išvengtum nepatogumo. Leisk kūnui akimirką užfiksuoti šią naują patirtį.",
      phrase: "„Aš galiu būti savo pusėje ir likti gyvame ryšyje.“"
    }
  }
};
