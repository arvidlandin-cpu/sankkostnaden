import { useMemo, useState } from 'react';
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Check, CircleDollarSign, GitCompareArrows,
  HousePlug, PawPrint, RotateCcw, Search, ShieldCheck, Sparkles, Unplug, Wifi
} from 'lucide-react';
import { getActivePartners, partnerRankScore, partners, partnerGroupCheckedLabel, partnerLinkCheckedLabel, partnerSourceLabel, type ActivePartner, type PartnerIntent } from '../lib/partners';

function track(event:string,params:Record<string,string|number>){
  if(typeof window==='undefined') return;
  const w=window as any;
  if(typeof w.gtag==='function') w.gtag('event',event,params);
  else if(Array.isArray(w.dataLayer)) w.dataLayer.push({event,...params});
}

function PartnerCard({
  partner,reasons,placement,intent,position,cta,
}:{
  partner:ActivePartner;reasons:string[];placement:string;intent:string;position:number;cta?:string;
}){
  return <article className='matchPartnerCard'>
    <div className='matchPartnerTop'>
      <div><small>FÖRSLAG {position}</small><div className='partnerBrand'>{partner.domain&&<img src={`https://www.google.com/s2/favicons?domain=${partner.domain}&sz=128`} alt='' loading='lazy'/>}<h3>{partner.name}</h3></div></div>
      <span><BadgeCheck size={13}/> PARTNERLÄNK</span>
    </div>
    <ul>{reasons.slice(0,2).map(item=><li key={item}><Check size={14}/>{item}</li>)}</ul>
    <div className='partnerVerification compact'><span>Länk kontrollerad {partnerLinkCheckedLabel(partner)}</span><span>Källa: {partnerSourceLabel(partner)}</span></div>
    <a
      href={partner.trackingUrl}
      data-partner={partner.name}
      data-category={partner.category}
      data-intent={intent}
      data-placement={placement}
      data-partner-position={position}
      target='_blank'
      rel='sponsored nofollow noopener'
    >
      {cta||partner.cta||`Se aktuella alternativ hos ${partner.name}`}<ArrowUpRight size={17}/>
    </a>
  </article>;
}

function DirectPartnerStrip({items,label='Gå direkt till partner',placement}:{items:ActivePartner[];label?:string;placement:string}){
  const featured=items.slice(0,2);
  if(!featured.length) return null;
  return <div className='directPartnerBlock'>
    <div className='directPartnerHead'><div><small>REDO ATT JÄMFÖRA?</small><strong>{label}</strong></div><span>Partnerlänkar</span></div>
    <div className='directPartnerGrid'>{featured.map((p,i)=><a key={p.name} href={p.trackingUrl} target='_blank' rel='sponsored nofollow noopener' data-partner={p.name} data-category={p.category} data-intent='direct' data-placement={placement} data-partner-position={i+1}>
      <span className='partnerBrand'>{p.domain&&<img src={`https://www.google.com/s2/favicons?domain=${p.domain}&sz=128`} alt='' loading='lazy'/>}<span className='partnerWordmark'>{p.name}</span></span><b>{p.cta||`Se aktuella alternativ`}<ArrowUpRight size={14}/></b>
    </a>)}</div>
    <p>Vill du ha hjälp att välja? Svara på frågan nedan så kortlistar vi relevanta alternativ.</p><small className='directPartnerVerified'>Partnerlänkar kontrollerade {partnerGroupCheckedLabel(featured)}</small>
  </div>;
}

function VisiblePartnerNames({items,label='Aktiva partners i vårt urval'}:{items:ActivePartner[];label?:string}){
  if(!items.length) return null;
  return <div className='visiblePartnerNames' aria-label={label}>
    <span>{label}</span>
    <div>{items.map((p,i)=><a
      key={p.name}
      href={p.trackingUrl}
      data-partner={p.name}
      data-category={p.category}
      data-intent='partner-chip'
      data-placement='visible_partner_names'
      target='_blank'
      rel='sponsored nofollow noopener'
      aria-label={`Besök ${p.name}`}
    ><strong>{p.name}</strong></a>)}</div>
  </div>;
}

