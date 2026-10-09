import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Calculator, CheckCircle2, GitCompareArrows, MapPin, Wifi } from 'lucide-react';
import { getActivePartners, type ActivePartner } from '../lib/partners';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/ElectricityMarketGateway.module.css';

const active=getActivePartners('bredband',undefined,20);
const comparison=active.find(item=>item.name==='Bredbandsval.se');
const providers=active.filter(item=>item.name!=='Bredbandsval.se').sort((a,b)=>a.name.localeCompare(b.name,'sv'));

function Logo({partner}:{partner:ActivePartner}){
 return <span className={styles.logo} aria-hidden='true'>
  {partner.domain
    ?<img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(partner.domain)}&sz=128`} alt='' width={48} height={48} loading='lazy'/>
    :<Wifi size={24}/>}
 </span>;
}
function track(path:string){emitAnalyticsEvent('broadband_hub_path',{source:'broadband_hub',path});}

export default function BroadbandMarketGateway(){
 return <div className={styles.root} data-testid='broadband-market'>
  <section className={styles.section} aria-labelledby='broadband-start-title'>
   <div className={styles.sectionHead}>
    <div>
     <p className={styles.eyebrow}>BÖRJA MED DIN ADRESS · INGEN INLOGGNING HÄR</p>
     <h2 id='broadband-start-title'>Vad kan du faktiskt få på din adress?</h2>
     <p>Se vilka anslutningar och erbjudanden som finns där du bor. Adresskontrollen görs hos Bredbandsval.</p>
    </div>
    <span className={styles.count}><CheckCircle2 size={16}/> {active.length} aktiva bredbandspartners</span>
   </div>
   <div className={styles.routes}>
    {comparison&&<article className={styles.compareCard}>
     <div className={styles.routeIcon}><MapPin size={20}/></div>
     <div className={styles.routeCopy}>
      <span className={styles.routeType}>FLERA OPERATÖRER · JÄMFÖRELSETJÄNST</span>
      <h3>Kontrollera utbudet på din adress</h3>
      <p>Hos Bredbandsval kan du se vilka anslutningar och aktuella erbjudanden som är tillgängliga där du bor. Adressuppgifterna lämnas hos Bredbandsval, inte hos oss.</p>
      <div className={styles.providerName}><Logo partner={comparison}/><strong>Bredbandsval.se</strong></div>
     </div>
     <a className={styles.primary} href={comparison.trackingUrl} onClick={()=>track('compare_by_address')} data-partner={comparison.name} data-category='bredband' data-intent='compare' data-placement='broadband_hub_comparison' data-partner-position='1' target='_blank' rel='sponsored nofollow noopener'>Kontrollera bredband på din adress <ArrowUpRight size={19}/></a>
     <small className={styles.sponsored}>Partnerlänk · faktisk adresskontroll hos Bredbandsval</small>
    </article>}
    <article className={styles.directCard}>
     <div className={styles.routeIcon}><Wifi size={20}/></div>
     <div className={styles.routeCopy}>
      <span className={styles.routeType}>OM DU ÄR OSÄKER PÅ HASTIGHETEN</span>
      <h3>Hur snabbt bredband behöver du egentligen?</h3>
      <p>Antal personer, samtidiga aktiviteter och stabilitet är viktigare än att automatiskt välja högsta hastigheten. Få hjälp att välja innan du jämför priser.</p>
      <div className={styles.miniNames}><span>Hushållets behov</span><span>Fiber eller 5G?</span><span>Inte betala för onödig fart</span></div>
     </div>
     <Link className={styles.secondary} href='/bredband/vilken-hastighet-behover-jag/' onClick={()=>track('speed_guidance')}>Hjälp mig välja hastighet <ArrowRight size={19}/></Link>
     <small className={styles.sponsored}>Gratis guide · ingen partner behövs</small>
    </article>
   </div>
  </section>

  <section className={styles.suppliers} aria-labelledby='broadband-provider-title'>
   <div className={styles.sectionHead}>
    <div>
     <p className={styles.eyebrow}>GÅ DIREKT TILL OPERATÖR · AKTIVA LÄNKAR</p>
     <h2 id='broadband-provider-title'>Vill du kontrollera ett enskilt bolag?</h2>
     <p>Våra {providers.length} direktpartners. Kontrollera hastighet, kampanjpris och ordinarie villkor på din adress hos bolaget.</p>
    </div>
   </div>
   <div className={styles.routes}>
    {providers.map((partner,index)=><article key={partner.name} className={styles.supplier}>
     <div className={styles.supplierIdentity}><Logo partner={partner}/><div><strong>{partner.name}</strong><small>Enskild leverantör · adresskontroll hos bolaget</small></div></div>
     <a href={partner.trackingUrl} onClick={()=>track('direct_supplier')} data-partner={partner.name} data-category='bredband' data-intent='compare' data-placement='broadband_hub_supplier' data-partner-position={index+1} target='_blank' rel='sponsored nofollow noopener'>Se bredband hos {partner.name} <ArrowUpRight size={17}/></a>
    </article>)}
   </div>
   <p className={styles.disclosure}>Partnerlänkar: vi kan få provision om du blir kund, utan extra kostnad för dig. Utbudet ovan omfattar inte hela marknaden. De enskilda bolagen visas alfabetiskt och inga priser är hämtade live på den här sidan.</p>
  </section>

  <section className={styles.nextStep} aria-labelledby='broadband-year-title'>
   <div className={styles.nextIcon}><Calculator size={25}/></div>
   <div>
    <p className={styles.eyebrow}>HAR DU TVÅ ERBJUDANDEN?</p>
    <h2 id='broadband-year-title'>Jämför verklig kostnad första året</h2>
    <p>Lägg in pris, kampanjperiod och avgifter från dina två erbjudanden. Se vad de kostar under första året.</p>
   </div>
   <Link href='/verktyg/forstaarskostnad-bredband/?src=bredband' onClick={()=>track('first_year_calculator')}>Räkna förstaårskostnaden <ArrowRight size={18}/></Link>
  </section>

  <div className={styles.knowledge}>
   <GitCompareArrows size={20}/><div><strong>Fiber eller mobilt bredband?</strong><p>Skillnaderna gäller även kapacitet, signal och stabilitet – inte bara hastighet på pappret.</p></div>
   <Link href='/bredband/fiber-eller-mobilt-bredband/' onClick={()=>track('technology_help')}>Jämför tekniken <ArrowRight size={16}/></Link>
  </div>
 </div>;
}
