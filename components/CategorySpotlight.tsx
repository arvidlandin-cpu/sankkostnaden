import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BadgeCheck, Wifi, Zap, Smartphone, ShieldCheck, WalletCards } from 'lucide-react';
import ElectricitySpotPrices from './ElectricitySpotPrices';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import { getActivePartners, type PartnerCategory } from '../lib/partners';
import s from '../styles/CategorySpotlight.module.css';

type Path={label:string;summary:string;next:string;href:string};
type Config={eyebrow:string;title:string;lead:string;visual:string;icon:typeof Wifi;paths:[Path,Path]};
const config:Record<PartnerCategory,Config>={
  bredband:{
    eyebrow:'DIN UPPKOPPLING · BÖRJA RÄTT',title:'Hela hemmet ska fungera. Inte bara priset.',
    lead:'Börja med hur ni faktiskt använder uppkopplingen. Kontrollera sedan vilka alternativ som finns på din adress.',
    visual:'Adress först. Hastighet sedan.',icon:Wifi,
    paths:[
      {label:'Vardag, jobb & streaming',summary:'En stabil anslutning och rätt kapacitet är viktigare än högsta marknadsförda hastighet. 100/100 Mbit/s kan räcka för många hushåll, men kontrollera antal samtidiga användare.',next:'Hjälp mig hitta hastigheten',href:'/bredband/vilken-hastighet-behover-jag/'},
      {label:'Många samtidigt / gaming',summary:'När flera streamar, spelar eller har videomöten samtidigt behöver du även tänka på stabilitet och svarstid, inte bara hastigheten i reklam.',next:'Förstå utbud på adressen',href:'/bredband/bredband-pa-min-adress/'}
    ]
  },
  el:{
    eyebrow:'ELPRIS · RIKTIGA KVARTSVÄRDEN',title:'Se när elen kostar mer. Förstå vad du kan påverka.',
    lead:'Våra kvartspriser är elbörsens spotpriser, inte personliga elavtal eller offerter från en leverantör. Börja med den insikten och jämför sedan villkoren.',
    visual:'Samma spotmarknad. Olika avtalsvillkor.',icon:Zap,
    paths:[
      {label:'Jag vill förstå kvartspris',summary:'Ett kvartsprisavtal följer elmarknaden i 15-minutersintervall. Totalpriset påverkas också av bland annat elhandlarens avgifter, skatter och din faktiska förbrukning.',next:'Läs om kvartspris',href:'/elavtal/kvartspris/'},
      {label:'Jag vill välja avtalsform',summary:'Fast, rörligt och kvartspris innebär olika risk och möjlighet att påverka kostnaden. Börja med hushållets flexibilitet – inte en påhittad besparingssiffra.',next:'Välj rätt avtalsform',href:'/elavtal/vilket-elavtal-passar-mig/'}
    ]
  },
  mobil:{
    eyebrow:'MOBIL · DIN ANVÄNDNING STYR',title:'Betala för det du använder. Inte för en större siffra.',
    lead:'Hitta en rimlig väg utifrån din vardag innan du granskar surf, täckning och kampanjpriser hos operatörerna.',
    visual:'Surfbehov före prislapp.',icon:Smartphone,
    paths:[
      {label:'Mest wifi hemma och på jobbet',summary:'Utgå från din nuvarande dataförbrukning när du har wifi större delen av dagen. Ett abonnemang med mindre surf kan vara relevant, men jämför även nät och villkor.',next:'Hitta rätt surfmängd',href:'/mobil/hur-mycket-surf-behover-jag/'},
      {label:'Streamar och delar ofta nät',summary:'Mycket video och hotspot kan kräva mer surf. Jämför hur erbjudanden hanterar hastighet, EU-roaming, bindningstid och förbrukningstak.',next:'Räkna på familjens kostnad',href:'/mobil/lonar-sig-familjeabonnemang/'}
    ]
  },
  forsakring:{
    eyebrow:'FÖRSÄKRING · SKYDDET FÖRST',title:'Rätt skydd känns bättre än enbart låg premie.',
    lead:'Se vad du redan har innan du betalar för mer. Välj behov och kontrollera omfattning, självrisk och undantag.',
    visual:'Ingen premie kan ersätta rätt omfattning.',icon:ShieldCheck,
    paths:[
      {label:'Mitt hem och mina saker',summary:'Kontrollera bostadsform, lösöre, ansvar, rättsskydd och självrisk. I bostadsrätt är det viktigt att veta om tillägget ingår kollektivt.',next:'Kontrollera mitt hemskydd',href:'/forsakring/hemforsakring-skyddskoll/'},
      {label:'Min hund eller katt',summary:'Titta på veterinärvårdsbelopp, självrisker, undantag och hur villkoren förändras när djuret blir äldre innan du tar ställning till premien.',next:'Jämför djurförsäkring',href:'/forsakring/djurforsakring/'}
    ]
  },
  ekonomi:{
    eyebrow:'EKONOMI · HELA RÄKNINGEN RÄKNAS',title:'En lägre månadskostnad är inte alltid billigare.',
    lead:'Titta på hela lånekostnaden eller börja med hushållets fasta utgifter. Vi visar inte påhittade personliga räntor eller löften om besparing.',
    visual:'Total kostnad slår lockande månadsbelopp.',icon:WalletCards,
    paths:[
      {label:'Jag jämför lån',summary:'Samma belopp och löptid behöver jämföras med effektiv ränta, avgifter och hela återbetalningen. Längre löptid kan göra totalkostnaden högre.',next:'Så jämför du lån',href:'/ekonomi/jamfor-privatlan/'},
      {label:'Jag vill börja med min budget',summary:'Fyll i bara de kostnader du känner till. Hushållskollen summerar dina egna värden och visar inga påhittade besparingar.',next:'Räkna hushållets kostnader',href:'/verktyg/hushallskostnadskollen/'}
    ]
  }
};