function AllPartners({
  items,label,placement,intent,
}:{
  items:ActivePartner[];label:string;placement:string;intent:string;
}){
  return <details className='allPartnersDetails'>
    <summary>{label}<ArrowRight size={15}/></summary>
    <div className='allPartnersGrid'>
      {items.map((partner,i)=><a
        key={partner.name}
        href={partner.trackingUrl}
        data-partner={partner.name}
        data-category={partner.category}
        data-intent={intent}
        data-placement={placement}
        data-partner-position={i+1}
        target='_blank'
        rel='sponsored nofollow noopener'
      ><span><strong>{partner.name}</strong><small>Partnerlänk · kontrollera aktuellt pris och villkor</small></span><ArrowUpRight size={16}/></a>)}
    </div>
  </details>;
}

type BroadbandAccess='unknown'|'fiber'|'mobile';
type BroadbandStart='compare'|'direct';

export function BroadbandPartnerMatcher(){
  const base=getActivePartners('bredband',undefined,12);
  const cross=partners.filter((p):p is ActivePartner=>p.status==='active'&&!!p.trackingUrl&&p.intents.includes('mobile-broadband')).map(p=>({...p,category:'bredband' as const,trackingUrl:p.intentTrackingUrls?.['mobile-broadband']||p.trackingUrl,cta:p.category==='mobil'?`Se mobilt bredband hos ${p.name}`:p.cta}));
  const all=Array.from(new Map([...base,...cross].map(p=>[p.name,p])).values());
  const [access,setAccess]=useState<BroadbandAccess|null>(null);
  const [start,setStart]=useState<BroadbandStart|null>(null);

  const matches=useMemo(()=>{
    if(!access||!start) return [];
    return [...all].sort((a,b)=>{
      const score=(p:ActivePartner)=>{
        let s=partnerRankScore(p);
        if(p.name==='Bredbandsval.se'&&(access==='unknown'||start==='compare')) s+=80;
        if(access==='fiber'&&p.intents.includes('fiber')) s+=35;
        if(access==='mobile'&&p.intents.includes('mobile-broadband')) s+=50;
        if(start==='direct'&&p.name!=='Bredbandsval.se') s+=20;
        if(start==='direct'&&p.name==='Tre'&&access==='mobile') s+=45;
        return s;
      };
      return score(b)-score(a)||a.name.localeCompare(b.name,'sv');
    }).slice(0,Math.min(3,all.length));
  },[all,access,start]);

  const reasons=(p:ActivePartner)=>{
    const out:string[]=[];
    if(p.name==='Bredbandsval.se'&&(access==='unknown'||start==='compare')) out.push('Bra första steg när du vill kontrollera utbudet på adressen');
    if(access==='fiber'&&p.intents.includes('fiber')) out.push('Relevant när fiber finns eller är det du vill jämföra');
    if(access==='mobile'&&p.intents.includes('mobile-broadband')) out.push('Relevant när mobilt eller 5G-bredband är aktuellt');
    if(start==='direct'&&p.name==='Ownit') out.push('Direkt väg till en aktiv fiberpartner');
    if(!out.length) out.push(start==='direct'?'Du valde direktväg – aktiva operatörer med matchande teknik prioriteras':'Du valde att jämföra flera – jämförelseväg och teknikmatchning prioriteras');
    out.push('Jämför samma hastighet, ordinarie pris och bindningstid');
    return out;
  };

  const ready=Boolean(access&&start);
  const intent:PartnerIntent=access==='mobile'?'mobile-broadband':access==='fiber'?'fiber':'compare';
  return <section id='partners' className='mobileMatcher' aria-label='Hitta relevant bredband'>
    <div className='mobileMatcherIntro'><p className='kicker'>BREDBANDSKOLL · 2 FRÅGOR</p><h2>Börja med adressen – inte med logotypen.</h2><p>Vilka operatörer och priser som är relevanta beror på vad som faktiskt går att beställa där du bor. Vi använder därför dina svar för att välja en bättre startpunkt.</p></div>
    <DirectPartnerStrip items={all} label='Jämför direkt hos en partner' placement='broadband_direct'/>
    <div className='matchQuestions'>
      <div className='matchQuestion'><div><small>1 AV 2</small><strong>Vad vet du om anslutningen?</strong></div><div className='matchOptions matchOptionsThree'>
        <button type='button' className={access==='unknown'?'selected':''} onClick={()=>{setAccess('unknown');track('broadband_match_answer',{question:'access',answer:'unknown'})}}><Search size={18}/><span>Vet inte</span></button>
        <button type='button' className={access==='fiber'?'selected':''} onClick={()=>{setAccess('fiber');track('broadband_match_answer',{question:'access',answer:'fiber'})}}><Wifi size={18}/><span>Fiber</span></button>
        <button type='button' className={access==='mobile'?'selected':''} onClick={()=>{setAccess('mobile');track('broadband_match_answer',{question:'access',answer:'mobile'})}}><HousePlug size={18}/><span>Mobilt / 5G</span></button>
      </div></div>
      <div className='matchQuestion'><div><small>2 AV 2</small><strong>Hur vill du börja?</strong></div><div className='matchOptions'>
        <button type='button' className={start==='compare'?'selected':''} onClick={()=>{setStart('compare');track('broadband_match_answer',{question:'start',answer:'compare'})}}><GitCompareArrows size={18}/><span>Jämför flera</span></button>
        <button type='button' className={start==='direct'?'selected':''} onClick={()=>{setStart('direct');track('broadband_match_answer',{question:'start',answer:'direct'})}}><ArrowRight size={18}/><span>Gå direkt</span></button>
      </div></div>
    </div>
    {!ready&&<div className='matchPrompt'><span>Två val räcker för att få en bättre väg vidare.</span></div>}
    {ready&&<><div className='matchResultHead'><div><small>DIN STARTPUNKT</small><h3>{access==='unknown'?'Kontrollera adressen först.':'Börja med de här alternativen.'}</h3><p>Vi visar inte ett nationellt “billigast”-påstående eftersom tillgänglighet och pris är adressberoende.</p></div><button type='button' onClick={()=>{setAccess(null);setStart(null)}}><RotateCcw size={14}/> Börja om</button></div><div className='matchPartnerGrid'>
      {matches.map((p,i)=><PartnerCard key={p.name} partner={p} reasons={reasons(p)} placement='broadband_matcher' intent={intent} position={i+1} cta={p.name==='Bredbandsval.se'?'Kontrollera adress & priser':'Se aktuella bredbandsalternativ'}/>)}
    </div></>}
    <AllPartners items={all} label={`Vill du se alla ${all.length} aktiva bredbandsalternativ?`} placement='broadband_matcher_all' intent='compare'/>
    <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Urvalet omfattar inte hela marknaden.</p>
  </section>;
}

