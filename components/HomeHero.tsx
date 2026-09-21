import { CircleDollarSign, Grid2X2, Info, Lock, ShieldCheck, Smartphone, TrendingDown, Wifi, Zap } from 'lucide-react';
import styles from '../styles/HomeHero.module.css';

const links = [
  { key: 'bredband', label: 'Bredband', href: '/bredband/bredband-pa-min-adress/' },
  { key: 'el', label: 'El', href: '/elavtal/jamfor-elavtal/' },
  { key: 'mobil', label: 'Mobil', href: '/mobil/billigaste-mobilabonnemanget/' },
  { key: 'forsakring', label: 'Försäkring', href: '/forsakring/jamfor-forsakring/' },
  { key: 'ekonomi', label: 'Lån & ekonomi', href: '/ekonomi/' },
];

const mobileLinks = [
  { icon: Wifi, label: 'Bredband', href: '/bredband/bredband-pa-min-adress/' },
  { icon: Zap, label: 'El', href: '/elavtal/jamfor-elavtal/' },
  { icon: Smartphone, label: 'Mobil', href: '/mobil/billigaste-mobilabonnemanget/' },
  { icon: ShieldCheck, label: 'Försäkring', href: '/forsakring/jamfor-forsakring/' },
  { icon: CircleDollarSign, label: 'Lån & ekonomi', href: '/ekonomi/' },
];

export default function HomeHero() {
  return (
    <section className={styles.shell} aria-label='Hitta rätt jämförelse'>
      <div className={styles.desktopStage}>
        <div className={styles.desktopArt}>
          <img src='/design/hero-exact.webp' alt='' fetchPriority='high' decoding='async' />
          <div className={styles.semantic}>
            <h1>Sänk din månadskostnad. Inte din vardag.</h1>
            <p>Bredband, el, mobil, försäkring och lån. Två snabba val leder dig till rätt jämförelse.</p>
          </div>
          {links.map((item, index) => (
            <a
              key={item.key}
              className={styles.hotspot}
              style={{ top: `${21.3 + index * 9.05}%` }}
              href={item.href}
              aria-label={`Jämför ${item.label}`}
            />
          ))}
          <a className={styles.ctaHotspot} href='#jamfor' aria-label='Visa rätt jämförelse' />
        </div>
      </div>

      <div className={styles.mobileHero}>
        <div className={styles.mobileShade} />
        <div className={styles.mobileCopy}>
          <span>Gratis · ingen inloggning · tydliga partnerlänkar</span>
          <h1>Sänk din månadskostnad.<em>Inte din vardag.</em></h1>
          <p>Bredband, el, mobil, försäkring och lån. Välj vad du vill betala mindre för.</p>
        </div>
        <div className={styles.mobileCard}>
          <small>1 av 2</small>
          <h2>Vad vill du betala mindre för?</h2>
          <div>
            {mobileLinks.map(({ icon: Icon, label, href }) => (
              <a href={href} key={label}><Icon size={20}/><strong>{label}</strong><b>→</b></a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.proof}>
        <div className={styles.proofInner}>
          <div><span><Grid2X2 size={21}/></span><p><strong>5 kostnadsområden</strong><small>Allt på ett ställe</small></p></div>
          <div><span><TrendingDown size={21}/></span><p><strong>2 val till rätt väg</strong><small>Snabbt och enkelt</small></p></div>
          <div><span><Lock size={21}/></span><p><strong>Ingen inloggning</strong><small>Helt kostnadsfritt</small></p></div>
          <div><span><Info size={21}/></span><p><strong>Tydlig affiliateinformation</strong><small>Kommersiella länkar märks tydligt</small></p></div>
        </div>
      </div>
    </section>
  );
}
