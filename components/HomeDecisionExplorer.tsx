import { useState } from 'react';
import { ArrowRight, Compass, Scale, SlidersHorizontal, Wallet, type LucideIcon } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/HomeDecisionExplorer.module.css';

type GoalKey = 'prioritera' | 'valja' | 'jamfora' | 'hushall';
type Goal = {
  key: GoalKey;
  label: string;
  Icon: LucideIcon;
  title: string;
  description: string;
  links: Array<{ label: string; href: string }>;
  note: string;
};

const goals: Goal[] = [
  {
    key: 'prioritera', label: 'Var ska jag börja?', Icon: Compass,
    title: 'Få en första startpunkt.',
    description: 'Osäker på vilka avtal som är värda att kontrollera? Börja med en fråga – utan att veta dina priser.',
    links: [
      { label: 'Starta Kostnadskollen', href: '/app/' },
      { label: 'Se en enkel årskoll', href: '/guide/arskoll-fasta-kostnader/' },
    ],
    note: 'Vägledningen är preliminär. Vi kontrollerar inte dina personliga avtal eller lovar en besparing.',
  },
  {
    key: 'valja', label: 'Hitta rätt nivå', Icon: SlidersHorizontal,
    title: 'Välj rätt nivå innan du jämför pris.',
    description: 'Få hjälp på tre korta frågor. Välj det snabbtest som passar ditt behov.',
    links: [
      { label: 'Bredband: vilken hastighet?', href: '/bredband/vilken-hastighet-behover-jag/' },
      { label: 'Mobil: hur mycket surf?', href: '/mobil/hur-mycket-surf-behover-jag/' },
      { label: 'El: vilken avtalsform?', href: '/elavtal/vilket-elavtal-passar-mig/' },
      { label: 'Hemförsäkring: vilket skydd?', href: '/forsakring/hemforsakring-skyddskoll/' },
    ],
    note: 'Testerna hjälper dig resonera. Aktuella priser, täckning och villkor kontrolleras hos leverantören.',
  },
  {
    key: 'jamfora', label: 'Jämför två erbjudanden', Icon: Scale,
    title: 'Se vad erbjudandena faktiskt kostar.',
    description: 'Har du fått två erbjudanden? Jämför den kostnad du känner till. Kampanjer och extra avgifter kan läggas till när det behövs.',
    links: [
      { label: 'Jämför två elavtal', href: '/verktyg/elavtalskostnad/' },
      { label: 'Jämför bredband första året', href: '/verktyg/forstaarskostnad-bredband/' },
      { label: 'Jämför mobil första året', href: '/verktyg/forstaarskostnad/' },
    ],
    note: 'Jämförelsen bygger på uppgifterna du fyller i, inte på livehämtade erbjudanden.',
  },
  {
    key: 'hushall', label: 'Se hela hushållet', Icon: Wallet,
    title: 'Få koll på kostnaderna du känner till.',
    description: 'Börja med en eller två räkningar. Du kan lägga till fler senare – vi gissar inte resten av hushållets kostnader.',
    links: [
      { label: 'Räkna på hushållets kostnader', href: '/verktyg/hushallskostnadskollen/' },
      { label: 'Läs om fasta kostnader', href: '/guide/hushallets-fasta-kostnader-2026/' },
    ],
    note: 'Det är bara ifyllda belopp som summeras. Inget automatiskt besparingslöfte.',
  },
];

export default function HomeDecisionExplorer() {
  // Show a useful group of existing three-question tools immediately; the
  // visitor need not make two selections to reach those SEO-relevant routes.
  const [selected, setSelected] = useState<GoalKey>('valja');
  const active = goals.find(goal => goal.key === selected)!;

  function chooseGoal(key: GoalKey) {
    setSelected(key);
    emitAnalyticsEvent('home_explorer_goal_selected', { goal: key });
  }

  return (
    <div className={styles.root} data-testid='home-decision-explorer'>
      <div className={styles.question}>
        <p className={styles.questionLabel}>Vad vill du få hjälp med?</p>
        <div className={styles.options} role='group' aria-label='Välj typ av hjälp'>
          {goals.map(({ key, label, Icon }) => (
            <button
              key={key}
              type='button'
              aria-pressed={selected === key}
              aria-controls='home-explorer-panel'
              className={[styles.option, selected === key ? styles.selected : ''].join(' ')}
              onClick={() => chooseGoal(key)}
            >
              <Icon size={23} aria-hidden='true' />
              <span>{label}</span>
              <span className={styles.dot} aria-hidden='true' />
            </button>
          ))}
        </div>
        <p className={styles.unknown}>Välj fritt. Du kan byta väg när du vill.</p>
      </div>

      <div id='home-explorer-panel' className={styles.panel} aria-live='polite' aria-atomic='true' data-testid='home-explorer-panel'>
        <div className={styles.panelTop}>
          <span className={styles.kicker}>SNABB VÄG VIDARE</span>
          <span className={styles.step}>Inga uppgifter krävs för att börja</span>
        </div>
        <div className={styles.panelBody}>
          <span className={styles.panelIcon} aria-hidden='true'><active.Icon size={26} /></span>
          <h3>{active.title}</h3>
          <p>{active.description}</p>
        </div>
        <div className={[styles.actions, active.links.length > 2 ? styles.multi : ''].join(' ')}>
          {active.links.map((link, index) => (
            <a
              key={link.href}
              className={active.links.length <= 2 && index === 0 ? styles.primary : styles.secondary}
              href={link.href}
              onClick={() => emitAnalyticsEvent('home_explorer_continue', { goal: active.key, destination: index })}
            >
              {link.label} <ArrowRight size={18} aria-hidden='true' />
            </a>
          ))}
        </div>
        <p className={styles.caution}>{active.note}</p>
      </div>
    </div>
  );
}
