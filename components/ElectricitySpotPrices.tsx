import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Clock3, Info, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { bestUpcomingWindow, calculateSpotShiftScenario, validQuarterDay, type ShiftQuarter } from '../lib/spotShiftScenario';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/ElectricitySpotPrices.module.css';

type Area='SE1'|'SE2'|'SE3'|'SE4';
type Feed={source:string;days:Record<string,Partial<Record<Area,ShiftQuarter[]>>>};

const areas:Record<Area,string>={
 SE1:'SE1 · Luleå',SE2:'SE2 · Sundsvall',SE3:'SE3 · Stockholm och Gotland',SE4:'SE4 · Malmö',
};
const fmtKwh=(n:number)=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:1}).format(n);
const fmtKronor=(n:number)=>new Intl.NumberFormat('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
const fmtOre=(n:number)=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:1}).format(n*100);

function stockDate(at:Date){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
  timeZone:'Europe/Stockholm',year:'numeric',month:'2-digit',day:'2-digit',
 }).formatToParts(at).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
 return p.year+'-'+p.month+'-'+p.day;
}
function followingDay(iso:string){
 const date=new Date(iso+'T12:00:00Z');
 date.setUTCDate(date.getUTCDate()+1);
 return date.toISOString().slice(0,10);
}
function clock(iso:string){
 return new Intl.DateTimeFormat('sv-SE',{
  timeZone:'Europe/Stockholm',hour:'2-digit',minute:'2-digit',
 }).format(new Date(iso));
}
function period(start:string,end:string){return clock(start)+'–'+clock(end);}

