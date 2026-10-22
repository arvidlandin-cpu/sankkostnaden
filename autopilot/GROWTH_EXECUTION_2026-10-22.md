# Fortsättning 22 oktober 2026

Ägaruppdrag: fortsätt projektet och läs senaste dagarnas noteringar. Besluten i [20–21 oktober](GROWTH_EXECUTION_2026-10-20.md) och [BRF-piloten](distribution/BRF_EDITORIAL_PILOT_2026-10-21.md) gäller. Inga mejl, nya avtal, köpt trafik eller produktbyggen som ersättning för distribution. Ett exakt externt meddelande ska fortfarande granskas och godkännas enligt noteringen från 20 oktober.

## Faktiskt underlag

[Dagens samlade rapport 39741368546](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/39741368546) avser GA4/GSC **22 september–21 oktober**, inte ett dygn: 20 organiska sessioner, 6 inkommande Google-klick och 2027 sökvisningar. BRF-sidan har 483 visningar utan klick. Nätverkens period är separat, **23 september–22 oktober**. Addrevenue och Adtraction rapporterar noll godkända och noll väntande affärer för sina perioder. Tradedoubler saknar verifierat underlag; total godkänd provision är därför **UNKNOWN**.

[Utökad faktisk Google-körning 39780355308](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/39780355308) visar att de 10 organiska partnerklickshändelserna kom från **två registrerade användare**. Sajtens 74 klickhändelser kom från 15 registrerade användare över alla kanaler. Kanalgrupper får inte summeras till unika personer, och det går inte att dra slutsatsen att alla dessa användare är nya eller kvalificerade kunder. Fyra nya organiska användare registrerades i perioden. BRF-kampanjen har inga registrerade rader; inget redaktionellt utskick har genomförts.

Google URL Inspection bekräftar indexering och rätt canonical för BRF-guiden, jämför-elavtal och kvartspris. Senaste crawl var 13 oktober för BRF, 25 september för jämför-elavtal och 14 oktober för kvartspris. Detta är status för Googles indexerade version, inte en rankinggaranti eller ett live-test.

## Genomförd mätförbättring — PR #175

Den redan öppna [PR #175](https://github.com/arvidlandin-cpu/sankkostnaden/pull/175) granskades och kompletterades. Den skiljer nu klickhändelser från deduplicerade användare, hämtar organiska innehållslandningar och BRF-källor, skiljer slutbehandlad GSC från preliminära data och visar faktisk URL Inspection. Queryparametrar hämtas inte för de nya landningsraderna. Både `/app` och `/app/` utesluts efter att det skarpa API-svaret visade båda formerna. Privata parametrar och känsliga källetiketter skyddas i dygnsrapporten. Jämförelseperioder måste ligga inom frågad dataperiod; position och CTR är UNKNOWN utan visningar.

57 riktade tester, check, integrity och diffkontroll passerar lokalt. Verkliga Google-anrop har också passerat. Slutlig merge och CI-status ska läsas från PR och dess main-körningar; en tidigare grön källa ersätter inte sista revisionens bevis.

## Kvartspris: fortsatt observation

Nu finns ett verkligt **sidfiltrerat, final-only** underlag för **11–20 oktober**, från första hela GSC-dagen efter ändringen i Pacific-tid. Utfallet är 10 kompletta dagar, **13 visningar och 0 klick**. Minimikravet på 30 visningar är inte uppfyllt. Fortsätt observationen; deklarera ingen vinnare, förlust eller intäktseffekt. Sajtens totala sjudagarsjämförelse får inte användas som sidkohort. Titelreparationen och andra samtidiga releaser kvarstår som möjliga störfaktorer. Ingen experimentsida, DOM, händelse, metadata eller state ändrades här.

## Drift: prisleveransens följdkontroll

De automatiska prisuppdateringarna använder `GITHUB_TOKEN`; deras push startar därför inte nästa Actions-workflow. Detta förklarade uteblivna leveranskontroller 21–22 oktober, men var inte bevis på felaktiga priser. [Manuell kontroll 39779241110](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/39779241110) verifierade exakt `7c557b99ac4b5953a3bd3ffa3b8dd02c0605bdbf` på immutable Pages och egen domän.

[PR #176](https://github.com/arvidlandin-cpu/sankkostnaden/pull/176) reparerar kedjan med `workflow_run` efter lyckad prisrefresh på samma repositories main. Den kontrollerar faktiskt utcheckad main-SHA, inte refresherns äldre start-SHA. Läsbehörigheter och PR:s lokala formatkontroll bevaras; inga artifacts exekveras och ingen workflowloop introduceras. Före- och efterkontroller av patchen passerar. Verifiera den riktiga följdkörningen efter merge.

## Distribution och åtkomst

Byggahus aktuella [regler](https://www.byggahus.se/regler) förbjuder reklam och företagsdeltagande utan särskilt tillstånd (§6 och §6.1). Ett eget kommersiellt verktygsinlägg är därför inte en tillåten publicering där. Relevanta forumdiskussioner är inte i sig en inbjudan. Inget inlägg, PM, mejl eller konto skapades. De befintliga redaktionella utkasten är fortfarande **prepared**, inte **sent** eller **published**. Återuppta inte mailspåret och tillverka inte en avsändaridentitet.

Nästa distributionssteg behöver en uttryckligen tillåten offentlig kanal och faktisk behörig kontoåtkomst, följt av granskning av exakt text. Den befintliga medlemsrutan är förberedd i BRF-piloten och behöver inte byggas om till ett nytt verktyg. Behåll BRF som enda distributionsspår vid sidan av kvartsprisobservationen.

## Kvarvarande intäktsbegränsning

Tradedoubler-data och faktisk förstapartsreferens till nätverksgodkänd affär är inte verifierade. Lokalt förberedda importfiler från 15 oktober är inte en kopplad datakälla och har inte integrerats eller publicerats i denna leverans. Ingen partnerordning, affiliatelänk, EPI/subID eller provision har ändrats för att dölja luckan.