type ElPath='compare'|'provider'|'source';

export function ElectricityPartnerMatcher(){
  const all=getActivePartners('el',undefined,20);
  const [pathChoice,setPathChoice]=useState<ElPath|null>(null);
  const matches=useMemo(()=>{
    if(!pathChoice) return [];
    const score=(p:ActivePartner)=>{
      let s=partnerRankScore(p);
      if(pathChoice==='compare'&&p.name==='Elskling') s+=90;
      if(pathChoice==='provider'&&p.name!=='Elskling') s+=24;
      if(pathChoice==='source'&&p.name==='Kärnfull Energi') s+=95;
      return s;
    };
    return [...all].sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name,'sv')).slice(0,3);
  },[all,pathChoice]);

  const reasons=(p:ActivePartner)=>{
    const out:string[]=[];
    if(pathChoice==='compare'&&p.name==='Elskling') out.push('Matchar att du vill jämföra flera elavtal på ett ställe');
    if(pathChoice==='provider'&&p.name==='Vattenfall') out.push('Direkt väg till en aktiv elhandelspartner');
    if(pathChoice==='source'&&p.name==='Kärnfull Energi') out.push('Relevant när elens ursprung är en viktig del av valet');
    if(!out.length) out.push(pathChoice==='provider'?'Du valde direkt till bolag – aktiva elhandelsbolag prioriteras':'Aktiv elpartner som matchar den jämförelseväg du valde');
    out.push('Använd samma årsförbrukning när du jämför pris, påslag och fasta avgifter');
    return out;
  };
  const ready=Boolean(pathChoice);

  return <section id='partners' className='mobileMatcher' aria-label='Hitta relevanta elavtal'>
    <div className='mobileMatcherIntro'><p className='kicker'>ELKOLL · 1 FRÅGA</p><h2>Välj hur du vill jämföra el.</h2><p>Årsförbrukningen påverkar vad avtalet kostar. Välj hur du vill jämföra här och använd sedan samma årsförbrukning hos alternativen för en rättvis jämförelse.</p></div>
    <DirectPartnerStrip items={all} label='Se elavtal direkt' placement='electricity_direct'/>
    <div className='matchQuestions matchQuestionsSingle'>
      <div className='matchQuestion'><div><small>1 AV 1</small><strong>Hur vill du jämföra?</strong></div><div className='matchOptions matchOptionsThree'>
        <button type='button' className={pathChoice==='compare'?'selected':''} onClick={()=>{setPathChoice('compare');track('electricity_match_answer',{question:'path',answer:'compare'})}}><GitCompareArrows size={18}/><span>Flera avtal</span></button>
        <button type='button' className={pathChoice==='provider'?'selected':''} onClick={()=>{setPathChoice('provider');track('electricity_match_answer',{question:'path',answer:'provider'})}}><ArrowRight size={18}/><span>Direkt till bolag</span></button>
        <button type='button' className={pathChoice==='source'?'selected':''} onClick={()=>{setPathChoice('source');track('electricity_match_answer',{question:'path',answer:'source'})}}><Sparkles size={18}/><span>Ursprung viktigt</span></button>
      </div></div>
    </div>
    {!ready&&<div className='matchPrompt'><span>Välj hur du vill jämföra så får du en relevant startpunkt.</span></div>}
    {ready&&<><div className='matchResultHead'><div><small>DIN KORTLISTA</small><h3>Börja med de här tre.</h3><p>Urvalet matchar den jämförelseväg du valde. Aktuellt pris, påslag och avtalsvillkor kontrolleras hos partnern med samma årsförbrukning som grund.</p></div><button type='button' onClick={()=>setPathChoice(null)}><RotateCcw size={14}/> Börja om</button></div><div className='matchPartnerGrid'>
      {matches.map((p,i)=><PartnerCard key={p.name} partner={p} reasons={reasons(p)} placement='electricity_matcher' intent='electricity' position={i+1}/>)}
    </div></>}
    <AllPartners items={all} label={`Vill du se alla ${all.length} aktiva elpartners?`} placement='electricity_matcher_all' intent='electricity'/>
    <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Ordningen är inte en aktuell prisranking.</p>
  </section>;
}

