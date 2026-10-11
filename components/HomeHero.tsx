import { ArrowRight, Check, ShieldCheck, Sparkles } from 'lucide-react';
import styles from '../styles/HomeHero.module.css';
import HomeDecisionExplorer from './HomeDecisionExplorer';

/** Hero as a product entry, not a full-screen image or an article preamble. */
export default function HomeHero(){
 return <section className={styles.shell} aria-label='Hitta rätt jämförelse'>
  <div className={styles.backdrop} aria-hidden='true'><span/><span/><span/></div>
  <div className={styles.inner}>
   <div className={styles.copy}>
    <p className={styles.eyebrow}><Sparkles size={16}/> FÄRRE FRÅGOR. KLARARE BESLUT.</p>
    <h1>Sänk dina fasta kostnader</h1>
    <p className={styles.lead}>Välj det du vill få hjälp med. Ett klick räcker för att hitta rätt väg – inga räkningar eller inloggning krävs.</p>
    <div className={styles.actions}>
     <a href='/app/' className={styles.primary}>
      <span><strong>Starta Kostnadskollen</strong><small>Få en startpunkt med en enkel fråga</small></span>
      <ArrowRight size={21} aria-hidden='true'/>
     </a>
     <a href='/#jamfor' className={styles.secondary}>Välj en kostnad direkt <ArrowRight size={17} aria-hidden='true'/></a>
    </div>
    <div className={styles.trust}>
     <span><Check size={16}/> Gratis</span>
     <span><Check size={16}/> Utan inloggning</span>
     <span><ShieldCheck size={16}/> Märkta partnerlänkar</span>
    </div>
    <div className={styles.sequence} aria-hidden='true'>
     <span><b>01</b> Välj vad du vill göra</span>
     <i/>
     <span><b>02</b> Få rätt verktyg</span>
     <i/>
     <span><b>03</b> Jämför på dina villkor</span>
    </div>
   </div>
   <div className={styles.stage}>
    <div className={styles.stageTop}><span className={styles.onlineDot}/> DIN SMARTA START <span className={styles.stageTime}>UTAN KONTO</span></div>
    <HomeDecisionExplorer heroMode/>
   </div>
  </div>
 </section>;
}
