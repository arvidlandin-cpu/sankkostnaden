import Link from 'next/link';
import { ArrowDown, ArrowRight, ShieldCheck } from 'lucide-react';
import type { PartnerCategory } from '../lib/partners';
import styles from '../styles/EditorialGuide.module.css';

type Props = {
  category: PartnerCategory;
  categoryLabel: string;
  categoryPath: string;
  kicker: string;
  title: string;
  description: string;
  hasPartnerOutput: boolean;
};

/**
 * A single photographic/editorial masthead for factual category guides.
 * All copy, CTAs, and breadcrumbs remain genuine crawlable accessible HTML.
 * Photographs illustrate everyday contexts, not customers or partners.
 */
const photoIds:Record<PartnerCategory,string>={
  bredband:'4260743',
  el:'8055828',
  mobil:'4254149',
  forsakring:'27177239',
  ekonomi:'6964105',
};

export default function EditorialGuideHero({category,categoryLabel,categoryPath,kicker,title,description,hasPartnerOutput}:Props){
  const id=photoIds[category];
  const base=['https://images.pexels.com/photos',id,'pexels-photo-'+id+'.jpeg'].join('/')+'?auto=compress&cs=tinysrgb&fit=crop';
  return <section className={styles.hero} data-testid='editorial-guide-hero' aria-label='Introduktion till guiden'>
    <div className={styles.photo} aria-hidden='true'>
      <img src={base+'&w=1600'}
        srcSet={base+'&w=700 700w, '+base+'&w=1200 1200w, '+base+'&w=1600 1600w, '+base+'&w=2400 2400w'}
        sizes='(max-width:760px) 100vw, 65vw'
        alt='' loading='eager' decoding='async' fetchPriority='high'
        data-testid={'editorial-guide-image-'+category}/>
    </div>
    <div className={styles.scrim} aria-hidden='true'/>
    <div className={styles.heroInner}>
      <div className={styles.copy}>
        <nav className={styles.breadcrumbs} aria-label='Brödsmulor'>
          <Link href='/'>Start</Link><span aria-hidden='true'>›</span><Link href={categoryPath}>{categoryLabel}</Link><span aria-hidden='true'>›</span><span aria-current='page'>{kicker}</span>
        </nav>
        <p className={styles.kicker}>{kicker}</p>
        <h1>{title}</h1>
        <p className={styles.lead}>{description}</p>
        <div className={styles.actions}>
          {hasPartnerOutput && <a href='#guide-partners' className={styles.primary}>Se jämförelsealternativ <ArrowRight size={19} aria-hidden='true'/></a>}
          <a href='#guide-summary' className={hasPartnerOutput?styles.readMore:styles.primary}>Börja med råden <ArrowDown size={18} aria-hidden='true'/></a>
        </div>
        <p className={styles.trust}><ShieldCheck size={16} aria-hidden='true'/> Gratis vägledning. Kommersiella länkar märks tydligt.</p>
      </div>
    </div>
  </section>;
}
