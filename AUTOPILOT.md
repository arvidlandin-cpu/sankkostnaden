# Sänk Kostnaden – Autopilot

## North star

Autopiloten optimerar för **långsiktigt godkänd affiliateintäkt per relevant besökare**. Trafik, ranking, CTR och affiliate-klick är delmål, inte slutmål.

## Två lager

1. **GitHub Actions = sensorer + skyddsräcken.** Den hämtar GA4, Search Console, Adtraction, Addrevenue och partnerhälsa, reducerar allt till ett maskinläsbart beslutspaket och stoppar aggressiva ändringar när signalen är för svag.
2. **ChatGPT = operativ projektledare.** Den läser senaste beslutspaketet, kontrollerar aktuell kod och pågående experiment och får genomföra lågriskåtgärder utan att fråga ägaren mellan varje steg.

Ingen extern AI-API-nyckel behövs i GitHub och ingen ny betald SaaS krävs.

## Autonomt tillåtet

- reparera mätning, attribution och tydliga tekniska fel;
- genomföra ett avgränsat snippet-test när Search Console-signalen passerar tröskeln;
- genomföra ett avgränsat CRO-test när organisk funnel-data har tillräckligt stickprov;
- testa, QA:a, skapa PR och slå ihop reversibla lågriskändringar när kontrollerna passerar;
- utvärdera pågående experiment när minsta observationstid har gått och behålla, justera eller återställa utifrån data.

## Ska eskaleras till ägaren

Nya betaltjänster, betald annonsering, nya partneravtal, större borttagning av kategorier/erbjudanden, juridik/compliance och breda SEO-ombyggnader.

## Guardrails

- Max ett tillväxtexperiment åt gången.
- Ett aktivt experiment får inte störas av nya SEO/CRO-tester innan utvärderingsgrinden.
- Teknisk mätning och attribution får repareras även när ett experiment pågår.
- Låg trafik betyder **vänta**, inte fylla sajten med fler ändringar.
- Ingen rå persondata, order-ID, klick-ID eller privata API-uppgifter får lagras i artefakterna.
- Om källdata saknas eller blir gammal ska autopiloten markera läget som degraderat/blockerat i stället för att gissa.

## Daglig rytm

GitHub kör kontrollen dagligen efter nattens datainsamling. ChatGPT granskar därefter senaste kontrollen. Om inget passerar en åtgärdströskel görs ingenting. Ägaren ska inte få en daglig störning bara för att systemet har tittat på data.

## Tillstånd

`autopilot/state.json` är den lilla permanenta journalen för pågående experiment och senaste autonoma åtgärd. När ChatGPT genomför ett nytt experiment ska filen uppdateras i samma ändring så att nästa körning känner till spärren.
