import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, PiggyBank } from 'lucide-react';

const rows = [
  ['Boende', 'boende', 'Hyra/avgift, ränta och andra återkommande boendekostnader'],
  ['Transport', 'transport', 'Bil, kollektivtrafik, finansiering och andra återkommande resor'],
  ['El', 'el', 'Elhandel och elnät – använd helst senaste fakturans normaliserade månadskostnad'],
  ['Bredband', 'bredband', 'Bredband och eventuell utrustning'],
  ['Mobil', 'mobil', 'Hela hushållets mobilabonnemang'],
  ['Försäkringar', 'forsakring', 'Hem, bil, barn, djur och övriga försäkringar'],
  ['Streaming & media', 'media', 'TV, film, musik, spel och digitala prenumerationer'],
  ['Övriga abonnemang', 'ovrigt', 'Andra återkommande medlemskap och tjänster'],
] as const;

type Key = typeof rows[number][1];
type Values = Record<Key, string>;

const empty = Object.fromEntries(rows.map(([, key]) => [key, ''])) as Values;
const links: Partial<Record<Key, {href:string; label:string}>> = {
  el: {href:'/elavtal/jamfor-elavtal/', label:'Kontrollera elavtalet'},
  bredband: {href:'/bredband/bredband-pa-min-adress/', label:'Kontrollera bredband'},
  mobil: {href:'/mobil/billigaste-mobilabonnemanget/', label:'Kontrollera mobil'},
  forsakring: {href:'/forsakring/jamfor-forsakring/', label:'Kontrollera försäkring'},
};

export default function Hushallskostnadskoll() {
  const [values, setValues] = useState<Values>(empty);
  const parsed = useMemo(() => Object.fromEntries(rows.map(([,key]) => [key, Math.max(0, Number((values[key] || '0').replace(',', '.')) || 0)])) as Record<Key,number>, [values]);
  const total = Object.values(parsed).reduce((a,b)=>a+b,0);
  const annual = total * 12;
  const controllable = (['el','bredband','mobil','forsakring','media','ovrigt'] as Key[]).reduce((a,k)=>a+parsed[k],0);
  const ranked = (Object.entries(parsed) as [Key,number][]).filter(([k,v])=>v>0 && links[k]).sort((a,b)=>b[1]-a[1]);
  const next = ranked[0]?.[0];

  return <>
    <Head>
      <title>Hushållskostnadskollen 2026 – räkna dina fasta kostnader</title>
      <meta name='description' content='Gratis hushållskostnadskoll. Fyll i dina verkliga månadskostnader och se total årskostnad samt vilka återkommande avtal som är mest värda att kontrollera.'/>
      <link rel='canonical' href='https://sankkostnaden.se/verktyg/hushallskostnadskollen/'/>
      <meta name='robots' content='index,follow,max-image-preview:large'/>
      <meta property='og:type' content='website'/>
      <meta property='og:title' content='Hushållskostnadskollen 2026 – räkna dina fasta kostnader'/>
      <meta property='og:description' content='Fyll i hushållets verkliga månadskostnader och se totalen per månad och år.'/>
      <meta property='og:url' content='https://sankkostnaden.se/verktyg/hushallskostnadskollen/'/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:'Hushållskostnadskollen',description:'Gratis verktyg för att summera hushållets verkliga månadskostnader och se totalen per månad och år.',url:'https://sankkostnaden.se/verktyg/hushallskostnadskollen/',applicationCategory:'FinanceApplication',operatingSystem:'Web',isAccessibleForFree:true}) }} />
    </Head>
    <header className='topbar'><Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link></header>
    <main>
      <section className='guideHero'><div className='guideWrap'><Link className='back' href='/'><ArrowLeft size={16}/> Startsidan</Link><div className='guideIcon'><Calculator size={25}/></div><p className='kicker'>GRATIS VERKTYG • 2026</p><h1>Hushållskostnadskollen</h1><p className='lead'>Se vad dina återkommande kostnader faktiskt blir på ett år. Fyll i det du betalar i dag – verktyget jämför inte mot ett påhittat normalhushåll.</p></div></section>
      <article className='article guideWrap'>
        <div className='note'><strong>Börja med verkliga belopp.</strong> Ta gärna senaste fakturorna eller kontoutdraget. Lämna en rad tom om den inte gäller ditt hushåll.</div>
        <div style={{display:'grid',gap:12,margin:'28px 0'}}>
          {rows.map(([label,key,help]) => <label key={key} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 150px',gap:14,alignItems:'center',padding:'14px 0',borderBottom:'1px solid #e1e5df'}}>
            <span><strong>{label}</strong><small style={{display:'block',color:'#68736c',marginTop:4}}>{help}</small></span>
            <span style={{display:'flex',alignItems:'center',gap:7}}><input aria-label={`${label}, kronor per månad`} inputMode='decimal' value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value.replace(/[^0-9,.]/g,'')})} placeholder='0' style={{width:'100%',padding:'12px',border:'1px solid #cfd7ce',borderRadius:10,fontSize:16,textAlign:'right'}}/><b>kr</b></span>
          </label>)}
        </div>
        <div className='decisionPanel' aria-live='polite'><div><p className='partnerEyebrow'>DIN KOSTNADSBILD</p><h2>{total ? total.toLocaleString('sv-SE') : '0'} kr/mån</h2><p>Det motsvarar <strong>{annual.toLocaleString('sv-SE')} kr per år</strong>. Av detta ligger {controllable.toLocaleString('sv-SE')} kr/mån i poster som ofta går att kontrollera eller jämföra utan att ändra själva boendet eller transportbehovet.</p></div><div className='decisionMetrics'><span><b>{Math.round(annual/1000)}</b> tkr/år</span><span><b>{Math.round(controllable)}</b> kr kontrollerbart/mån</span></div></div>
        {next && links[next] && <><h2>Börja med en stor jämförbar post</h2><p>Av de jämförbara poster du fyllt i är <strong>{rows.find(([,k])=>k===next)?.[0].toLowerCase()}</strong> störst. Det betyder inte automatiskt att den är för dyr, men den är en rimlig plats att kontrollera pris, innehåll och villkor först.</p><div className='intentActions'><Link className='primary' href={links[next]!.href}>{links[next]!.label} <ArrowRight size={16}/></Link><Link className='secondary' href='/guide/arskoll-fasta-kostnader/'>Öppna hela årskollen</Link></div></>}
        <h2>Så ska resultatet användas</h2><p>Konsumentverket beskriver sina hushållskostnader som ungefärliga referensvärden och rekommenderar att man utgår från egna kostnader när de finns. Myndighetens beräkningar omfattar ungefär 40 procent av hushållens totala utgifter och inkluderar bland annat internet/mobil, hemförsäkring och hushållsel, medan boende och transport inte ingår eftersom variationen är stor.</p>
        
        <div className='trafficLinks'><a href='https://www.konsumentverket.se/ekonomi/vilka-kostnader-har-ett-hushall/' target='_blank' rel='noreferrer'><strong>Konsumentverket: Hushållskostnader 2026</strong><span>Referensvärden, omfattning och metod →</span></a><Link href='/guide/hushallets-fasta-kostnader-2026/'><strong>Vår checklista för fasta kostnader</strong><span>Gå igenom hushållet post för post →</span></Link></div>
        <p className='disclosure'>Uppgifterna du fyller i beräknas lokalt i webbläsaren och skickas inte in av verktyget. Sänk Kostnaden kan finansieras genom affiliatelänkar som markeras tydligt.</p>
      </article>
    </main>
  </>;
}
