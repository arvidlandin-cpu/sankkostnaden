import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, PiggyBank } from 'lucide-react';

export default function Cookies() {
  return (
    <>
      <Head><title>Cookiepolicy – Sänk Kostnaden</title><meta name='description' content='Information om cookies och mätning på Sänk Kostnaden.' /><link rel='canonical' href='https://sankkostnaden.se/cookies/' /></Head>
      <header className='topbar'><Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22} /></span><span>Sänk Kostnaden</span></Link></header>
      <main><section className='guideHero'><div className='guideWrap'><Link className='back' href='/'><ArrowLeft size={16} /> Startsidan</Link><p className='kicker'>COOKIES</p><h1>Cookiepolicy</h1><p className='lead'>Här beskriver vi hur Sänk Kostnaden använder cookies och liknande teknik.</p></div></section>
      <article className='article guideWrap'><h2>Vad är cookies?</h2><p>Cookies är små filer eller uppgifter som kan sparas i eller läsas från din webbläsare. De används bland annat för teknisk funktion, statistik och för att mäta hur en webbplats används.</p><h2>Google Analytics</h2><p>Sänk Kostnaden använder Google Analytics för att förstå hur webbplatsen används, till exempel vilka sidor som besöks. Google Analytics kan använda cookies och liknande teknik för mätningen.</p><h2>Affiliate- och partnerlänkar</h2><p>Sänk Kostnaden kan innehålla tydligt markerade kommersiella länkar. När sådana länkar är aktiva kan en extern leverantör eller ett affiliatenätverk använda cookies eller annan spårning för att registrera att ett besök eller köp kommit från Sänk Kostnaden. Detta gör det möjligt att mäta hänvisningar och eventuell provision.</p><h2>Sessions- och klickmätning</h2><p>För intern mätning av vägen från ett verktyg till ett partnerklick kan vi skapa ett slumpmässigt sessions-ID i webbläsarens sessionStorage och ett nytt lokalt klick-ID för varje partnerklick. Syftet är att kunna koppla ihop händelser inom samma webbläsarsession. För affiliatenätverk där en klickreferens är verifierad kan det slumpmässiga lokala klick-ID:t skickas med i själva partnerklicket, exempelvis som EPI eller clickRef, så att ett senare köp kan kopplas till rätt klick. Identifierarna innehåller inte namn, e-postadress eller de exakta hushållsbelopp som fylls i i Kostnadskollen.</p><h2>Hantera cookies</h2><p>Du kan radera eller blockera cookies i inställningarna i din webbläsare. Om vi aktiverar ytterligare teknik som enligt tillämpliga regler kräver samtycke ska webbplatsens information och samtyckeshantering uppdateras innan den tekniken används.</p><p>Senast uppdaterad: 6 oktober 2026.</p></article></main>
    </>
  );
}
