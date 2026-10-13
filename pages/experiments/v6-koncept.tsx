import Head from 'next/head';
import Link from 'next/link';
import {ArrowRight, Compass, Layers3, Sparkles, PiggyBank, ShieldCheck} from 'lucide-react';
import s from '../../styles/V6Variants.module.css';
const concepts=[
 {type:'A',tag:'PERSONLIG VÄGLEDNING',title:'En fråga i taget',desc:'Börja med vad du vill lösa. Två val ger ett förklarat nästa steg; valfri fördjupning därefter.',href:'/experiments/beslutsresa-v6/',icon:'compass'},
 {type:'B',tag:'VISUELL KOSTNADSÖVERSIKT',title:'Se kostnaderna framför dig',desc:'Markera en kostnad, ange ditt faktiska belopp och se hur hushållets kostnadskarta förändras.',href:'/experiments/kostnadskarta-v6/',icon:'layers'},
 {type:'C',tag:'DIREKT TILL ALTERNATIVEN',title:'Jämför utan omvägar',desc:'Välj ett område och se relevanta aktiva partners direkt, med en valfri behovsfiltrering.',href:'/experiments/snabbjamfor-v6/',icon:'sparkles'}
];
export default function V6ConceptHub(){return <><Head><title>Tre prototyper för Sänk Kostnaden 6.0</title><meta name='robots' content='noindex,nofollow,noarchive'/></Head>
 <main className={s.shell} data-testid='v6-hub'>
  <header className={s.header}><Link href='/' className={s.brand}><PiggyBank size={20}/> Sänk Kostnaden</Link><span className={s.lab}>V6 · DESIGNLABB</span></header>
  <div className={s.hub}>
    <p className={s.eyebrow}><Sparkles size={16}/> TRE OLIKA UPPLEVELSER</p>
    <h1>Vilket sätt känns enklast?</h1>
    <p className={s.lead}>Vi testar hur själva tjänsten ska fungera – inte bara hur den ska se ut. Alla tre koncept är klickbara, kostar inget att prova och är avskilda från den publika startsidan.</p>
    <div className={s.hubGrid}>{concepts.map(c=><Link key={c.type} className={s.hubCard} href={c.href} data-testid={'v6-open-'+c.type.toLowerCase()}>
      <span className={s.conceptLetter}>{c.type}</span><span className={s.cardTag}>{c.tag}</span>
      <span className={s.cardIcon}>{c.icon==='compass'?<Compass size={28}/>:c.icon==='layers'?<Layers3 size={28}/>:<Sparkles size={28}/>}</span>
      <strong>{c.title}</strong><p>{c.desc}</p><span className={s.cardAction}>Prova koncept {c.type}<ArrowRight size={17}/></span>
    </Link>)}</div>
    <p className={s.hubFine}><ShieldCheck size={17}/> Inget av koncepten beräknar faktiska besparingar utan underlag. Partneralternativ är annonsmärkta och urvalet täcker inte hela marknaden.</p>
  </div></main></>}