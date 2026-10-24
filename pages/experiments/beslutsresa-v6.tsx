import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleHelp, RotateCcw, ShieldCheck, Sparkles, PiggyBank, Wifi, Zap, Smartphone, Home } from 'lucide-react';
import styles from '../../styles/V6DecisionLab.module.css';

type Goal='unsure'|'compare'|'overview';
type Area='bredband'|'el'|'mobil'|'forsakring';
type Option={value:string;label:string;reason:string;href:string;cta:string};
type AreaConfig={label:string;description:string;guide:string;compare:string;compareLabel:string;question:string;options:Option[];};
const goals:{id:Goal;label:string;description:string}[]=[
 {id:'unsure',label:'Jag vill se om jag betalar för mycket',description:'Börja med ett avtal. Du behöver inte kunna priset utantill.'},
 {id:'compare',label:'Jag vill jämföra och byta',description:'Kom direkt till rätt jämförelse utan att fylla i en lång profil.'},
 {id:'overview',label:'Jag vet inte var jag ska börja',description:'Få en enkel första kontroll, ett område i taget.'}
];
const configs:Record<Area,AreaConfig>={
 bredband:{
  label:'Bredband',description:'Utbudet är adressberoende.',guide:'/bredband/vilken-hastighet-behover-jag/',compare:'/bredband/bredband-pa-min-adress/',compareLabel:'Kontrollera utbudet på adressen',
  question:'Vilken typ av bredband gäller det?',options:[
   {value:'unknown',label:'Det vet jag inte',reason:'Börja med adressen. Det går inte att avgöra vilket bredband som är billigast utan att veta vilka nät som finns.',href:'/bredband/bredband-pa-min-adress/',cta:'Kontrollera bredband på adressen'},
   {value:'fiber',label:'Fiber / fast bredband',reason:'Jämför rätt hastighet och totalpris hos leverantörer som faktiskt kan leverera till adressen.',href:'/bredband/billigaste-bredbandet/',cta:'Jämför fast bredband'},
   {value:'mobile',label:'Mobilt / 5G',reason:'Kontrollera täckning och verkligt surfbehov där uppkopplingen ska användas.',href:'/bredband/mobilt-bredband/',cta:'Se mobilt bredband'}
  ]},
 el:{
  label:'El',description:'Jämför samma förbrukning och villkor.',guide:'/elavtal/sa-laser-du-elfakturan/',compare:'/elavtal/jamfor-elavtal/',compareLabel:'Jämför elavtal',
  question:'Vad vill du ha hjälp med inför jämförelsen?',options:[
   {value:'compare',label:'Jämföra hela årskostnaden',reason:'Påslag, fast avgift och avtalsform behöver jämföras med samma årsförbrukning.',href:'/elavtal/jamfor-elavtal/',cta:'Jämför elavtal'},
   {value:'bill',label:'Hitta uppgifter på fakturan',reason:'Börja med förbrukning, påslag och fasta avgifter på din elhandelsfaktura.',href:'/elavtal/sa-laser-du-elfakturan/',cta:'Hitta rätt fakturauppgifter'},
   {value:'form',label:'Förstå rörligt, fast och kvartspris',reason:'Valet av avtalsform beror bland annat på när du förbrukar el och vilken prisrisk du accepterar.',href:'/elavtal/rorligt-fast-kvartspris/',cta:'Förstå avtalsformerna'}
  ]},
 mobil:{
  label:'Mobil',description:'Börja med surfbehov och täckning.',guide:'/mobil/hur-mycket-surf-behover-jag/',compare:'/mobil/billigaste-mobilabonnemanget/',compareLabel:'Jämför mobilabonnemang',
  question:'Vem ska abonnemanget passa?',options:[
   {value:'one',label:'En person',reason:'Jämför surfbehov, mobilnät och priset efter en eventuell kampanj.',href:'/mobil/billigaste-mobilabonnemanget/',cta:'Jämför mobilabonnemang'},
   {value:'family',label:'Flera i familjen',reason:'Räkna hela familjens månadskostnad och surfbehov innan du väljer paket.',href:'/mobil/familjeabonnemang/',cta:'Se familjeabonnemang'},
   {value:'unknown',label:'Vet inte hur mycket surf som behövs',reason:'Börja med att uppskatta faktisk surf innan du jämför abonnemang.',href:'/mobil/hur-mycket-surf-behover-jag/',cta:'Hitta rätt surfmängd'}
  ]},
 forsakring:{
  label:'Försäkring',description:'Rätt skydd är lika viktigt som priset.',guide:'/forsakring/hemforsakring-skyddskoll/',compare:'/forsakring/jamfor-forsakring/',compareLabel:'Jämför försäkring',
  question:'Vilken försäkring vill du se över?',options:[
   {value:'home',label:'Hemförsäkring',reason:'Jämför likvärdigt skydd, självrisk och premie. Ett lägre pris med sämre skydd är inte automatiskt bättre.',href:'/forsakring/jamfor-hemforsakring/',cta:'Jämför hemförsäkring'},
   {value:'pet',label:'Djurförsäkring',reason:'Kontrollera ersättningstak, självrisk och undantag innan du jämför premie.',href:'/forsakring/djurforsakring/',cta:'Jämför djurförsäkring'},
   {value:'unknown',label:'Jag behöver hjälp att välja',reason:'Börja med att avgöra vilket försäkringsbehov du faktiskt vill täcka.',href:'/forsakring/jamfor-forsakring/',cta:'Se jämförelsevägar'}
  ]}
};
const areaIcons={bredband:Wifi,el:Zap,mobil:Smartphone,forsakring:Home};
const goalName:Record<Goal,string>={unsure:'Kontrollera ett avtal',compare:'Jämför direkt',overview:'Hitta en bra startpunkt'};
function initialReason(goal:Goal,area:Area){
 const name=configs[area].label.toLowerCase();
 if(goal==='compare')return 'Du vill jämföra nu. Börja med den viktigaste uppgiften för '+name+' – utan att göra en fullständig hushållsbudget.';
 if(goal==='unsure')return 'Vi vet ännu inte om ditt '+name+' kostar för mycket. Börja med att kontrollera verkligt pris, innehåll och villkor innan du byter.';
 return 'Ett område i taget räcker. Börja med '+name+' och se om det finns något konkret att undersöka, utan att lägga in alla hushållskostnader.';
}
export default function V6DecisionLab(){
 const [goal,setGoal]=useState<Goal|null>(null);
 const [area,setArea]=useState<Area|null>(null);
 const [extra,setExtra]=useState<string|null>(null);
 const [showRefine,setShowRefine]=useState(false);
 const cfg=area?configs[area]:null;
 const option=cfg?.options.find(o=>o.value===extra);
 const destination=option?.href||cfg?.compare||'/';
 const destinationLabel=option?.cta||cfg?.compareLabel||'Gå vidare';
 const step=goal===null?0:area===null?1:2;
 function chooseGoal(value:Goal){setGoal(value);setArea(null);setExtra(null);setShowRefine(false)}
 function chooseArea(value:Area){setArea(value);setExtra(null);setShowRefine(false)}
 function back(){if(area!==null){setArea(null);setExtra(null);setShowRefine(false)}else{setGoal(null)}}
 function reset(){setGoal(null);setArea(null);setExtra(null);setShowRefine(false)}
 return <>
  <Head>
   <title>Interaktiv användarresa – prototyp 6.0 | Sänk Kostnaden</title>
   <meta name='robots' content='noindex,nofollow,noarchive,nosnippet'/>
   <meta name='description' content='Avskild prototyp för ny interaktiv användarresa. Inga priser, jämförelser eller besparingar utlovas.'/>
  </Head>
  <main className={styles.shell} data-testid='v6-lab'>
   <header className={styles.header}>
    <Link href='/' className={styles.brand}><span className={styles.brandIcon}><PiggyBank size={19}/></span><strong>Sänk Kostnaden</strong></Link>
    <span className={styles.prototype}>DESIGNLABB · PROTOTYP 6.0</span>
   </header>
   <div className={styles.content}>
    <div className={styles.top}>
     <span className={styles.eyebrow}><Sparkles size={15}/> GÖR ETT ENKELT VAL</span>
     <h1>Lite mindre krångel.<br/><span>Mer kontroll på kostnaderna.</span></h1>
     <p className={styles.subtitle}>Välj vad du vill lösa. Vi visar nästa användbara steg direkt – du behöver varken skapa konto eller fylla i en hel budget.</p>
    </div>
    <section className={styles.panel} data-testid='v6-workspace' aria-label='Din väg vidare'>
     <div className={styles.panelHead}>
      <div><span className={styles.mini}>DIN VÄG VIDARE</span><p>{step===0?'Ett enda val för att börja':step===1?'Välj ett område':'En första väg vidare är klar'}</p></div>
      <div className={styles.progress}><span>Steg {step+1} av 3</span><div role='progressbar' aria-label='Framsteg' aria-valuemin={0} aria-valuemax={3} aria-valuenow={step+1}><i style={{width:((step+1)/3*100)+'%'}}/></div></div>
     </div>
     <div className={styles.stage} aria-live='polite'>
      {step===0&&<div data-testid='v6-goal-choice'>
       <h2>Vad vill du ha hjälp med?</h2>
       <p className={styles.hint}>Du kan ändra dig när som helst.</p>
       <div className={styles.goals}>{goals.map(({id,label,description})=><button type='button' key={id} className={styles.goal} onClick={()=>chooseGoal(id)} data-testid={'v6-goal-'+id}>
        <span className={styles.goalCopy}><strong>{label}</strong><small>{description}</small></span><span className={styles.go}><ArrowRight size={22}/></span>
       </button>)}</div>
      </div>}
      {step===1&&<div data-testid='v6-area-choice'>
       <button type='button' className={styles.back} onClick={back}><ArrowLeft size={16}/> Tillbaka</button>
       <p className={styles.selectedContext}><Check size={15}/>{goalName[goal!]}</p>
       <h2>Vilken kostnad tänker du på?</h2>
       <p className={styles.hint}>Välj ett område. Du får ett konkret nästa steg direkt.</p>
       <div className={styles.areas}>{(Object.keys(configs) as Area[]).map(key=>{
        const Icon=areaIcons[key];return <button type='button' className={styles.area} key={key} onClick={()=>chooseArea(key)} data-testid={'v6-area-'+key}>
         <span className={styles.areaIcon}><Icon size={24}/></span><span><strong>{configs[key].label}</strong><small>{configs[key].description}</small></span><ChevronRight size={18} className={styles.chevron}/>
        </button>
       })}</div>
      </div>}
      {step===2&&cfg&&<div data-testid='v6-result'>
       <div className={styles.resultToolbar}><button type='button' className={styles.back} onClick={back}><ArrowLeft size={16}/> Byt område</button><button type='button' className={styles.reset} onClick={reset}><RotateCcw size={15}/> Börja om</button></div>
       <span className={styles.resultTag}><Check size={16}/> DIN FÖRSTA STARTPUNKT</span>
       <h2>{option?'En mer relevant väg för dig.':'Bra, du kan börja här.'}</h2>
       <p className={styles.explanation}>{option?.reason||initialReason(goal!,area!)}</p>
       <div className={styles.suggestion}>
        <div><span className={styles.suggestionKicker}>REKOMMENDERAT NÄSTA STEG</span><strong>{destinationLabel}</strong><p>{option?'Utifrån valet du nyss gjorde.':'Utifrån ditt mål och område, utan påhittade prisuppgifter.'}</p></div>
        <Link className={styles.mainCta} href={destination} data-testid='v6-next-step'>{destinationLabel}<ArrowRight size={18}/></Link>
       </div>
       <div className={styles.refine}>
        <button type='button' className={styles.refineToggle} aria-expanded={showRefine} onClick={()=>setShowRefine(v=>!v)} data-testid='v6-refine-toggle'><span><CircleHelp size={20}/><strong>Vill du göra förslaget mer träffsäkert?</strong></span><span className={styles.optional}>Frivilligt <ChevronRight size={18}/></span></button>
        {showRefine&&<div className={styles.refineBody} data-testid='v6-refine-options'>
         <p>{cfg.question}</p>
         <div className={styles.refineOptions}>{cfg.options.map(o=><button type='button' className={extra===o.value?styles.refineSelected:styles.refineOption} key={o.value} aria-pressed={extra===o.value} onClick={()=>setExtra(o.value)}>{o.label}{extra===o.value?<Check size={17}/>:<ChevronRight size={17}/>}</button>)}</div>
        </div>}
       </div>
       <div className={styles.fine}><ShieldCheck size={17}/><span>Det här är vägledning, inte en prisjämförelse. Kontrollera tillgänglighet, aktuella priser och villkor hos leverantören. Eventuella partnerlänkar märks på jämförelsesidorna.</span></div>
       <Link className={styles.guideLink} href={cfg.guide}>Jag vill förstå mer innan jag jämför <ArrowRight size={15}/></Link>
      </div>}
     </div>
    </section>
    <p className={styles.reviewNote}>Det här är en separat designprototyp. Inga personuppgifter efterfrågas och inga belopp eller uppgifter sparas här.</p>
   </div>
  </main>
 </>;
}
