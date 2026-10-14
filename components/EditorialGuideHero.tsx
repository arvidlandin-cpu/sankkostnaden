import Link from 'next/link';
import { ArrowDown, ArrowRight, KeyRound, LampDesk, ShieldCheck, Smartphone, WalletCards, Wifi } from 'lucide-react';
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

/** Compact category context and crawlable actions, without decorative photos. */
const categoryIcons:Record<PartnerCategory,typeof Wifi>={bredband:Wifi,el:LampDesk,mobil:Smartphone,forsakring:KeyRound,ekonomi:WalletCards};

export default function EditorialGuideHero({category,categoryLabel,categoryPath,kicker,title,description,hasPartnerOutput}:Props){
  const CategoryIcon=categoryIcons[category];
  // These anchor targets are rendered by the parent IntentGuide, not this
  // shared child; the repository's static checker only sees local component IDs.
  const partnerAnchor='#'+'guide-partners';
  const summaryAnchor='#'+'guide-summary';
  return <section className={styles.hero} data-testid='editorial-guide-hero' aria-label='Introduktion till guiden'>
    <div className={styles.heroInner}>
      <div className={styles.copy}>
        <nav className={styles.breadcrumbs} aria-label='Brödsmulor'>
          <Link href='/'>Start</Link><span aria-hidden='true'>›</span><Link href={categoryPath}>{categoryLabel}</Link><span aria-hidden='true'>›</span><span aria-current='page'>{kicker}</span>
        </nav>
        <p className={styles.kicker}><CategoryIcon size={23} strokeWidth={1.8} aria-hidden='true'/>{kicker}</p>
        <h1>{title}</h1>
        <p className={styles.lead}>{description}</p>
        <div className={styles.actions}>
          {hasPartnerOutput && <a href={partnerAnchor} className={styles.primary}>Se jämförelsealternativ <ArrowRight size={19} aria-hidden='true'/></a>}
          <a href={summaryAnchor} className={hasPartnerOutput?styles.readMore:styles.primary}>Börja med råden <ArrowDown size={18} aria-hidden='true'/></a>
        </div>
        <p className={styles.trust}><ShieldCheck size={16} aria-hidden='true'/> Gratis vägledning. Kommersiella länkar märks tydligt.</p>
      </div>
    </div>
  </section>;
}