export default function CategorySpotlight({category}:{category:PartnerCategory}){
  const [choice,setChoice]=useState<0|1>(0);
  const [logoUnavailable,setLogoUnavailable]=useState(false);
  const info=config[category];const Icon=info.icon;const current=info.paths[choice];
  const tibber=category==='el'?getActivePartners('el','electricity',40).find(p=>p.name==='Tibber'):undefined;
  return <section className={s.root} data-testid={'p0g-insight-'+category} aria-labelledby={'p0g-insight-title-'+category}>
    <div className={s.grid}>
      <div className={s.editorial}>
        <p className={s.eyebrow}>{info.eyebrow}</p>
        <h2 id={'p0g-insight-title-'+category}>{info.title}</h2>
        <p className={s.lead}>{info.lead}</p>
        <div className={s.questions} role='group' aria-label='Välj situation'>
          {info.paths.map((path,i)=><button type='button' key={path.label} onClick={()=>{
             setChoice(i as 0|1);emitAnalyticsEvent('category_spotlight_choice',{category,choice:i});
           }} className={[s.choice,choice===i?s.active:''].join(' ')} aria-pressed={choice===i}>
             <span>{path.label}</span><span aria-hidden='true'>{choice===i?'●':'○'}</span>
           </button>)}
        </div>
        <div className={s.answer} aria-live='polite'>
          <p>{current.summary}</p>
          <Link href={current.href} className={s.action} onClick={()=>emitAnalyticsEvent('category_spotlight_continue',{category,choice})}>{current.next}<ArrowRight size={19}/></Link>
        </div>
      </div>
      <aside className={[s.visual,s[category]].join(' ')}>
        <span className={s.visualIcon} aria-hidden='true'><Icon size={37}/></span>
        {category==='el'&&tibber?<>
          <p className={s.visualKicker}>EXEMPEL PÅ AKTIV PARTNER · INGEN PRISRANKING</p>
          <div className={s.brandLogo}>
            {logoUnavailable?<strong className={s.brandFallback}>Tibber</strong>:<img src='https://upload.wikimedia.org/wikipedia/commons/1/18/Tibber_logo.svg' alt='Tibber' loading='lazy' width={240} height={74} onError={()=>setLogoUnavailable(true)}/>}
          </div>
          <strong className={s.visualTitle}>Utforska elavtal och smart energianvändning</strong>
          <p className={s.visualBody}>Tibber är en av våra elpartners. Våra visade kvartspriser är oberoende spotdata och visar inte Tibbers personliga erbjudande.</p>
          <a className={s.partnerLink} href={tibber.trackingUrl} target='_blank' rel='sponsored nofollow noopener' data-partner={tibber.name} data-category='el' data-intent='electricity' data-placement='electricity_insight_tibber' data-partner-position='1'>
            Se elavtal hos Tibber <ArrowUpRight size={19}/>
          </a>
          <small className={s.disclosure}><BadgeCheck size={14}/> Sponsrad partnerlänk · aktuella villkor hos Tibber</small>
        </>:<>
          <p className={s.visualKicker}>ETT BRA BESLUT BÖRJAR MED RÄTT FRÅGA</p>
          <strong className={s.visualTitle}>{info.visual}</strong>
          <div className={s.visualLine}><span/><span/><span/></div>
          <p className={s.visualBody}>Välj en situation till vänster. Du får ett relevant nästa steg utan att lämna ifrån dig kontaktuppgifter.</p>
          <span className={s.visualFooter}>Vägledning före jämförelse <ArrowRight size={19}/></span>
        </>}
      </aside>
    </div>
    {category==='el'&&<div className={s.spotPrice}><p className={s.priceExplain}>VERKLIGA SPOTPRISER · FRISTÅENDE FRÅN PARTNERKORTET OVAN</p><ElectricitySpotPrices/></div>}
  </section>;
}
