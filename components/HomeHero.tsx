import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CircleDollarSign,
  Grid2X2,
  Info,
  Lock,
  ShieldCheck,
  Smartphone,
  TrendingDown,
  Wifi,
  Zap,
} from 'lucide-react';
import styles from '../styles/HomeHero.module.css';

type Choice = {
  label: string;
  helper: string;
  href: string;
};

type CategoryKey = 'bredband' | 'el' | 'mobil' | 'forsakring' | 'ekonomi';

const categories: Record<CategoryKey, {
  label: string;
  icon: typeof Wifi;
  choices: Choice[];
}> = {
  bredband: {
    label: 'Bredband',
    icon: Wifi,
    choices: [
      { label: 'Lägre pris', helper: 'Jämför verklig årskostnad', href: '/bredband/billigaste-bredbandet/' },
      { label: 'Rätt hastighet', helper: 'Betala inte för mer fart än du behöver', href: '/bredband/vilken-hastighet-behover-jag/' },
      { label: 'Ingen bindningstid', helper: 'Jämför flexibla alternativ', href: '/bredband/utan-bindningstid/' },
    ],
  },
  el: {
    label: 'El',
    icon: Zap,
    choices: [
      { label: 'Lägre kostnad', helper: 'Jämför pris, påslag och avgifter', href: '/elavtal/billigaste-elavtalet/' },
      { label: 'Rätt avtalsform', helper: 'Fast, rörligt eller kvartspris', href: '/elavtal/vilket-elavtal-passar-mig/' },
      { label: 'Byta elavtal', helper: 'Se vad du bör kontrollera före bytet', href: '/elavtal/byta-elavtal/' },
    ],
  },
  mobil: {
    label: 'Mobil',
    icon: Smartphone,
    choices: [
      { label: 'Lägre pris', helper: 'Jämför verklig förstaårskostnad', href: '/mobil/billigaste-mobilabonnemanget/' },
      { label: 'Rätt mängd surf', helper: 'Matcha abonnemanget mot din användning', href: '/mobil/hur-mycket-surf-behover-jag/' },
      { label: 'Ingen bindningstid', helper: 'Jämför flexibla mobilabonnemang', href: '/mobil/utan-bindningstid/' },
    ],
  },
  forsakring: {
    label: 'Försäkring',
    icon: ShieldCheck,
    choices: [
      { label: 'Jämför hemförsäkring', helper: 'Pris, självrisk och omfattning', href: '/forsakring/jamfor-hemforsakring/' },
      { label: 'Kontrollera rätt skydd', helper: 'Se vilka villkor som är viktiga för dig', href: '/forsakring/hemforsakring-skyddskoll/' },
      { label: 'Djurförsäkring', helper: 'Jämför skydd och kostnad för ditt djur', href: '/forsakring/djurforsakring/' },
    ],
  },
  ekonomi: {
    label: 'Lån & ekonomi',
    icon: CircleDollarSign,
    choices: [
      { label: 'Sänk lånekostnaden', helper: 'Jämför effektiv ränta och total kostnad', href: '/ekonomi/' },
      { label: 'Samla lån', helper: 'Se när en samlad lösning kan vara relevant', href: '/ekonomi/' },
      { label: 'Förstå totalpriset', helper: 'Ränta, avgifter och återbetalningstid', href: '/ekonomi/' },
    ],
  },
};

const categoryOrder: CategoryKey[] = ['bredband', 'el', 'mobil', 'forsakring', 'ekonomi'];

