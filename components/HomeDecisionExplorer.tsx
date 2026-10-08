import { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, Smartphone, Wifi, Zap, type LucideIcon } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/HomeDecisionExplorer.module.css';

type AreaKey = 'bredband' | 'el' | 'mobil' | 'forsakring';
type Area = {
  key: AreaKey;
  label: string;
  Icon: LucideIcon;
  title: string;
  description: string;
  directHref: string;
  directLabel: string;
  testHref: string;
  testLabel: string;
  caution: string;
};

const areas: Area[] = [
  {
    key: 'bredband', label: 'Bredband', Icon: Wifi,
    title: 'Börja med adress och hastighet.',
    description: 'Utbudet beror på din adress. Är du osäker på hastigheten kan du ta ett kort test först.',
    directHref: '/bredband/', directLabel: 'Se bredbandsalternativ',
    testHref: '/bredband/vilken-hastighet-behover-jag/', testLabel: 'Hitta rätt hastighet',
    caution: 'Tillgänglighet och aktuellt pris kontrolleras hos jämförelsetjänsten eller leverantören.',
  },
  {
    key: 'el', label: 'El', Icon: Zap,
    title: 'Börja med rätt sorts elavtal.',
    description: 'Jämför avtalsform och avgifter. Du behöver inte kunna din exakta årsförbrukning för att börja.',
    directHref: '/elavtal/', directLabel: 'Se elavtalsalternativ',
    testHref: '/elavtal/vilket-elavtal-passar-mig/', testLabel: 'Hitta rätt avtalsform',
    caution: 'Vi visar inte personliga elpriser eller en garanterat billigaste leverantör.',
  },
  {
    key: 'mobil', label: 'Mobil', Icon: Smartphone,
    title: 'Börja med surf och täckning.',
    description: 'Det dyraste abonnemanget är inte alltid bäst. Hitta en lämplig nivå och jämför sedan alternativ.',
    directHref: '/mobil/', directLabel: 'Se mobilalternativ',
    testHref: '/mobil/hur-mycket-surf-behover-jag/', testLabel: 'Hitta rätt surfmängd',
    caution: 'Kontrollera täckning, kampanjvillkor och ordinarie pris hos operatören.',
  },
  {
    key: 'forsakring', label: 'Försäkring', Icon: ShieldCheck,
    title: 'Börja med vad försäkringen skyddar.',
    description: 'Välj rätt skydd innan du tittar på pris. Jämför också självrisk och viktiga undantag.',
    directHref: '/forsakring/', directLabel: 'Se försäkringsalternativ',
    testHref: '/forsakring/hemforsakring-skyddskoll/', testLabel: 'Kontrollera hemskyddet',
    caution: 'Försäkringsvillkor och pris beror på din situation och behöver kontrolleras hos bolaget.',
  },
];

export default function HomeDecisionExplorer() {
  const [selected, setSelected] = useState<AreaKey | null>(null);
  const active = areas.find(area => area.key === selected);

  function chooseArea(key: AreaKey) {
    setSelected(key);
    emitAnalyticsEvent('home_explorer_area_selected', { category: key });
  }

  return (
    <div className={styles.root} data-testid='home-decision-explorer'>
      <div className={styles.question}>
        <p className={styles.questionLabel}>Välj det som känns mest aktuellt</p>
        <div className={styles.options} role='group' aria-label='Välj kostnadsområde'>
          {areas.map(({ key, label, Icon }) => (
            <button
              key={key}
              type='button'
              aria-pressed={selected === key}
              aria-controls='home-explorer-panel'
              className={[styles.option, selected === key ? styles.selected : ''].join(' ')}
              onClick={() => chooseArea(key)}
            >
              <Icon size={23} aria-hidden='true' />
              <span>{label}</span>
              <span className={styles.dot} aria-hidden='true' />
            </button>
          ))}
        </div>
        <p className={styles.unknown}>Vet du inte? <a href='/app/'>Låt Kostnadskollen hjälpa dig <ArrowRight size={15} /></a></p>
      </div>

      <div id='home-explorer-panel' className={styles.panel} aria-live='polite' aria-atomic='true' data-testid='home-explorer-panel'>
        <div className={styles.panelTop}>
          <span className={styles.kicker}>{active ? 'DIN VALDA VÄG' : 'BÖRJA ENKELT'}</span>
          <span className={styles.step}>{active ? 'Välj nästa steg' : 'Inga uppgifter behövs'}</span>
        </div>
        <div className={styles.panelBody}>
          <span className={styles.panelIcon} aria-hidden='true'>{active ? <active.Icon size={26} /> : <Compass size={27} />}</span>
          <h3>{active ? active.title : 'Osäker på vilken kostnad du ska ta först?'}</h3>
          <p>{active ? active.description : 'Du behöver inte veta vad dina avtal kostar. Börja med Kostnadskollen eller välj ett område till vänster.'}</p>
        </div>
        <div className={styles.actions}>
          {active ? (
            <>
              <a
                className={styles.primary}
                href={active.directHref}
                onClick={() => emitAnalyticsEvent('home_explorer_continue', { category: active.key, path: 'compare' })}
              >
                {active.directLabel} <ArrowRight size={18} />
              </a>
              <a
                className={styles.secondary}
                href={active.testHref}
                onClick={() => emitAnalyticsEvent('home_explorer_continue', { category: active.key, path: 'test' })}
              >
                {active.testLabel} <ArrowRight size={17} />
              </a>
            </>
          ) : (
            <a className={styles.primary} href='/app/'>Starta Kostnadskollen <ArrowRight size={18} /></a>
          )}
        </div>
        <p className={styles.caution}>{active ? active.caution : 'Gratis att använda. Inga prisuppgifter eller inloggning krävs för att börja.'}</p>
      </div>

      <nav className={styles.testLinks} aria-label='Alla våra snabbtester'>
        <span>Fler snabbtester:</span>
        {areas.map(area => (
          <a key={area.key} href={area.testHref}>{area.label}<ArrowRight size={14} /></a>
        ))}
      </nav>
    </div>
  );
}
