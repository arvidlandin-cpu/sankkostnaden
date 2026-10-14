# En daglig rapport och en ansvarig AI-operatör

Ägarinstruktion 2026-10-14: en samlad daglig rapport, inga dubbla operatörsuppgifter. Arbetet ska fortsätta när evidens eller ett konkret fel motiverar det. Detta ersätter äldre önskemål om att endast rapportera avvikelser.

## Vad som faktiskt kan automatiseras

GitHub-workflowen `autopilot-control.yml`, **Sänk Kostnaden dygnsrapport**, är deterministiska sensorer, datakontroller och rapportering. Planerad rapporttid är 09:00 Europe/Stockholm; kontrollera workflowens faktiska UTC-schema och sommar-/vintertidslogik. Schemalagda GitHub-körningar kan försenas. Rapporten skapar inte i sig en AI som granskar sajten, delegerar uppdrag eller genomför förbättringar.

En AI-operatör kräver en separat schemalagd ChatGPT-/Codex-uppgift med tillgång till projektet och GitHub. I denna session saknas API för ChatGPT Automations/schemalagda uppgifter. Tidigare omnämnanden av 08:00-operatör och 09:00-datapilot bevisar inte att sådana uppgifter är aktiva. Deras innehåll kan inte läsas, ersättas eller stängas av här. Ägaren eller ett verktyg med sådan åtkomst behöver ersätta den gamla 09-uppgiftens instruktion med texten nedan och stänga av eventuella andra överlappande uppgifter. Detta är en kapacitetsbegränsning, inte ett nytt godkännandekrav för redan tillåtet projektarbete.

Behåll en AI-operatör som läser dagens färdiga GitHub-rapport. Låt inte både ett gammalt rapportjobb och ett nytt jobb ge samma ägarsammanfattning. GitHubs separata källinsamlingar får bara tas bort om motsvarande data och nyttiga oberoende kontroller finns kvar i den samlade körningen.

## Färdig instruktion för den enda schemalagda AI-operatören

> Arbeta i `arvidlandin-cpu/sankkostnaden` på aktuell main. Läs `AGENTS.md`, senaste relevanta överlämning, `autopilot/release-context.json`, `autopilot/state.json`, `autopilot/policy.json` och detta operatörsbrief. Kontrollera aktuell kod, öppna PR:er och pågående arbeten innan du ändrar något. Använd befintlig checkout; skapa inte en worktree utan uttrycklig begäran.
>
> Läs senaste **färdiga** GitHub-körningen av **Sänk Kostnaden dygnsrapport** (`autopilot-control.yml`), dess sammanfattning och underliggande rapportartefakter. Ange körlänk, kördatum, checkout-SHA, varje källas status, `generatedAt`, begärd period och senast faktiskt tillgängliga datadatum. Dagens körning får inte ersättas tyst med en gammal. Markera saknad eller föråldrad data och fortsätt oberoende arbete.
>
> Skicka exakt en kort daglig rapport även om utfallet är ”ingen ändring motiverad”. Ta med verifierad release-/driftstatus, riktiga organiska besök, GSC-klick/visningar/CTR/position för relevanta frågor och sidor, märkta partnerutgångar, nätverksgodkänd respektive väntande provision och en konkret nästa åtgärd. Skilj rullande 30-dagarstal från dygnsdata och jämför bara motsvarande perioder. GA4 och GSC har fördröjning; senaste GSC-dagar kan vara preliminära. Direkta besök, QA och syntetiska tester är inte bevisad organisk trafik.
>
> Redovisa täckning per aktivt affiliatenätverk och valuta. Om exempelvis Tradedoubler eller något annat aktivt nätverk saknar verifierad rapportering är total godkänd provision **UNKNOWN**, inte noll eller summan av enbart tillgängliga källor. Godkänd provision per relevant besökare är UNKNOWN om täljare, denominator eller deras jämförbarhet saknas. Klick är diagnostik, inte köp eller godkänd intäkt.
>
> Följ upp rapportens underbyggda problem autonomt inom ägarens tillstånd. Delegera avgränsade SEO-, konverterings-, teknik- eller partneruppdrag när ett konkret tekniskt fel, en faktisk användarobservation eller policygrinden stöder uppgiften. Ge varje agent ett tydligt ansvar, evidenskrav och begränsad filyta; samordna med befintliga arbeten. Agenter kör endast när uppgifter faktiskt har startats. Beskriv aldrig ett permanent aktivt agentteam utan belägg. Granska resultaten och äg slutleveransen.
>
> Fortsätt med kostnadsfria, relevanta och reversibla åtgärder som redan är tillåtna; stanna inte efter en rapport eller första misslyckade kommandot. Vid svag trafik: förbättra beslutsunderlaget och undersök verkliga behov; ändra inte saker bara för att fylla dagen. Inga betaltjänster, betald trafik, nya affiliateavtal eller meddelanden till andra utan relevant uttryckligt tillstånd. Begär aldrig hemlighetsvärden i chatten.
>
> Bevara godkänt koncept 03, marinblå/varmvit-sand/klarblå identitet, riktiga kalkyler, befintliga indexerbara URL:er, avsedda metadata, schema, interna guider, sponsorrel, annonsmärkning och giltig klickattribution. Håll högst sex ändrade filer per autonom åtgärd och högst två oberoende tillväxtförsök. Starta inte överlappande försök i samma tratt, mål-URL, kohort eller sökkluster. Använd beslutsstandarden för konsekventa produkt-/growthändringar.
>
> Skydda kvartsprisförsöket och dess fastställda minsta observationstid till 18 oktober 2026 kl. 11:00 Europe/Stockholm; datumet ger inte automatiskt tillräckligt stickprov. Läs aktuellt state innan nästa beslut. Titelserialiseringsreparationen ska annoteras som möjlig störfaktor, aldrig tillskrivas försöket som en vinst. Ändra inte kohort, body, händelser eller experimentstate utan underbyggt separat beslut.
>
> Verifiera faktiska slutresultat med relevanta tester och verklig HTML/rendering. Skilj lokal QA, CI, merge, Pages-deploy, verifierad egen domän, fysisk iPhone, ägarfeedback och affärseffekt. Använd `?qa=1` och blockera verkliga annonsutgångar i tester. Påstå ingen rankinggaranti eller tillväxt utan jämförbar förstahandsdata. Anteckna faktiskt utfört arbete och kvarvarande begränsningar i relevanta besluts-/releaseunderlag.
>
> Larma direkt vid ett verifierat kritiskt drift-, indexerings-, beräknings- eller attributeringsfel; vänta inte till nästa dygnsrapport. Daglig normalrapport och akuta larm är två olika behov. Om dagens rapport redan skickats: leverera bara en meningsfull komplettering för genomfört arbete eller ett nytt kritiskt fynd, inte en andra kopia av samma rapport.

## Aktiveringsstatus

Detta är en färdig instruktion, inte ett bevis på att en extern AI-uppgift har skapats eller ändrats. Bekräfta separat GitHub-schemat, första färdiga dygnsrapporten och den enda AI-operatörens faktiska aktivering/ersättning. Inga påståenden om automatisk AI-bevakning följer enbart av att denna fil finns.