export default function HomeHero() {
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);

  const selectedCategory = category ? categories[category] : null;
  const selectedChoice = useMemo(
    () => selectedCategory && choiceIndex !== null ? selectedCategory.choices[choiceIndex] : null,
    [selectedCategory, choiceIndex],
  );

  const chooseCategory = (key: CategoryKey) => {
    setCategory(key);
    setChoiceIndex(null);
  };

  const goBack = () => {
    setCategory(null);
    setChoiceIndex(null);
  };

  return (
    <section className={styles.shell} aria-label='Hitta rätt jämförelse'>
      <div className={styles.media} aria-hidden='true'>
        <img
          src='https://images.pexels.com/photos/4545768/pexels-photo-4545768.jpeg?auto=compress&cs=tinysrgb&w=2200'
          alt=''
          loading='eager'
          fetchPriority='high'
          decoding='async'
        />
      </div>
      <div className={styles.shade} />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.badge}><span /> Gratis · ingen inloggning · tydliga partnerlänkar</div>
          <h1>Sänk din<br />månadskostnad.<br /><em>Inte din vardag.</em></h1>
          <p>Bredband, el, mobil, försäkring och lån.<br />Två snabba val leder dig till rätt jämförelse.</p>
          <div className={styles.copyTrust}>
            <span>Hundratals leverantörer</span>
            <span>Opartiska guider</span>
            <span>Alltid kostnadsfritt</span>
          </div>
        </div>

        <div className={styles.heroNote}>Mer pengar<br/>till det som<br/>är viktigt <b>↙</b></div>

        <div className={styles.selector}>
          <div className={styles.progressRow}>
            <div className={styles.progressTrack}><span className={category ? styles.progressDone : ''} /></div>
            <small>{category ? '2 av 2' : '1 av 2'}</small>
          </div>

          {!category ? (
            <>
              <h2>Vad vill du betala mindre för?</h2>
              <div className={styles.options}>
                {categoryOrder.map((key) => {
                  const item = categories[key];
                  const Icon = item.icon;
                  return (
                    <button key={key} type='button' onClick={() => chooseCategory(key)}>
                      <span className={styles.optionIcon}><Icon size={22} /></span>
                      <span className={styles.optionText}><strong>{item.label}</strong></span>
                      <ArrowRight size={18} />
                    </button>
                  );
                })}
              </div>
              <div className={styles.ctaDisabled}>Välj ett område först <ArrowRight size={18} /></div>
            </>
          ) : (
            <>
              <button className={styles.back} type='button' onClick={goBack}><ArrowLeft size={15} /> Byt område</button>
              <div className={styles.selectedLabel}>
                {(() => {
                  const Icon = selectedCategory!.icon;
                  return <Icon size={19} />;
                })()}
                <span>{selectedCategory!.label}</span>
              </div>
              <h2>Vad är viktigast för dig?</h2>
              <div className={styles.options}>
                {selectedCategory!.choices.map((item, index) => (
                  <button
                    key={item.label}
                    type='button'
                    className={choiceIndex === index ? styles.selectedOption : ''}
                    onClick={() => setChoiceIndex(index)}
                  >
                    <span className={styles.radio}><i /></span>
                    <span className={styles.optionText}><strong>{item.label}</strong><small>{item.helper}</small></span>
                    <ArrowRight size={18} />
                  </button>
                ))}
              </div>
              {selectedChoice ? (
                <a className={styles.cta} href={selectedChoice.href}>Visa rätt jämförelse <ArrowRight size={18} /></a>
              ) : (
                <div className={styles.ctaDisabled}>Välj vad som är viktigast <ArrowRight size={18} /></div>
              )}
            </>
          )}

          <p className={styles.disclosure}>Kommersiella länkar märks tydligt. Alla aktörer på marknaden behöver inte finnas med.</p>
        </div>
      </div>

      <div className={styles.proof}>
        <div><span><Grid2X2 size={20} /></span><p><strong>5 kostnadsområden</strong><small>Allt på ett ställe</small></p></div>
        <div><span><TrendingDown size={20} /></span><p><strong>2 val till rätt väg</strong><small>Snabbt och enkelt</small></p></div>
        <div><span><Lock size={20} /></span><p><strong>Ingen inloggning</strong><small>Helt kostnadsfritt</small></p></div>
        <div><span><Info size={20} /></span><p><strong>Tydlig affiliateinformation</strong><small>Kommersiella länkar märks tydligt</small></p></div>
      </div>
    </section>
  );
}
