import { ArrowRight, Check, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import styles from '../styles/HomeHero.module.css';
import HomeDecisionExplorer from './HomeDecisionExplorer';

const familyPhoto='https://images.pexels.com/photos/4874926/pexels-photo-4874926.jpeg?auto=compress&cs=tinysrgb&fit=crop';

/**
 * Owner direction P0H: the product must feel like a real household,
 * not a cold software dashboard. Human photograph is illustrative,
 * not a claim of endorsement, saving or conversion.
 */
export default function HomeHero(){
 return <section className={styles.shell} aria-label='Hitta rätt jämförelse'>
  <div className={styles.inner}>
   <div className={styles.copy}>
    <p className={styles.eyebrow}><Sparkles size={18}/> FÖR LIVET HEMMA</p>
    <h1>Sänk dina fasta kostnader.<em> Ge mer plats åt livet.</em></h1>
    <p className={styles.lead}>Bredband, el, mobil och försäkringar – det mesta rullar på av gammal vana. Vi hjälper dig se vad som är värt att jämföra, utan krångliga formulär.</p>
    <div className={styles.actions}>
     <a href='/app/' className={styles.primary}>
      <span><strong>Starta Kostnadskollen</strong><small>Få en enkel väg att börja</small></span>
      <ArrowRight size={22} aria-hidden='true'/>
     </a>
     <a href='/#jamfor' className={styles.secondary}>Välj en kostnad direkt <ArrowRight size={17} aria-hidden='true'/></a>
    </div>
    <div className={styles.trust}>
     <span><Check size={16}/> Gratis</span>
     <span><Check size={16}/> Utan inloggning</span>
     <span><ShieldCheck size={16}/> Tydligt märkta partnerlänkar</span>
    </div>
   </div>
   <div className={styles.photo} aria-hidden='true'>
     <img src={familyPhoto+'&w=1600'} srcSet={familyPhoto+'&w=900 900w, '+familyPhoto+'&w=1600 1600w, '+familyPhoto+'&w=2200 2200w'}
       sizes='(max-width:850px) 100vw, 68vw' loading='eager' decoding='async' alt=''/>
     <div className={styles.photoShade}/>
   </div>
  </div>
  <div className={styles.nextPrompt}><ChevronDown size={17}/> ETT ENKLARE SÄTT ATT KOMMA IGÅNG</div>
  <div className={styles.stage} id='startval'>
    <div className={styles.stageTop}><span className={styles.onlineDot}/> VÄLJ DITT NÄSTA STEG <span className={styles.stageTime}>TAR BARA NÅGRA KLICK</span></div>
    <HomeDecisionExplorer heroMode/>
  </div>
 </section>;
}
