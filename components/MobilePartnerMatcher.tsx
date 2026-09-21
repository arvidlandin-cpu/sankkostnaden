import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, RotateCcw, Users, UserRound, Waves, Unplug } from 'lucide-react';
import { getActivePartners, type ActivePartner } from '../lib/partners';

type Household='one'|'family';
type Priority='flex'|'data'|'open';

function track(event:string,params:Record<string,string|number>){
  if(typeof window==='undefined') return;
  const w=window as any;
  if(typeof w.gtag==='function') w.gtag('event',event,params);
  else if(Array.isArray(w.dataLayer)) w.dataLayer.push({event,...params});
}

function scorePartner(p:ActivePartner,household:Household,priority:Priority){
  let score=p.priority||0;
  if(household==='family'&&p.intents.includes('family')) score+=45;
  if(household==='one'&&!p.intents.includes('family')) score+=4;
  if(priority==='flex'&&p.intents.includes('no-binding')) score+=40;
  if(priority==='data'&&p.intents.includes('data')) score+=24;
  if(priority==='open') score+=p.intents.includes('compare')?8:0;
  return score;
}

function reasons(p:ActivePartner,household:Household,priority:Priority){
  const out:string[]=[];
  if(household==='family'&&p.intents.includes('family')) out.push('Relevant för familj eller flera abonnemang');
  if(priority==='flex'&&p.intents.includes('no-binding')) out.push('Matchar ditt önskemål om flexibilitet');
  if(priority==='data'&&p.intents.includes('data')) out.push('Relevant när surfmängden är viktig');
  if(!out.length) out.push('Relevant aktiv partner för din valda profil');
  out.push('Aktuellt pris och exakta villkor kontrolleras hos operatören');
  return out.slice(0,2);
}

function PartnerCard({partner,household,priority,position}:{partner:ActivePartner;household:Household;priority:Priority;position:number}){
  const why=reasons(partner,household,priority);
  return <article className='matchPartnerCard'>
    <div className='matchPartnerTop'>
      <div><small>FÖRSLAG {position}</small><h3>{partner.name}</h3></div>
      <span><BadgeCheck size={13}/> PARTNERLÄNK</span>
    </div>
    <ul>{why.map(item=><li key={item}><Check size={14}/>{item}</li>)}</ul>
    <a
      href={partner.trackingUrl}
      data-partner={partner.name}
      data-category='mobil'
      data-intent={priority==='flex'?'no-binding':priority==='data'?'data':household==='family'?'family':'compare'}
      data-placement='mobile_matcher'
      target='_blank'
      rel='sponsored nofollow noopener'
      onClick={()=>track('mobile_match_partner_click',{partner:partner.name,household,priority,position})}
    >
      Se aktuella abonnemang hos {partner.name}<ArrowUpRight size={17}/>
    </a>
  </article>;
}

export default function MobilePartnerMatcher(){
  const all=getActivePartners('mobil','compare',12);
  const [household,setHousehold]=useState<Household|null>(null);
  const [priority,setPriority]=useState<Priority|null>(null);
  const [showAll,setShowAll]=useState(false);

  const matches=useMemo(()=>{
    if(!household||!priority) return [];
    return [...all]
      .sort((a,b)=>scorePartner(b,household,priority)-scorePartner(a,household,priority)||a.name.localeCompare(b.name,'sv'))
      .slice(0,3);
  },[all,household,priority]);

  const ready=Boolean(household&&priority);
  const chooseHousehold=(value:Household)=>{
    setHousehold(value);
    track('mobile_match_answer',{question:'household',answer:value});
  };
  const choosePriority=(value:Priority)=>{
    setPriority(value);
    track('mobile_match_answer',{question:'priority',answer:value});
  };
  const reset=()=>{
    setHousehold(null);setPriority(null);setShowAll(false);
    track('mobile_match_reset',{source:'matcher'});
  };

  return <section id='partners' className='mobileMatcher' aria-label='Hitta relevanta mobilabonnemang'>
    <div className='mobileMatcherIntro'>
      <p className='kicker'>DIN SNABBLISTA · 2 FRÅGOR</p>
      <h2>Vilka operatörer är mest relevanta för dig?</h2>
      <p>Vi har flera aktiva mobilpartners. I stället för att rada upp alla direkt hjälper vi dig att börja med tre alternativ som passar det du söker. Vi rankar inte aktuella priser – de kontrollerar du hos operatören.</p>
    </div>
    <div className='visiblePartnerNames' aria-label='Aktiva mobilpartners i vårt urval'>
      <span>Aktiva mobilpartners i vårt urval</span>
      <div>{all.map(p=><strong key={p.name}>{p.name}</strong>)}</div>
    </div>

    <div className='matchQuestions'>
      <div className='matchQuestion'>
        <div><small>1 AV 2</small><strong>Vem gäller abonnemanget?</strong></div>
        <div className='matchOptions'>
          <button type='button' className={household==='one'?'selected':''} onClick={()=>chooseHousehold('one')}><UserRound size={18}/><span>Bara mig</span></button>
          <button type='button' className={household==='family'?'selected':''} onClick={()=>chooseHousehold('family')}><Users size={18}/><span>Familj / flera</span></button>
        </div>
      </div>
      <div className='matchQuestion'>
        <div><small>2 AV 2</small><strong>Vad är viktigast?</strong></div>
        <div className='matchOptions matchOptionsThree'>
          <button type='button' className={priority==='flex'?'selected':''} onClick={()=>choosePriority('flex')}><Unplug size={18}/><span>Flexibilitet</span></button>
          <button type='button' className={priority==='data'?'selected':''} onClick={()=>choosePriority('data')}><Waves size={18}/><span>Mycket surf</span></button>
          <button type='button' className={priority==='open'?'selected':''} onClick={()=>choosePriority('open')}><ArrowRight size={18}/><span>Visa relevanta</span></button>
        </div>
      </div>
    </div>

    {!ready&&<div className='matchPrompt'><span>Välj ett svar i båda frågorna så får du en kortlista direkt.</span></div>}

    {ready&&household&&priority&&<>
      <div className='matchResultHead'>
        <div><small>DIN KORTLISTA</small><h3>Börja med de här tre.</h3><p>Urvalet bygger på dina två svar och egenskaper i vårt aktiva partnerurval – inte på en aktuell prisranking.</p></div>
        <button type='button' onClick={reset}><RotateCcw size={14}/> Börja om</button>
      </div>
      <div className='matchPartnerGrid'>
        {matches.map((partner,index)=><PartnerCard key={partner.name} partner={partner} household={household} priority={priority} position={index+1}/>)}
      </div>
    </>}

    <details className='allPartnersDetails' open={showAll} onToggle={e=>setShowAll((e.currentTarget as HTMLDetailsElement).open)}>
      <summary>Vill du hellre se alla {all.length} aktiva mobilpartners?<ArrowRight size={15}/></summary>
      <div className='allPartnersGrid'>
        {all.map(partner=><a
          key={partner.name}
          href={partner.trackingUrl}
          data-partner={partner.name}
          data-category='mobil'
          data-intent='compare'
          data-placement='mobile_matcher_all'
          target='_blank'
          rel='sponsored nofollow noopener'
        ><span><strong>{partner.name}</strong><small>Partnerlänk · kontrollera aktuellt pris och villkor</small></span><ArrowUpRight size={16}/></a>)}
      </div>
    </details>
    <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Urvalet omfattar inte hela marknaden.</p>
  </section>;
}