type InsuranceType='home'|'pet';

export function InsurancePartnerMatcher({preset}:{preset?:InsuranceType}){
  const [type,setType]=useState<InsuranceType|null>(preset||null);
  const allHome=getActivePartners('forsakring','home',12);
  const allPet=getActivePartners('forsakring','pet',12);
  const relevant=type==='home'?allHome:type==='pet'?allPet:[];

  return <section id='partners' className='mobileMatcher' aria-label='Hitta relevant försäkring'>
    <div className='mobileMatcherIntro'>
      <p className='kicker'>{preset?'RELEVANTA FÖRSÄKRINGSPARTNERS':'FÖRSÄKRINGSKOLL · 1 VAL'}</p>
      <h2>{preset==='pet'?'Jämför djurförsäkring för ditt djur.':preset==='home'?'Jämför hemförsäkring på samma grund.':'Börja med rätt typ av skydd.'}</h2>
      <p>{preset==='pet'
        ?'Hämta pris för just ditt djur och jämför premie, självrisk, veterinärvårdsbelopp och villkor på samma grund.'
        :preset==='home'
          ?'Jämför likvärdig omfattning innan du bedömer premien.'
          :'Vi blandar inte hem- och djurförsäkring i samma lista. Välj först vad du vill försäkra, så visas bara relevanta aktiva partners.'}</p>
    </div>

    {!preset&&<div className='matchQuestions matchQuestionsSingle'>
      <div className='matchQuestion'>
        <div><small>1 AV 1</small><strong>Vad vill du försäkra?</strong></div>
        <div className='matchOptions'>
          <button type='button' className={type==='home'?'selected':''} onClick={()=>{setType('home');track('insurance_match_answer',{question:'type',answer:'home'})}}><ShieldCheck size={18}/><span>Hem</span></button>
          <button type='button' className={type==='pet'?'selected':''} onClick={()=>{setType('pet');track('insurance_match_answer',{question:'type',answer:'pet'})}}><PawPrint size={18}/><span>Hund / katt</span></button>
        </div>
      </div>
    </div>}

    {!type&&<div className='matchPrompt'><span>Välj försäkringstyp så slipper du irrelevanta alternativ.</span></div>}

    {type&&<>
      {!preset&&<div className='matchResultHead'>
        <div><small>DIN JÄMFÖRELSE</small><h3>{type==='home'?'Hemförsäkring':'Djurförsäkring'}.</h3><p>{type==='home'?'Jämför likvärdig omfattning innan du bedömer premien.':'Hämta pris för just ditt djur och jämför samma typ av skydd.'}</p></div>
        <button type='button' onClick={()=>setType(null)}><RotateCcw size={14}/> Byt typ</button>
      </div>}

      <DirectPartnerStrip
        items={relevant}
        label={type==='home'?'Jämför hemförsäkring direkt':'Jämför djurförsäkring direkt'}
        placement={type==='home'?'insurance_home_direct':'insurance_pet_direct'}
      />

      <AllPartners
        items={relevant}
        label={`Visa alla ${relevant.length} aktiva ${type==='home'?'hemförsäkrings':'djurförsäkrings'}partners`}
        placement='insurance_matcher_all'
        intent={type}
      />
    </>}

    <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Vi utser inte en försäkring åt dig.</p>
  </section>;
}