export default function ElectricitySpotPrices(){
 const [feed,setFeed]=useState<Feed|null>(null);
 const [area,setArea]=useState<Area>('SE3');
 const [day,setDay]=useState<'today'|'tomorrow'>('today');
 const [selectedIndex,setSelectedIndex]=useState<number|null>(null);
 const [detailsOpen,setDetailsOpen]=useState(false);
 const [shiftOpen,setShiftOpen]=useState(false);
 const [shiftKwh,setShiftKwh]=useState(2);
 const [status,setStatus]=useState<'loading'|'ready'|'unavailable'>('loading');
 const [now,setNow]=useState<number|null>(null);

 useEffect(()=>{
  const controller=new AbortController();
  setNow(Date.now());
  const timer=window.setInterval(()=>setNow(Date.now()),60000);
  fetch('/spot-prices/latest.json',{cache:'no-store',signal:controller.signal})
   .then(async response=>{if(!response.ok)throw new Error('Price feed unavailable');return response.json();})
   .then((data:Feed)=>{
    if(!data||data.source!=='Elpriset just nu.se'||!data.days||typeof data.days!=='object'){
      throw new Error('Invalid price feed');
    }
    setFeed(data);setStatus('ready');
   })
   .catch(()=>{if(!controller.signal.aborted)setStatus('unavailable');});
  return ()=>{controller.abort();window.clearInterval(timer);};
 },[]);

 const today=now===null?'':stockDate(new Date(now));
 const tomorrow=today?followingDay(today):'';
 const selectedDate=day==='today'?today:tomorrow;
 const data=selectedDate?feed?.days?.[selectedDate]?.[area]:undefined;
 const records=validQuarterDay(data as ShiftQuarter[])?data as ShiftQuarter[]:[];
 const nextAvailable=Boolean(tomorrow&&validQuarterDay(feed?.days?.[tomorrow]?.[area] as ShiftQuarter[]));
 const currentQuarterIndex=day==='today'&&now!==null
  ?records.findIndex(r=>Date.parse(r.start)<=now&&now<Date.parse(r.end)):-1;
 const activeIndex=Math.max(0,Math.min(records.length-1,selectedIndex??(currentQuarterIndex>=0?currentQuarterIndex:0)));
 const active=records[activeIndex];
 const current=day==='today'&&currentQuarterIndex>=0?records[currentQuarterIndex]:null;
 const shift=calculateSpotShiftScenario(records,shiftKwh);
 const nextWindow=day==='today'&&now!==null?bestUpcomingWindow(records,now):null;
 const featuredWindow=nextWindow||shift?.cheapWindow||null;

 const chart=useMemo(()=>{
  if(!records.length)return null;
  const values=records.map(r=>r.sekPerKwh);
  const min=Math.min(0,...values),max=Math.max(0,...values),span=Math.max(.01,max-min);
  const y=(n:number)=>122-(n-min)/span*103;
  const step=920/records.length;
  const sorted=[...values].sort((a,b)=>a-b);
  const lower=sorted[Math.floor((sorted.length-1)/3)],upper=sorted[Math.floor((sorted.length-1)*2/3)];
  const zero=y(0);
  const bars=records.map((r,i)=>{
   const valueY=y(r.sekPerKwh);
   const startY=Math.min(valueY,zero);
   return {x:14+i*step,y:startY,height:Math.max(2,Math.abs(valueY-zero)),
    width:Math.max(2,step-2),color:r.sekPerKwh<=lower?'#49b9a3':r.sekPerKwh>=upper?'#f0a376':'#8fb0f4'};
  });
  return {bars,zero,extent:records.length};
 },[records]);

 function resetForArea(value:Area){setArea(value);setSelectedIndex(null);}
 function resetForDay(value:'today'|'tomorrow'){setDay(value);setSelectedIndex(null);}
 function chooseIndex(index:number){setSelectedIndex(Math.max(0,Math.min(records.length-1,index)));}
 function setShiftVisible(){
  if(!shiftOpen)emitAnalyticsEvent('electricity_shift_opened',{source:'electricity_spot',area,day});
  setShiftOpen(value=>!value);
 }

 return <section id='kvartspriser' className={styles.root} data-testid='electricity-spot-prices' aria-label='Aktuella spotpriser för el'>
  <div className={styles.heading}>
   <div>
    <span className={styles.eyebrow}><Zap size={15}/> ELPRISKOLLEN</span>
    <h2>Se när elen är billigare</h2>
    <p>Riktiga elpriser, kvart för kvart. Hitta rätt tid och testa vad prisvariationerna innebär.</p>
   </div>
   <span className={styles.sourceTag}><span aria-hidden='true'/> Hämtas automatiskt</span>
  </div>

  <div className={styles.controls}>
   <label className={styles.areaLabel}>Var bor du?
    <select value={area} onChange={event=>resetForArea(event.target.value as Area)} aria-label='Välj elområde'>
     {Object.entries(areas).map(([value,label])=><option key={value} value={value}>{label}</option>)}
    </select>
   </label>
   <div className={styles.dayToggle} role='group' aria-label='Välj prisdag'>
    <button type='button' aria-pressed={day==='today'} data-active={day==='today'} onClick={()=>resetForDay('today')}>I dag</button>
    <button type='button' aria-pressed={day==='tomorrow'} data-active={day==='tomorrow'}
     disabled={!nextAvailable} title={!nextAvailable?'Morgondagens priser har inte publicerats ännu':undefined}
     onClick={()=>resetForDay('tomorrow')}>I morgon</button>
   </div>
  </div>
  {status==='loading'&&<p className={styles.fallback} role='status'>Hämtar dagens priser …</p>}
  {status!=='loading'&&!records.length&&<div className={styles.fallback} role='status'>
   <strong>Elpriserna är inte tillgängliga för den här dagen ännu.</strong>
   <p>Vi visar inga gamla eller gissade priser. Välj ett annat elområde eller försök igen lite senare.</p>
   <Link href='/elavtal/kvartspris/'>Så fungerar kvartspris <ArrowRight size={16}/></Link>
  </div>}
  {records.length>0&&shift&&<>
   <div className={styles.overview}>
    <div className={styles.nowCard}>
     <span className={styles.metricLabel}><Clock3 size={17}/> {day==='today'?'Spotpris just nu':'Vald kvart i morgon'}</span>
     <div className={styles.bigNumber}>{day==='today'?(current?fmtOre(current.sekPerKwh):'–'):active?fmtOre(active.sekPerKwh):'–'} <small>öre/kWh</small></div>
     <span className={styles.metricBottom}>{day==='today'?(current?period(current.start,current.end):'Aktuell kvart saknas'):active?period(active.start,active.end):'Inga tider'}</span>
    </div>
    <div className={styles.opportunity}>
     <span className={styles.metricLabel}><TrendingDown size={17}/> {nextWindow?'Billigaste kommande 2 timmarna':'Billigaste 2 timmarna'}</span>
     <strong>{featuredWindow?period(featuredWindow.start,featuredWindow.end):'–'}</strong>
     <span>{featuredWindow?fmtOre(featuredWindow.averageSekPerKwh)+' öre/kWh i snitt':'Inget tidsfönster'}</span>
     {featuredWindow&&<button type='button' onClick={()=>chooseIndex(featuredWindow.firstIndex)}>Visa i grafen <ArrowRight size={14}/></button>}
    </div>
   </div>

   <div className={styles.chartPanel}>
    <div className={styles.chartHeading}>
     <div><strong>Så varierar priset över dygnet</strong><span>Varje stapel = 15 minuter · utan moms och avgifter</span></div>
     <span className={styles.legend}><i/><span>Lägre pris</span><i/><span>Högre pris</span></span>
    </div>
    {chart&&<svg className={styles.chart} viewBox='0 0 950 155' preserveAspectRatio='none' role='img'
       aria-label={'Kvartspriser för '+area+' '+selectedDate+', '+records.length+' prisintervall'}>
      <line x1='10' x2='938' y1={chart.zero} y2={chart.zero} stroke='#b7c9e0' strokeWidth='1' strokeDasharray='4 5'/>
      {chart.bars.map((bar,i)=><rect key={i} x={bar.x} y={bar.y} width={bar.width} height={bar.height} rx='1.5'
       fill={i===activeIndex?'#234bd1':bar.color} opacity={i===activeIndex?1:.92}/>)}
      <line x1={chart.bars[activeIndex].x+chart.bars[activeIndex].width/2} x2={chart.bars[activeIndex].x+chart.bars[activeIndex].width/2}
       y1='9' y2='126' stroke='#1c42be' strokeDasharray='3 4' strokeWidth='1.6'/>
      {[0,Math.floor((records.length-1)/4),Math.floor((records.length-1)/2),Math.floor((records.length-1)*3/4),records.length-1].map(i=>
       <text key={i} x={chart.bars[i].x+chart.bars[i].width/2} y='150' textAnchor='middle' fontSize='14' fill='#52627d'>{clock(records[i].start)}</text>)}
    </svg>}
    <div className={styles.selection}>
     <div className={styles.selectionText}>
      <span>Utforska dygnets priser</span>
      <strong>{active?period(active.start,active.end):'–'} <b>· {active?fmtOre(active.sekPerKwh):'–'} öre/kWh</b></strong>
     </div>
     <div className={styles.quickButtons}>
      {currentQuarterIndex>=0&&<button type='button' onClick={()=>chooseIndex(currentQuarterIndex)}>Nu</button>}
      <button type='button' onClick={()=>chooseIndex(shift.cheapWindow.firstIndex)}>Billigast</button>
      <button type='button' onClick={()=>chooseIndex(shift.expensiveWindow.firstIndex)}>Dyrast</button>
     </div>
    </div>
    <label className={styles.sliderLabel} htmlFor='electricity-spot-quarter'>Välj ett prisintervall (15 minuter)</label>
    <input id='electricity-spot-quarter' type='range' min='0' max={records.length-1} value={activeIndex} step='1'
      onChange={event=>chooseIndex(Number(event.target.value))}
      aria-valuetext={(active?period(active.start,active.end):'')+', '+(active?fmtOre(active.sekPerKwh):'–')+' öre per kWh'}/>
    <div className={styles.sliderFoot}><span>Start på dygnet</span><span>Slut på dygnet</span></div>
   </div>

   <div className={styles.shiftShell} data-testid='spot-shift-scenario'>
    <button type='button' className={styles.shiftToggle} aria-expanded={shiftOpen} aria-controls='spot-shift-calculator'
      onClick={setShiftVisible}>
     <span className={styles.shiftIcon}><Zap size={23}/></span>
     <span className={styles.shiftTitle}><strong>Kan jag minska kostnaden genom att byta tid?</strong>
       <small>Testa ett enkelt räkneexempel med dagens riktiga priser.</small></span>
     <span className={styles.shiftAction}>Prova reglaget <ChevronDown size={18} className={shiftOpen?styles.rotate:''}/></span>
    </button>
    {shiftOpen&&<div id='spot-shift-calculator' className={styles.shiftPanel}>
     <div className={styles.shiftDetails}>
      <div className={styles.shiftInputs}>
       <label htmlFor='electricity-shift-kwh'>Flyttad förbrukning <strong>{fmtKwh(shiftKwh)} kWh</strong></label>
       <input id='electricity-shift-kwh' type='range' min='0' max='10' step='.5' value={shiftKwh}
         onChange={event=>setShiftKwh(Number(event.target.value))}
         aria-valuetext={fmtKwh(shiftKwh)+' kWh per valt dygn'}/>
       <div className={styles.preset} role='group' aria-label='Välj exempel på flyttad elförbrukning'>
        {[1,2,5].map(kwh=><button key={kwh} type='button' data-active={shiftKwh===kwh} onClick={()=>setShiftKwh(kwh)}>{kwh} kWh</button>)}
       </div>
       <div className={styles.windowComparison}>
        <p><TrendingUp size={16}/><span>Dyrare 2 timmar <strong>{period(shift.expensiveWindow.start,shift.expensiveWindow.end)}</strong></span></p>
        <p><TrendingDown size={16}/><span>Billigare 2 timmar <strong>{period(shift.cheapWindow.start,shift.cheapWindow.end)}</strong></span></p>
       </div>
      </div>
      <div className={styles.shiftResult} aria-live='polite'>
       <span>Teoretisk skillnad i spotkostnad denna dag</span>
       <strong data-testid='spot-shift-result'>{fmtKronor(shift.spotDifferenceSek)} kr</strong>
       <small>{fmtKwh(shiftKwh)} kWh × {fmtOre(shift.spreadSekPerKwh)} öre/kWh</small>
      </div>
     </div>
     <p className={styles.shiftNotice}><Info size={16}/><span>
      <strong>Ingen prognos eller garanterad besparing.</strong> Vi jämför de två dyraste och de två billigaste <strong>sammanhängande timmarna</strong> under {selectedDate} i {area}.
      Du måste faktiskt kunna flytta samma elmängd och ha ett avtal som följer kvartspriserna.
      Moms, elskatt, nät-/effektavgifter, påslag och fasta avgifter ingår inte.
      Detta är skillnaden i spotkostnad just denna dag, inte månad eller år.
     </span></p>
    </div>}
   </div>

   <div className={styles.nextActions}>
    <div><strong>Vill du dra nytta av prisvariationerna?</strong><span>Förstå avtalsformen innan du jämför elbolag.</span></div>
    <Link href='/elavtal/vilket-elavtal-passar-mig/' onClick={()=>emitAnalyticsEvent('electricity_spot_next',{destination:'guide',area})}>Vilken avtalsform passar mig? <ArrowRight size={17}/></Link>
   </div>

   <button type='button' className={styles.more} aria-expanded={detailsOpen} aria-controls='spot-price-details'
    onClick={()=>setDetailsOpen(v=>!v)}>Så fungerar priserna <ChevronDown size={17} className={detailsOpen?styles.rotate:''}/></button>
   {detailsOpen&&<div id='spot-price-details' className={styles.explanation}>
    Priserna kommer från dagen-före-marknaden och gäller 15-minutersperioder. I grafen syns alla kvartarna, även vid tidsomställning då ett dygn kan ha 92 eller 100 perioder.
    <strong> Spotpris är inte din elräkning:</strong> moms, elskatt, nätavgift, påslag och fasta elhandelsavgifter tillkommer. Avtal med månadsmedelpris följer inte varje kvart på samma sätt.
    <Link href='/elavtal/kvartspris/'>Läs mer om kvartspris <ArrowRight size={14}/></Link>
   </div>}
  </>}
  <p className={styles.source}><Info size={15}/> Spotpris utan moms, skatter, nätavgift och påslag.
    Källa: <a href='https://www.elprisetjustnu.se/elpris-api' target='_blank' rel='noopener noreferrer'>Elpriset just nu.se</a>.
    Morgondagens priser visas när de finns tillgängliga.</p>
 </section>;
}
