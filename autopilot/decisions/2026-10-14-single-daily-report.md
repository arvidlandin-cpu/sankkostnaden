# En samlad dygnsrapport, 14 oktober 2026

Ägaren har godkänt skarp publicering och bett om en enda daglig rapport, borttagna dubbla rapporter och motiverade agentuppdrag efter uppföljningen. Kostnadskartans main-release `2ce912d` är publicerad via Cloudflare Pages. [Main Build](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/38622232817) och [kommersiell Chromium/WebKit-regression samt skarpa användarflöden](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/38622231424) passerade.

## Problem och avgränsning

Sex separata datainsamlingsscheman överlappade. Den gamla rapporten saknade dagligt bevis för vilken release egen domän serverar. Huvudjobbet blir `autopilot-control.yml`, planerat till 09:00 Europe/Stockholm med två UTC-slots och en tidszonsgrind. Fem fristående datarapporters cron har tagits bort; manuell diagnostik, teknisk browserbevakning och spotprisuppdateringar behålls. Nätverksaggregatet härleds från redan hämtade prestandarapporter, utan dubbla API-hämtningar.

En svensk huvudrapport visar verkliga perioder, organiska sessioner, sajtens organiska partnerutgångar, inkommande Google-klick/visningar/CTR/position, högst fem sökfrågor och söklandningssidor, godkänd/väntande provision per nätverk och valuta, källhälsa, publiceringsbevis samt en rekommenderad åtgärd. Underlaget saknar sajtövergripande GA4-landningssidor; appdata får inte ersätta dessa. Rullande 30-dagarsdata är inte gårdagens utfall. GSC:s senaste dagar kan vara preliminära.

## Risk och skydd

Ingen webbsida, partnerlänk, attribution, kalkyl eller experimentstate ändras i denna rapportåtgärd. Saknad, misslyckad, ofullständig eller olikvalutig data blir UNKNOWN. Alla aktiva nätverk måste täckas för en total; Tradedoubler saknar här motsvarande auktoritativa rapport. Ingen organisk intäkt per session fabriceras. Den tekniska titelreparationens möjliga störverkan på kvartsprisförsöket kvarstår enligt SEO-beslutet. GitHub-schema kan starta försenat.

## Faktisk verifiering

38 rapport-/beslutstester passerar. Wrappern har provats med både helt saknade och felaktiga JSON-källor: rapportfiler produceras och processen markerar BLOCKED. YAML och Python-syntax passerar. [Första verkliga huvudkörningen](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/38624285580) för granskningens checkout `15c243b` lyckades: Google, affiliateaggregat, Addrevenue, Adtraction och partnerhälsa är `ok`; aktuell main-produktion är `verified`. Källans 30-dagarsperiod gav 30 organiska sessioner och 10 organiska partnerutgångar. Totalprovision är UNKNOWN. Detta bevisar varken dygnstillväxt eller förbättring från designen.

Produktionsverifieraren hämtar aktuell main-SHA, hittar dess lyckade Pages-check och jämför egen domäns HTML-refererade JS/CSS med den oföränderliga deployens filer via SHA256 samt illustrationens källhash. Alla 63 etablerade sidors exakta titlar/beskrivningar/canonical kontrolleras, liksom noindex, robots och sitemap. Granskningens separata [previewkontroll](https://github.com/arvidlandin-cpu/sankkostnaden/actions/runs/38624285742) passerade 63/63 metadata och 11 assetbevis för `15c243b`. Denna körning är preview; huvudkörningen ovan verifierar produktion. Det är HTTP- och leveransbevis, inte Googles index/ranking eller fysisk iPhone.

## Återstående extern aktivering

GitHub publicerar `daily-report.md`/JSON i sin jobbsammanfattning och artefakt. Regelstyrda planerade agentuppdrag är inte utförd AI. Verktyg för ChatGPT:s schemalagda uppgifter saknas i denna session; den befintliga uppgiften omkring kl. 09 kan inte läsas, ersättas eller stängas av här. [Färdigt operatörsbrief](../DAILY_OPERATING_BRIEF_2026-10-14.md) ska användas för en enda faktiskt aktiverad AI-uppgift. Det går inte att lova en chattnotis eller daglig agentstart från ett GitHub-cron ensamt.

Återställning sker genom att återställa de avgränsade rapporteringscommitterna; webbproduktens och experimentets state behöver inte ändras. Efter överföring till main ska den första main-rapporten och skarpa releaseverifieringen kontrolleras separat.
