import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Check, CircleCheckBig, ListChecks} from 'lucide-react';
import styles from '../styles/InteractiveChecklist.module.css';

export type ChecklistItem=string|{title:string;text:string};
type Props={items:ChecklistItem[];title:string;description?:string;nextHref?:string;nextLabel?:string};

/**
 * Check off work as you go, no account, stored identity, or fake savings claim.
 * Every item and its full original text is server-rendered for crawlability.
 */
export default function InteractiveChecklist({items,title,description,nextHref,nextLabel}:Props){
 const [checked,setChecked]=useState<number[]>([]);
 const count=checked.length;
 const percent=items.length>0?Math.round(count/items.length*100):0;
 const toggle=(i:number)=>setChecked(curr=>curr.includes(i)?curr.filter(x=>x!==i):[...curr,i]);
 return <section className={styles.root} aria-label={title} data-testid='interactive-checklist'>
  <div className={styles.top}>
   <span className={styles.icon}><ListChecks size={22}/></span>
   <div><p className={styles.label}>DIN CHECKLISTA</p><h2>{title}</h2>{description&&<p className={styles.description}>{description}</p>}</div>
  </div>
  <div className={styles.progressText}><span><strong>{count}</strong> av {items.length} kontroller avklarade</span><span>{percent}%</span></div>
  <div className={styles.bar} role='progressbar' aria-label='Avklarade kontroller' aria-valuemin={0} aria-valuemax={items.length} aria-valuenow={count}><span style={{width:percent+'%'}}/></div>
  <div className={styles.items} role='group' aria-label='Markera det du har kontrollerat'>
   {items.map((item,i)=>{
    const active=checked.includes(i);
    const titleText=typeof item==='string'?item:item.title;
    const detail=typeof item==='string'?null:item.text;
    return <button type='button' key={i} className={[styles.item,active?styles.complete:''].join(' ')}
      aria-pressed={active} onClick={()=>toggle(i)}>
      <span className={styles.tick} aria-hidden='true'>{active?<Check size={19}/>:String(i+1).padStart(2,'0')}</span>
      <span className={styles.itemText}><strong>{titleText}</strong>{detail&&<small>{detail}</small>}</span>
      <span className={styles.state} aria-hidden='true'>{active?'Klart':'Markera klar'}</span>
    </button>;
   })}
  </div>
  <div className={styles.bottom}>
   {count===items.length?<span className={styles.done}><CircleCheckBig size={20}/> Du har gått igenom alla punkter. Jämför relevanta avtal i din egen takt.</span>:<span>Du kan byta ordning, markera flera eller fortsätta direkt. Inga val sparas efter besöket.</span>}
   {nextHref&&<Link className={styles.next} href={nextHref}>{nextLabel||'Nästa steg'}<ArrowRight size={18}/></Link>}
  </div>
 </section>;
}
