import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CheckCircle2, Smartphone, Users, Wifi } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import { getActivePartners, type ActivePartner } from '../lib/partners';
import styles from '../styles/ElectricityMarketGateway.module.css';

const all=getActivePartners('mobil','compare',40).sort((a,b)=>a.name.localeCompare(b.name,'sv'));

function pathClick(path:string){
  emitAnalyticsEvent('mobile_hub_path',{source:'mobile_hub',path});
}
function Brand({partner}:{partner:ActivePartner}){
  return <span className={styles.logo} aria-hidden='true'>
    {partner.domain
      ? <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(partner.domain)}&sz=128`} alt='' loading='lazy' width={48} height={48}/>
      : <Smartphone size={24}/>}
  </span>;
}

export default function MobileMarketGateway(){
  return <div data-testid='mobile-market' className={styles.root}>
    <section className={styles.section} aria-labelledby='mobile-start-title'>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>ENKLARE VAL · UTAN INLOGGNING</p>
          <h2 id='mobile-start-title'>Vad vill du få ordning på?</h2>
          <p>Börja med surfbehovet, familjens kostnader eller gå direkt till en operatör.</p>
        </div>
        <span className={styles.count}><CheckCircle2 size={16}/> {all.length} aktiva mobilpartners</span>
      </div>
      <div className={styles.routes}>
        <article className={styles.compareCard}>
          <div className={styles.routeIcon}><Smartphone size={21}/></div>
          <div className={styles.routeCopy}>
            <span className={styles.routeType}>ETT ABONNEMANG</span>
            <h3>Hur mycket surf behöver du?</h3>
            <p>Börja med surfvanor och täckning där du använder mobilen. Du behöver inte veta din nuvarande månadskostnad för att få en första vägledning.</p>

          </div>
          <Link className={styles.primary} href='/mobil/hur-mycket-surf-behover-jag/' onClick={()=>pathClick('single_surf_help')}>Hitta rätt nivå av surf <ArrowRight size={19}/></Link>
          <small className={styles.sponsored}>Gratis vägledning · kontrollera erbjudanden hos operatören</small>
        </article>
        <article className={styles.directCard}>
          <div className={styles.routeIcon}><Users size={21}/></div>
          <div className={styles.routeCopy}>
            <span className={styles.routeType}>TVÅ TILL FEM ABONNEMANG</span>
            <h3>Blir familjeabonnemang billigare?</h3>
            <p>Räkna hela hushållets kostnad för samma tolv månader, med extra användare, kampanjperiod och ordinarie pris. Ange själv de erbjudanden du har.</p>

          </div>
          <Link className={styles.secondary} href='/mobil/lonar-sig-familjeabonnemang/' onClick={()=>pathClick('family_calculator')}>Räkna familjens totalkostnad <ArrowRight size={19}/></Link>
          <small className={styles.sponsored}>Kalkyl med dina egna priser · inte en offert</small>
        </article>
      </div>
    </section>

    <section className={styles.suppliers} aria-labelledby='mobile-supplier-title'>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>ÖPPEN PARTNERÖVERSIKT · INGEN PRISRANKING</p>
          <h2 id='mobile-supplier-title'>Se våra aktiva mobiloperatörer</h2>
          <p>Se operatörerna i bokstavsordning. Kontrollera surf, täckning och slutpris direkt hos bolaget – vi har ingen fullständig liveprislista.</p>
        </div>
      </div>
      <div className={styles.supplierGrid}>
        {all.map((partner,index)=><article key={partner.name} className={styles.supplier}>
          <div className={styles.supplierIdentity}>
            <Brand partner={partner}/>
            <div><strong>{partner.name}</strong><small>Mobilabonnemang · aktiv partner</small></div>
          </div>
          <a href={partner.trackingUrl}
            onClick={()=>pathClick('direct_operator')}
            data-partner={partner.name}
            data-category='mobil'
            data-intent='compare'
            data-placement='mobile_hub_operator'
            data-partner-position={index+1}
            target='_blank'
            rel='sponsored nofollow noopener'
            aria-label={`Se aktuella mobilabonnemang hos ${partner.name}`}>
            Se aktuella abonnemang <ArrowUpRight size={17}/>
          </a>
        </article>)}
      </div>
      <p className={styles.disclosure}>Partnerlänkar: vi kan få provision om du blir kund, utan extra kostnad för dig. Urvalet omfattar inte hela marknaden. Ordningen är alfabetisk och baseras inte på pris eller provision.</p>
    </section>

    <div className={styles.knowledge}>
      <Wifi size={20}/>
      <div><strong>Kontrollera nätet där du använder mobilen.</strong><p>Billigare abonnemang hjälper inte om täckningen inte fungerar hemma, på arbetet eller på resan.</p></div>
      <Link href='/mobil/5g-abonnemang/' onClick={()=>pathClick('network_guide')}>Om mobilnät och 5G <ArrowRight size={16}/></Link>
    </div>
  </div>;
}
