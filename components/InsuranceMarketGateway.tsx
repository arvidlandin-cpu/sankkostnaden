import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, CircleHelp, PawPrint, Plane, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import { getActivePartners, type ActivePartner, type PartnerIntent } from '../lib/partners';
import styles from '../styles/ElectricityMarketGateway.module.css';

const home=getActivePartners('forsakring','home',30).sort((a,b)=>a.name.localeCompare(b.name,'sv'));
const pet=getActivePartners('forsakring','pet',30).sort((a,b)=>a.name.localeCompare(b.name,'sv'));
const travel=getActivePartners('forsakring','travel',30);
const claims=getActivePartners('forsakring','claims',30);
const total=new Set([...home,...pet,...travel,...claims].map(p=>p.name)).size;

function track(path:string){emitAnalyticsEvent('insurance_hub_path',{path,source:'insurance_hub'});}

function Brand({partner}:{partner:ActivePartner}){
 return <span className={styles.logo} aria-hidden='true'>
   {partner.domain?<img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(partner.domain)}&sz=128`} alt='' loading='lazy' width={48} height={48}/>:<ShieldCheck size={24}/>}
 </span>;
}

function PartnerGroup({items,kind,heading,description}:{items:ActivePartner[];kind:PartnerIntent;heading:string;description:string}){
 if(!items.length)return null;
 return <section aria-labelledby={`insurance-${kind}-heading`} className={styles.suppliers}>
   <div className={styles.sectionHead}><div>
     <p className={styles.eyebrow}>AKTIVA ALTERNATIV · {kind==='home'?'HEMFÖRSÄKRING':'DJURFÖRSÄKRING'}</p>
     <h2 id={`insurance-${kind}-heading`}>{heading}</h2>
     <p>{description}</p>
   </div></div>
   <div className={styles.supplierGrid}>
     {items.map((partner,index)=><article key={partner.name} className={styles.supplier}>
       <div className={styles.supplierIdentity}><Brand partner={partner}/><div>
         <strong>{partner.name}</strong>
         <small>{partner.name==='Compricer'?'Jämförelsetjänst – personliga offerter':'Försäkringsbolag eller försäkringstjänst – kontrollera skyddet'}</small>
       </div></div>
       <a href={partner.trackingUrl} onClick={()=>track(`${kind}_partner`)}
         data-partner={partner.name} data-category='forsakring' data-intent={kind}
         data-placement={`insurance_hub_${kind}`} data-partner-position={index+1}
         target='_blank' rel='sponsored nofollow noopener'
         aria-label={`Se ${kind==='home'?'hemförsäkring':'djurförsäkring'} hos ${partner.name}`}>
         {partner.name==='Compricer'?'Jämför aktuella offerter':'Se pris och villkor'} <ArrowUpRight size={17}/>
       </a>
     </article>)}
   </div>
 </section>;
}

function SpecialRoute({partner,intent,title,body,guide,guideLabel,disclaimer}:{partner:ActivePartner|undefined;intent:'travel'|'claims';title:string;body:string;guide:string;guideLabel:string;disclaimer:string}){
 return <article className={styles.directCard}>
   <div className={styles.routeIcon}>{intent==='travel'?<Plane size={20}/>:<ClipboardCheck size={20}/>}</div>
   <div className={styles.routeCopy}>
    <span className={styles.routeType}>{intent==='travel'?'RESA OCH AVBESTÄLLNING':'ERSÄTTNING EFTER EN SKADA'}</span>
    <h3>{title}</h3>
    <p>{body}</p>
    {partner&&<div className={styles.providerName}><Brand partner={partner}/><strong>{partner.name}</strong></div>}
   </div>
   <Link className={styles.secondary} href={guide} onClick={()=>track(`${intent}_guide`)}>{guideLabel} <ArrowRight size={17}/></Link>
   {partner&&<a className={styles.primary} href={partner.trackingUrl} onClick={()=>track(`${intent}_partner`)}
     data-partner={partner.name} data-category='forsakring' data-intent={intent}
     data-placement={`insurance_hub_${intent}`} data-partner-position='1'
     target='_blank' rel='sponsored nofollow noopener'>Se alternativ hos {partner.name} <ArrowUpRight size={17}/></a>}
   <small className={styles.sponsored}>{disclaimer}</small>
 </article>;
}

export default function InsuranceMarketGateway(){
 return <div className={styles.root} data-testid='insurance-market'>
   <section className={styles.section} aria-labelledby='insurance-start-title'>
     <div className={styles.sectionHead}><div>
       <p className={styles.eyebrow}>BÖRJA MED RÄTT BEHOV</p>
       <h2 id='insurance-start-title'>Vad vill du försäkra eller kontrollera?</h2>
       <p>Försäkringar kan inte rangordnas på premie ensam. Välj rätt skydd först, jämför sedan villkor och kontrollera det personliga priset hos försäkringsgivaren.</p>
     </div><span className={styles.count}><CheckCircle2 size={16}/> {total} aktiva försäkringspartners</span></div>
     <div className={styles.routes}>
       <article className={styles.compareCard}>
         <div className={styles.routeIcon}><ShieldCheck size={21}/></div>
         <div className={styles.routeCopy}>
           <span className={styles.routeType}>HEM · HYRESRÄTT · BOSTADSRÄTT</span>
           <h3>Vilket skydd behöver ditt hem?</h3>
           <p>Kontrollera bostadsform, självrisk, egendom, ansvar och reseskydd innan du jämför premien. Bostadsrätt kan även kräva ett särskilt tillägg.</p>
           <div className={styles.miniNames}><span>Hemförsäkring</span><span>Bostadsrättstillägg</span><span>Självrisk</span></div>
         </div>
         <Link className={styles.primary} href='/forsakring/hemforsakring-skyddskoll/' onClick={()=>track('home_check')}>Kontrollera hemskyddet <ArrowRight size={19}/></Link>
         <small className={styles.sponsored}>Gratis vägledning · ingen försäkringspremie hämtas här</small>
       </article>
       <article className={styles.directCard}>
         <div className={styles.routeIcon}><PawPrint size={21}/></div>
         <div className={styles.routeCopy}>
           <span className={styles.routeType}>HUND · KATT</span>
           <h3>Jämför skyddet för ditt djur</h3>
           <p>Priset påverkas av djurets uppgifter och valt skydd. Jämför veterinärvårdsbelopp, självrisk, undantag och ersättningsvillkor innan du väljer.</p>
           <div className={styles.miniNames}><span>Veterinärvård</span><span>Självrisk</span><span>Undantag</span></div>
         </div>
         <Link className={styles.secondary} href='/forsakring/djurforsakring/' onClick={()=>track('pet_guide')}>Jämför djurförsäkring <ArrowRight size={19}/></Link>
         <small className={styles.sponsored}>Använd guiden innan du begär pris för just ditt djur</small>
       </article>
     </div>
   </section>

   <PartnerGroup items={home} kind='home' heading='Hemförsäkring – se våra aktiva alternativ'
    description='Här visas både en tjänst för att jämföra flera offerter och enskilda försäkringsbolag. De har olika roller. Kontrollera likvärdigt skydd innan du jämför priser.'/>
   <PartnerGroup items={pet} kind='pet' heading='Djurförsäkring – se våra aktiva alternativ'
    description='Kontrollera aktuella premier, veterinärvårdsbelopp, fasta och rörliga självrisker och undantag för just ditt djur. Ingen personlig offert ges här.'/>

   <section className={styles.section} aria-labelledby='insurance-other-heading'>
     <div className={styles.sectionHead}><div>
       <p className={styles.eyebrow}>ANDRA BEHOV · INTE SAMMA JÄMFÖRELSE</p>
       <h2 id='insurance-other-heading'>Reseskydd eller hjälp efter en skada?</h2>
       <p>Reseförsäkring och försäkringsersättning är två andra användarsituationer. Vi blandar därför inte dessa i en generell hemförsäkringsranking.</p>
     </div></div>
     <div className={styles.routes}>
       <SpecialRoute partner={travel[0]} intent='travel' title='Reser du snart? Kontrollera först vad du redan har.'
         body='Börja med din hemförsäkring och eventuellt kortskydd. Läs villkor för avbeställning, reslängd och undantag innan du köper till något.'
         guide='/forsakring/reseforsakring/' guideLabel='Förstå reseskyddet'
         disclaimer='Partnerlänk om du går vidare till reseförsäkring · kontrollera omfattning och undantag'/>
       <SpecialRoute partner={claims[0]} intent='claims' title='Har du redan drabbats av en skada?'
         body='Kontrollera befintlig försäkring och skadeanmälan först. Hjälp att driva ett ersättningsärende kan ha en avgiftsmodell – kontrollera villkoren.'
         guide='/forsakring/forsakringsersattning/' guideLabel='Läs om ersättningsärenden'
         disclaimer='Partnerlänk till ärendehjälp · kontrollera eventuell kostnad, fullmakt och villkor'/>
     </div>
   </section>

   <div className={styles.knowledge}>
     <CircleHelp size={20}/>
     <div><strong>Urvalet omfattar inte hela marknaden.</strong>
       <p>Samma bolag kan förekomma för flera typer av skydd. Partnerlistorna är alfabetiska inom respektive kategori och bygger inte på provision eller livepremie. Vi kan få provision om du blir kund – inte ett säkert lägre pris.</p>
     </div>
     <Link href='/sa-jamfor-vi/' onClick={()=>track('methodology')}>Så väljer vi partners <ArrowRight size={16}/></Link>
   </div>
 </div>;
}