type LoanPurpose='new'|'consolidate';
export function LoanPartnerMatcher(){
  const all=getActivePartners('ekonomi','loan',20);
  const [purpose,setPurpose]=useState<LoanPurpose|null>(null);
  const matches=useMemo(()=>{
    if(!purpose) return [];
    const score=(p:ActivePartner)=>{
      let s=partnerRankScore(p);
      if(purpose==='consolidate'&&p.name==='Samly') s+=80;
      if(purpose==='new'&&p.name==='Lendella') s+=35;
      if(purpose==='new'&&p.name==='Jämförbanker.se') s+=15;
      return s;
    };
    return [...all].sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name,'sv')).slice(0,3);
  },[all,purpose]);

  const reasons=(p:ActivePartner)=>{
    const out:string[]=[];
    if(purpose==='consolidate'&&p.name==='Samly') out.push('Partnerinformationen omfattar uttryckligen privatlån och samlingslån');
    else if(purpose==='new') out.push('Relevant aktiv tjänst för att jämföra privatlån');
    else out.push('Relevant aktiv lånejämförelsetjänst');
    out.push('Jämför effektiv ränta, avgifter, löptid och total återbetalning');
    return out;
  };
  const ready=Boolean(purpose);

  return <section id='partners' className='mobileMatcher' aria-label='Hitta relevant lånejämförelse'>
    <div className='mobileMatcherIntro'><p className='kicker'>LÅNEKOLL · 1 FRÅGA</p><h2>Jämför rätt erbjudanden – inte bara en låg månadssiffra.</h2><p>Räntan sätts individuellt. Därför hjälper vi dig först välja rätt jämförelseväg och skickar dig sedan till tjänster där du kan se faktiska erbjudanden.</p></div>
    <DirectPartnerStrip items={all} label='Jämför lån direkt' placement='loan_direct'/>
    <div className='matchQuestions'>
      <div className='matchQuestion'><div><small>1 AV 1</small><strong>Vad vill du göra?</strong></div><div className='matchOptions'>
        <button type='button' className={purpose==='new'?'selected':''} onClick={()=>{setPurpose('new');track('loan_match_answer',{question:'purpose',answer:'new'})}}><CircleDollarSign size={18}/><span>Nytt privatlån</span></button>
        <button type='button' className={purpose==='consolidate'?'selected':''} onClick={()=>{setPurpose('consolidate');track('loan_match_answer',{question:'purpose',answer:'consolidate'})}}><GitCompareArrows size={18}/><span>Samla lån</span></button>
      </div></div>
    </div>
    {!ready&&<div className='matchPrompt'><span>Välj vad du vill göra så får du en relevant startpunkt.</span></div>}
    {ready&&<><div className='matchResultHead'><div><small>DIN KORTLISTA</small><h3>Börja med de här tre tjänsterna.</h3><p>Det här är en relevant startordning – inte ett löfte om vilken långivare som ger lägst ränta. Jämför de faktiska erbjudandena du får.</p></div><button type='button' onClick={()=>setPurpose(null)}><RotateCcw size={14}/> Börja om</button></div><div className='matchPartnerGrid'>
      {matches.map((p,i)=><PartnerCard key={p.name} partner={p} reasons={reasons(p)} placement='loan_matcher' intent='loan' position={i+1} cta={p.cta||'Jämför låneerbjudanden'}/>)}
    </div></>}
    <AllPartners items={all} label={`Vill du se alla ${all.length} aktiva lånejämförelsetjänster?`} placement='loan_matcher_all' intent='loan'/>
    <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Ränta och villkor är individuella och urvalet omfattar inte hela marknaden.</p>
  </section>;
}
