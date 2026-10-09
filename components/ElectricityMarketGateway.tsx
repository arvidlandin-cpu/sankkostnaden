import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Calculator, CheckCircle2, GitCompareArrows, ShieldCheck, Zap } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import { getActivePartners, type ActivePartner } from '../lib/partners';
import styles from '../styles/ElectricityMarketGateway.module.css';
import ElectricitySpotPrices from './ElectricitySpotPrices';

const all=getActivePartners('el',undefined,40);
const comparison=all.find(partner=>partner.name==='Elskling');
const suppliers=all.filter(partner=>partner.name!=='Elskling').sort((a,b)=>a.name.localeCompare(b.name,'sv'));

function trackPath(path:string){
  emitAnalyticsEvent('electricity_hub_path',{path,source:'electricity_hub'});
}

function Logo({partner}:{partner:ActivePartner}){
  return <span className={styles.logo} aria-hidden='true'>
    {partner.domain
      ? <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(partner.domain)}&sz=128`} alt='' loading='lazy' width={48} height={48}/>
      : <Zap size={24}/>}
  </span>;
}

/**
 * This is a directory of ACTUAL approved active programs, not a price ranking.
 * Comparison services and individual electricity suppliers are visibly separated.
 */
export default function ElectricityMarketGateway(){
  return <div className={styles.root} data-testid='electricity-market'>
    <section className={styles.section} aria-labelledby='electricity-start-title'>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>BÖRJA HÄR</p>
          <h2 id='electricity-start-title'>Välj hur du vill jämföra</h2>
          <p>Välj att jämföra flera erbjudanden hos Elskling eller gå direkt till ett elbolag. Du kan börja utan att ange förbrukning.</p>
        </div>
        <span className={styles.count}><CheckCircle2 size={16}/> {all.length} aktiva samarbetspartners</span>
      </div>

      <div className={styles.routes}>
        {comparison&&<article className={styles.compareCard}>
          <div className={styles.routeIcon}><GitCompareArrows size={20}/></div>
          <div className={styles.routeCopy}>
            <span className={styles.routeType}>JÄMFÖRELSETJÄNST · FLERA ALTERNATIV</span>
            <h3>Jämför flera elbolag på ett ställe</h3>
            <p>Elskling hjälper dig jämföra aktuella erbjudanden utifrån uppgifterna du fyller i hos dem.</p>
            <div className={styles.providerName}><Logo partner={comparison}/><strong>{comparison.name}</strong></div>
          </div>
          <a className={styles.primary} href={comparison.trackingUrl} onClick={()=>trackPath('compare_service')} data-partner={comparison.name} data-category='el' data-intent='compare' data-placement='electricity_hub_comparison' data-partner-position='1' target='_blank' rel='sponsored nofollow noopener'>Jämför aktuella elavtal hos Elskling <ArrowUpRight size={19}/></a>
          <small className={styles.sponsored}>Partnerlänk · öppnas hos Elskling</small>
        </article>}

        <article className={styles.directCard}>
          <div className={styles.routeIcon}><Zap size={20}/></div>
          <div className={styles.routeCopy}>
            <span className={styles.routeType}>ENSKILDA ELBOLAG</span>
            <h3>Vill du gå direkt till ett elbolag?</h3>
            <p>Välj bland våra {suppliers.length} elbolag. Kontrollera pris och villkor hos det bolag du är intresserad av.</p>
            <div className={styles.miniNames}>{suppliers.slice(0,4).map(partner=><span key={partner.name}>{partner.name}</span>)}<span>+ {Math.max(0,suppliers.length-4)} fler</span></div>
          </div>
          <a className={styles.secondary} href='#elbolag' onClick={()=>trackPath('provider_list')}>Se alla elbolag <ArrowRight size={19}/></a>
          <small className={styles.sponsored}>Flera leverantörer · ingen prisranking</small>
        </article>
      </div>

      <ElectricitySpotPrices/>

    </section>

    <section id='elbolag' className={styles.suppliers} aria-labelledby='electricity-providers-title'>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>ÖPPET URVAL · INTE HELA MARKNADEN</p>
          <h2 id='electricity-providers-title'>Våra aktiva elbolag</h2>
          <p>Vi visar {suppliers.length} elbolag i bokstavsordning. Priser och villkor kontrolleras hos respektive bolag.</p>
        </div>
      </div>
      <div className={styles.supplierGrid}>
        {suppliers.map((partner,index)=><article className={styles.supplier} key={partner.name}>
          <div className={styles.supplierIdentity}><Logo partner={partner}/><div><strong>{partner.name}</strong><small>Elhandelsbolag · aktiv partner</small></div></div>
          <a href={partner.trackingUrl} onClick={()=>trackPath('direct_supplier')} data-partner={partner.name} data-category='el' data-intent='electricity' data-placement='electricity_hub_supplier' data-partner-position={index+1} target='_blank' rel='sponsored nofollow noopener' aria-label={`Se aktuella elavtal hos ${partner.name}`}>Se aktuella avtal <ArrowUpRight size={17}/></a>
        </article>)}
      </div>
      <p className={styles.disclosure}>Kommersiella länkar: vi kan få provision om du blir kund. Det påverkar inte priset hos bolaget. Den här förteckningen är inte hela marknaden, och ordningen är alfabetisk – inte baserad på provision eller aktuella priser.</p>
    </section>

    <section className={styles.nextStep} aria-labelledby='electricity-cost-title'>
      <div className={styles.nextIcon}><Calculator size={25}/></div>
      <div>
        <p className={styles.eyebrow}>FÖR DIG MED TVÅ ERBJUDANDEN</p>
        <h2 id='electricity-cost-title'>Vilket av dina två elavtal kostar minst på ett år?</h2>
        <p>Jämför kWh-pris, fasta avgifter och rabatter med uppgifterna från dina två erbjudanden.</p>
      </div>
      <Link href='/verktyg/elavtalskostnad/?src=elavtal' onClick={()=>trackPath('cost_calculator')}>Räkna hela årskostnaden <ArrowRight size={18}/></Link>
    </section>
  </div>;
}
