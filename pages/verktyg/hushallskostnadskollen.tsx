import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calculator, PiggyBank } from 'lucide-react';
import { costCheckStorageKey, emptyCostAnswers, normalizeCostAnswers } from '../../lib/costPrioritizer';
import { emitAnalyticsEvent } from '../../lib/clientAttribution';

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
type Values = Record<Key,string>;

const empty=Object.fromEntries(rows.map(([,key])=>[key,''])) as Values;
const links:Partial<Record<Key,{href:string;label:string}>>={
  el:{href:'/elavtal/jamfor-elavtal/',label:'Kontrollera elavtalet'},
  bredband:{href:'/bredband/bredband-pa-min-adress/',label:'Kontrollera bredband'},
  mobil:{href:'/mobil/billigaste-mobilabonnemanget/',label:'Kontrollera mobil'},
  forsakring:{href:'/forsakring/jamfor-forsakring/',label:'Kontrollera försäkring'},
};

export default function Hushallskostnadskoll(){
  const [values,setValues]=useState<Values>(empty);
  const [selected,setSelected]=useState<Key[]>([]);
  const [showMore,setShowMore]=useState(false);
  const selectedRows=rows.filter(([,key])=>selected.includes(key));
  const knownCount=rows.filter(([,key])=>values[key].trim()!=='').length;
  const parsed=useMemo(()=>Object.fromEntries(rows.map(([,key])=>[key,Math.max(0,Number((values[key]||'0').replace(',','.'))||0)])) as Record<Key,number>,[values]);
  const total=Object.values(parsed).reduce((a,b)=>a+b,0);
  const annual=total*12;
  const controllable=(['el','bredband','mobil','forsakring','media','ovrigt'] as Key[]).reduce((a,k)=>a+parsed[k],0);
  const ranked=(Object.entries(parsed) as [Key,number][]).filter(([k,v])=>v>0&&links[k]).sort((a,b)=>b[1]-a[1]);
  const next=ranked[0]?.[0];
  const comparableCount=(['el','bredband','mobil','forsakring'] as Key[]).filter(key=>parsed[key]>0).length;

  const chooseCategory=(key:Key)=>{
    if(!selected.includes(key)){
      setSelected(current=>[...current,key]);
      emitAnalyticsEvent('household_category_selected',{category:key});
    }
  };

  const carryToPrioritizer=()=>{
    try{
      const existing=window.localStorage.getItem(costCheckStorageKey);
      const current=existing?normalizeCostAnswers(JSON.parse(existing)?.answers):emptyCostAnswers;
      const answers=normalizeCostAnswers({
        el:values.el.trim()!==''?{...current.el,monthly:parsed.el}:current.el,
        bredband:values.bredband.trim()!==''?{...current.bredband,monthly:parsed.bredband}:current.bredband,
        mobil:values.mobil.trim()!==''?{...current.mobil,monthly:parsed.mobil}:current.mobil,
        forsakring:values.forsakring.trim()!==''?{...current.forsakring,monthly:parsed.forsakring}:current.forsakring,
      });
      window.localStorage.setItem(costCheckStorageKey,JSON.stringify({answers,scenarioPct:10,updatedAt:Date.now(),source:'hushallskostnadskollen'}));
      emitAnalyticsEvent('household_cost_to_prioritizer',{categories_with_cost:comparableCount});
    }catch{}
  };

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
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:'Hushållskostnadskollen',description:'Gratis verktyg för att summera hushållets verkliga månadskostnader och se totalen per månad och år.',url:'https://sankkostnaden.se/verktyg/hushallskostnadskollen/',applicationCategory:'FinanceApplication',operatingSystem:'Web',isAccessibleForFree:true})}}/>
    </Head>

    <header className='topbar'><Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link></header>

    <main>
      <section className='guideHero'><div className='guideWrap'><Link className='back' href='/'><ArrowLeft size={16}/> Startsidan</Link><div className='guideIcon'><Calculator size={25}/></div><p className='kicker'>GRATIS VERKTYG • 2026</p><h1>Hushållskostnadskollen</h1><p className='lead'>Se vad dina återkommande kostnader faktiskt blir på ett år. Fyll i det du betalar i dag – verktyget jämför inte mot ett påhittat normalhushåll.</p></div></section>

      <article className='article guideWrap'>
        <div className='note'><strong>Börja med en kostnad du vill kontrollera.</strong> Det går bra att välja ett område även om du inte vet vad du betalar. Inga belopp behöver anges för att följa länkarna till jämförelsen.</div>

        <section data-testid='household-category-picker' style={{margin:'22px 0 20px'}}>
          <h2 style={{marginBottom:10}}>Vad vill du börja med?</h2>
          <p style={{marginTop:0,color:'#5f6c62'}}>Välj en kategori. Du kan lägga till fler när du vill.</p>
          <div role='group' aria-label='Välj kostnadskategori' style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(145px,1fr))',gap:9}}>
            {rows.filter(([,key])=>showMore||(['el','bredband','mobil','forsakring'] as Key[]).includes(key)).map(([label,key])=>
              <button key={key} type='button' aria-pressed={selected.includes(key)} onClick={()=>chooseCategory(key)} style={{minHeight:52,textAlign:'left',padding:'11px 13px',borderRadius:12,border:selected.includes(key)?'2px solid #607f3b':'1px solid #cad6c9',background:selected.includes(key)?'#e6f5a4':'#fff',color:'#233c2a',font:'inherit',fontWeight:800,cursor:'pointer'}}>{label}{selected.includes(key)?' ✓':''}</button>
            )}
          </div>
          {!showMore&&<button type='button' onClick={()=>setShowMore(true)} style={{marginTop:13,padding:'10px 0',border:0,background:'transparent',color:'#2c6034',font:'inherit',fontWeight:800,cursor:'pointer'}}>Visa fler kostnadskategorier +</button>}
        </section>
        {selectedRows.length===0&&<p data-testid='household-start-help' style={{color:'#56685b',marginBottom:26}}>Välj exempelvis el, mobil eller bredband för att få en första kontrollväg – utan något formulär.</p>}
        {selectedRows.length>0&&<div data-testid='household-selected-costs' style={{display:'grid',gap:12,margin:'18px 0 22px'}}>
          {selectedRows.map(([label,key,help])=><label key={key} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(110px,150px)',gap:14,alignItems:'center',padding:'14px 0',borderBottom:'1px solid #e1e5df'}}>
            <span><strong>{label}</strong><small style={{display:'block',color:'#68736c',marginTop:4}}>{help}</small></span>
            <span style={{display:'flex',alignItems:'center',gap:7,minWidth:0}}><input aria-label={label+', kronor per månad'} inputMode='decimal' value={values[key]} onChange={e=>setValues({...values,[key]:e.target.value.replace(/[^0-9,.]/g,'')})} placeholder='0' style={{width:'100%',minWidth:0,padding:'12px',border:'1px solid #cfd7ce',borderRadius:10,fontSize:16,textAlign:'right'}}/><b>kr</b></span>
          </label>)}
          <p style={{margin:'2px 0 0',fontSize:13,color:'#667267'}}>Vet du inte beloppet? Lämna fältet tomt. Vi räknar bara med belopp du själv har angett.</p>
          {selectedRows.filter(([,key])=>Boolean(links[key])).map(([label,key])=><Link key={key} href={links[key]!.href} style={{display:'inline-flex',alignItems:'center',gap:8,width:'fit-content',color:'#244a2e',fontWeight:800,textDecoration:'underline'}}>{links[key]!.label} <ArrowRight size={15}/></Link>)}
        </div>}
        {knownCount>0&&<div className='decisionPanel' aria-live='polite' data-testid='household-known-subtotal'><div><p className='partnerEyebrow'>SUMMA AV ANGIVNA BELOPP</p><h2>{total.toLocaleString('sv-SE')} kr/mån</h2><p>Det motsvarar <strong>{annual.toLocaleString('sv-SE')} kr per år</strong> för de {knownCount} poster du fyllt i. <strong>Det är inte hushållets totala kostnad</strong> om andra kostnader saknas. {controllable.toLocaleString('sv-SE')} kr/mån av de angivna beloppen ligger i poster som ofta går att jämföra.</p></div><div className='decisionMetrics'><span><b>{Math.round(annual/1000)}</b> tkr/år (angivet)</span><span><b>{Math.round(controllable)}</b> kr jämförbart/mån</span></div></div>}

        {comparableCount>0&&<><h2>Prioritera – inte bara den största kostnaden</h2><p>En stor kostnad är inte automatiskt den som är lättast att sänka. Skicka därför med dina fyra jämförbara belopp till Kostnadskollen och svara på en fråga per område. Beloppen ligger kvar lokalt i din webbläsare.</p><div className='intentActions'><Link className='primary' href='/app/?src=hushallskostnadskollen' onClick={carryToPrioritizer}>Prioritera mina avtal <ArrowRight size={16}/></Link>{next&&links[next]&&<Link className='secondary' href={links[next]!.href}>Gå direkt till {rows.find(([,k])=>k===next)?.[0].toLowerCase()}</Link>}</div></>}

        <h2>Så ska resultatet användas</h2><p>Konsumentverket beskriver sina hushållskostnader som ungefärliga referensvärden och rekommenderar att man utgår från egna kostnader när de finns. Myndighetens beräkningar omfattar ungefär 40 procent av hushållens totala utgifter och inkluderar bland annat internet/mobil, hemförsäkring och hushållsel, medan boende och transport inte ingår eftersom variationen är stor.</p>

        <div className='trafficLinks'><a href='https://www.konsumentverket.se/ekonomi/vilka-kostnader-har-ett-hushall/' target='_blank' rel='noreferrer'><strong>Konsumentverket: Hushållskostnader 2026</strong><span>Referensvärden, omfattning och metod →</span></a><Link href='/guide/hushallets-fasta-kostnader-2026/'><strong>Vår checklista för fasta kostnader</strong><span>Gå igenom hushållet post för post →</span></Link></div>
        <p className='disclosure'>Uppgifterna du fyller i beräknas lokalt i webbläsaren. Exakta belopp skickas inte till vår analysmätning. Sänk Kostnaden kan finansieras genom affiliatelänkar som markeras tydligt.</p>
      </article>
    </main>
  </>;
}
