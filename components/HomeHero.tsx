import { ArrowRight, Check, ShieldCheck } from 'lucide-react';
import styles from '../styles/HomeHero.module.css';

/**
 * One primary action and one route to the category list.
 * No repeated category directory: the homepage already has five visible cards
 * below this hero, and a persistent category navigation on small screens.
 */
export default function HomeHero(){
 return <section className={styles.shell} aria-label='Hitta rätt jämförelse'>
  <div className={styles.visual} aria-hidden='true'>
   <img
    src='https://images.pexels.com/photos/5998829/pexels-photo-5998829.jpeg?auto=compress&cs=tinysrgb&w=1600'
    alt='' fetchPriority='high' decoding='async'
   />
  </div>
  <div className={styles.inner}>
   <div className={styles.copy}>
    <p className={styles.eyebrow}>SAMMA VARDAG. LÄGRE UTGIFTER.</p>
    <h1>Sänk dina fasta kostnader</h1>
    <p className={styles.lead}>Hitta ett bättre sätt att jämföra el, bredband, mobil och försäkringar. Börja med det du undrar över – resten hjälper vi dig med.</p>
    <div className={styles.actions}>
     <a href='/app/' className={styles.primary}>
      <span><strong>Starta Kostnadskollen</strong><small>Få en startpunkt med en enkel fråga</small></span>
      <ArrowRight size={21} aria-hidden='true'/>
     </a>
     <a href='/#jamfor' className={styles.secondary}>Välj en kostnad direkt <ArrowRight size={18} aria-hidden='true'/></a>
    </div>
    <div className={styles.trust}>
     <span><Check size={16}/>Gratis att använda</span>
     <span><Check size={16}/>Ingen inloggning</span>
     <span><ShieldCheck size={16}/>Partnerlänkar är märkta</span>
    </div>
   </div>
  </div>
 </section>;
}
