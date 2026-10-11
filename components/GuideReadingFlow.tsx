import { ArrowUpRight, Check, ChevronDown, Lightbulb, ListChecks } from 'lucide-react';
import styles from '../styles/GuideReadingFlow.module.css';

type Part={heading:string;body:string};
type Props={bullets:string[];sections:Part[]};

/**
 * Turns the same SEO-valuable factual guide body into an approachable
 * progressive product reading surface. SSR retains every original sentence,
 * with native accessible details for optional depth.
 */
export default function GuideReadingFlow({bullets,sections}:Props){
 return <div className={styles.root} data-testid='guide-reading-flow'>
  <section className={styles.overview} aria-label='Det viktigaste i korthet'>
   <div className={styles.overviewHeading}>
    <span className={styles.icon}><ListChecks size={23}/></span>
    <div><p className={styles.eyebrow}>BÖRJA HÄR · SNABB ÖVERBLICK</p><h2>Det viktigaste på en minut</h2></div>
   </div>
   <div className={styles.takeaways+' checkList'} data-testid='guide-key-takeaways'>
    {bullets.map((item,index)=><div key={item} className={styles.takeaway}>
      <span className={styles.number}>{String(index+1).padStart(2,'0')}</span>
      <Check size={17} aria-hidden='true'/>
      <p>{item}</p>
    </div>)}
   </div>
  </section>
  <section className={styles.deepDive} aria-label='Läs mer om det du undrar'>
   <div className={styles.deepHeading}>
    <div><p className={styles.eyebrow}>FÖR DIG SOM VILL FÖRDJUPA DIG</p><h2>Få svar, steg för steg</h2><p>Välj bara den fråga du undrar över. Du behöver inte läsa hela guiden.</p></div>
    <span className={styles.hint}><Lightbulb size={17}/> Fäll ut det som är relevant</span>
   </div>
   <div className={styles.questions}>
    {sections.map((section,index)=><details key={section.heading} open={index===0} className={styles.question}>
      <summary>
       <span className={styles.index}>{String(index+1).padStart(2,'0')}</span>
       <h3>{section.heading}</h3>
       <span className={styles.chevron}><ChevronDown size={19} aria-hidden='true'/></span>
      </summary>
      <div className={styles.answer}><p>{section.body}</p><span><ArrowUpRight size={15}/> Kontrollera alltid de faktiska villkoren innan du bestämmer dig.</span></div>
    </details>)}
   </div>
  </section>
 </div>;
}
