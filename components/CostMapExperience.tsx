import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Compass, KeyRound, LampDesk, Smartphone, SlidersHorizontal, WalletCards, Wifi } from 'lucide-react';
import { getActivePartners, type ActivePartner, type PartnerCategory, type PartnerIntent } from '../lib/partners';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import s from '../styles/CostMapExperience.module.css';

type Choice = { id: string; label: string; intent?: PartnerIntent };
type Track = {
  id: PartnerCategory; name: string; hint: string; title: string; advice: string;
  href: string; guideHref: string; guideText: string; toolHref: string; toolText: string;
  icon: typeof Wifi; choices: Choice[];
};

const tracks: Track[] = [
  { id: 'bredband', name: 'Bredband', hint: 'Utbud för din adress', title: 'Börja med din adress.',
    advice: 'Utbud och pris beror på var du bor. Kontrollera även priset efter kampanjen och eventuell utrustning.',
    href: '/bredband/', guideHref: '/bredband/vilken-hastighet-behover-jag/', guideText: 'Hjälp mig välja hastighet',
    toolHref: '/verktyg/forstaarskostnad-bredband/', toolText: 'Räkna på två erbjudanden', icon: Wifi,
    choices: [{ id: 'all', label: 'Alla alternativ' }, { id: 'fiber', label: 'Fiber', intent: 'fiber' }, { id: 'mobile', label: 'Mobilt / 5G', intent: 'mobile-broadband' }] },
  { id: 'el', name: 'El', hint: 'Avtalsform och avgifter', title: 'Jämför hela elavtalet.',
    advice: 'Använd samma årsförbrukning när du jämför. Påslag och fasta avgifter påverkar kostnaden utöver elpriset.',
    href: '/elavtal/', guideHref: '/elavtal/vilket-elavtal-passar-mig/', guideText: 'Hjälp mig välja avtalsform',
    toolHref: '/verktyg/elavtalskostnad/', toolText: 'Räkna på två elerbjudanden', icon: LampDesk,
    choices: [{ id: 'all', label: 'Alla alternativ' }, { id: 'direct', label: 'Se elbolag', intent: 'electricity' }] },
  { id: 'mobil', name: 'Mobil', hint: 'Surf och täckning', title: 'Välj efter din användning.',
    advice: 'Kontrollera täckningen där du använder mobilen, hur mycket surf du behöver och priset efter kampanjen.',
    href: '/mobil/', guideHref: '/mobil/hur-mycket-surf-behover-jag/', guideText: 'Hur mycket surf behöver jag?',
    toolHref: '/verktyg/forstaarskostnad/', toolText: 'Räkna första årets kostnad', icon: Smartphone,
    choices: [{ id: 'all', label: 'Alla operatörer' }, { id: 'family', label: 'Familj', intent: 'family' }, { id: 'data', label: 'Surf', intent: 'data' }, { id: 'flex', label: 'Utan bindningstid', intent: 'no-binding' }] },
  { id: 'forsakring', name: 'Försäkring', hint: 'Skydd och självrisk', title: 'Börja med rätt skydd.',
    advice: 'Välj vad du vill försäkra. Jämför omfattning, självrisk och undantag tillsammans med premien.',
    href: '/forsakring/', guideHref: '/forsakring/jamfor-forsakring/', guideText: 'Hjälp mig jämföra försäkringar',
    toolHref: '/forsakring/hemforsakring-skyddskoll/', toolText: 'Gör skyddskollen för ditt hem', icon: KeyRound,
    choices: [{ id: 'all', label: 'Alla tjänster' }, { id: 'home', label: 'Hem', intent: 'home' }, { id: 'pet', label: 'Djur', intent: 'pet' }, { id: 'travel', label: 'Resa', intent: 'travel' }, { id: 'income', label: 'Trygghet', intent: 'income-protection' }, { id: 'claims', label: 'Ersättningshjälp', intent: 'claims' }] },
  { id: 'ekonomi', name: 'Lån & ekonomi', hint: 'Överblick och totalkostnad', title: 'Börja med din överblick.',
    advice: 'Gå igenom dina utgifter först. Om du jämför lån: kontrollera effektiv ränta, avgifter och total återbetalning. Längre löptid kan göra lånet dyrare.',
    href: '/ekonomi/', guideHref: '/ekonomi/kostnadskontroll-och-sparande/', guideText: 'Gå igenom mina fasta utgifter',
    toolHref: '/verktyg/hushallskostnadskollen/', toolText: 'Räkna på hushållets kostnader', icon: WalletCards,
    choices: [{ id: 'loan', label: 'Lånejämförelse', intent: 'loan' }] },
];

const comparisonNames = new Set(['Bredbandsval.se', 'Elskling', 'Compricer']);
const isComparison = (partner: ActivePartner) => comparisonNames.has(partner.name) || partner.category === 'ekonomi';

function PartnerLink({ partner, intent, index, placement }: { partner: ActivePartner; intent?: PartnerIntent; index: number; placement: string }) {
  const actualIntent = intent || (partner.intents.includes('compare') ? 'compare' : partner.intents[0]);
  const role = isComparison(partner) ? 'Jämförelsetjänst' : partner.name === 'Insurello' ? 'Hjälp med försäkringsersättning' : 'Direkt hos leverantören';
  const action = partner.name === 'Bredbandsval.se' ? 'Kontrollera din adress hos Bredbandsval.se'
    : partner.name === 'ERGO Försäkring' ? 'Se reseförsäkring hos Europeiska ERV'
      : partner.name === 'Jämförbanker.se' ? 'Till Jämförbanker / Axo Finans'
        : `Se villkor hos ${partner.name}`;
  return <a className={s.partnerLink} href={partner.trackingUrl} target='_blank' rel='sponsored nofollow noopener'
    data-testid='v10-partner-card' data-partner={partner.name} data-category={partner.category}
    data-intent={actualIntent} data-placement={placement} data-partner-position={index + 1}
    onClick={() => emitAnalyticsEvent('v10_partner_selected', { category: partner.category, partner: partner.name, intent: actualIntent, placement })}>
    <span className={s.partnerMeta}>Annons · partnerlänk</span>
    <strong className={s.partnerName}>{partner.name}</strong>
    <span className={s.partnerMeta}>{role}</span>
    <span className={s.partnerNote}>{partner.name === 'Bredbandsval.se' ? 'Utbud och pris kontrolleras för din adress.' : partner.note}</span>
    <span className={s.partnerAction}>{action} <ArrowUpRight size={17} aria-hidden='true' /></span>
    {placement !== 'cost_map_direct' && <span className={s.partnerMeta}>Öppnas hos partnern i en ny flik.</span>}
  </a>;
}

export function CostMapExperience() {
  const [category, setCategory] = useState<PartnerCategory | null>(null);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const categoryButtons = useRef<Partial<Record<PartnerCategory, HTMLButtonElement | null>>>({});
  const track = tracks.find(item => item.id === category);
  const choice = track?.choices[choiceIndex];
  const intentMatches = track ? getActivePartners(track.id, choice?.intent, Infinity) : [];
  const matches = track?.id === 'el' && choice?.id === 'direct' ? intentMatches.filter(partner => !isComparison(partner)) : intentMatches;
  const comparison = matches.filter(isComparison);
  const direct = matches.filter(partner => !isComparison(partner) && partner.name !== 'Insurello').sort((a, b) => a.name.localeCompare(b.name, 'sv'));
  const services = matches.filter(partner => partner.name === 'Insurello');

  useEffect(() => {
    if (!category || !window.matchMedia('(max-width: 760px)').matches) return;
    const frame = window.requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      heading.current?.closest('#cost-map-next-step')?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [category]);

  function select(id: PartnerCategory) {
    setCategory(id);
    setChoiceIndex(0);
    emitAnalyticsEvent('v10_category_selected', { category: id, placement: 'cost_map_home' });
  }

  function back() {
    const previous = category;
    setCategory(null);
    setChoiceIndex(0);
    window.requestAnimationFrame(() => {
      if (previous) categoryButtons.current[previous]?.focus();
    });
  }

  const guideHref = track?.id === 'forsakring' && choice?.intent === 'pet' ? '/forsakring/djurforsakring/'
    : track?.id === 'forsakring' && choice?.intent === 'travel' ? '/forsakring/reseforsakring/'
      : track?.id === 'forsakring' && choice?.intent === 'claims' ? '/forsakring/forsakringsersattning/' : track?.guideHref;
  const guideText = track?.id === 'forsakring' && choice?.intent === 'pet' ? 'Så jämför du djurförsäkring'
    : track?.id === 'forsakring' && choice?.intent === 'travel' ? 'Förstå reseskyddet'
      : track?.id === 'forsakring' && choice?.intent === 'claims' ? 'Förstå försäkringsersättning' : track?.guideText;
  const nonHomeInsurance = track?.id === 'forsakring' && choice?.intent !== 'home' && choice?.intent !== undefined;

  const helpRoutes = track && <div className={s.helpRoutes} data-testid='v11-result-routes' aria-label='Guider och frivilliga verktyg'>
    <Link className={s.helpLink} href={guideHref!} data-testid='v11-route-guide'><Compass size={21} aria-hidden='true' /><span>{guideText}</span><ArrowRight size={17} aria-hidden='true' /></Link>
    <Link className={s.helpLink} href={nonHomeInsurance ? '/verktyg/hushallskostnadskollen/' : track.toolHref} data-testid='v11-route-tool'><SlidersHorizontal size={21} aria-hidden='true' /><span>{nonHomeInsurance ? 'Räkna på hushållets kostnader' : track.toolText}</span><ArrowRight size={17} aria-hidden='true' /></Link>
  </div>;

  function partnerGroup(items: ActivePartner[], title: string, placement: string) {
    const progressive = placement === 'cost_map_direct';
    const renderPartner = (partner: ActivePartner, index: number) => <PartnerLink key={`${category}-${choice?.intent || 'all'}-${partner.name}-${partner.trackingUrl}`} partner={partner} intent={choice?.intent} index={index} placement={placement} />;
    if (progressive && comparison.length > 0 && items.length > 0) return <div className={s.partnerGroup}>
      <details key={`${category}-${choice?.id}`} data-testid='cost-map-more'>
        <summary>Direkt hos leverantörerna ({items.length})</summary>
        <p className={s.partnerMeta}>Alfabetisk ordning. Länkarna öppnas hos leverantören i en ny flik.</p>
        {items.map(renderPartner)}
      </details>
    </div>;
    return items.length > 0 && <div className={s.partnerGroup}>
      <h3>{title}</h3>
      {progressive && <p className={s.partnerMeta}>Alfabetisk ordning. Länkarna öppnas hos leverantören i en ny flik.</p>}
      {(progressive ? items.slice(0, 2) : items).map(renderPartner)}
      {progressive && items.length > 2 && <details key={`${category}-${choice?.id}`} data-testid='cost-map-more'>
        <summary>Fler leverantörer ({items.length - 2})</summary>
        {items.slice(2).map((partner, index) => renderPartner(partner, index + 2))}
      </details>}
    </div>;
  }

  return <section className={s.section} aria-label='Kostnadskartan' data-testid='cost-map-journey' data-selected={Boolean(category)}>
    <div className={s.intro}>
      <h1 className={s.title}><span className={s.eyebrow}>Sänk kostnaden</span>{' '}<span>Ett hem.</span>{' '}<span>Många avtal.</span>{' '}<span>Börja här.</span></h1>
      <p className={s.lead}>Välj ett område. Få vägledning eller gå vidare till en partner.</p>
      <p className={s.eyebrow}>Gratis · Ingen inloggning</p>
    </div>
    <div className={s.workspace}>
      <div className={s.map} data-testid='cost-map-navigation'>
        <img className={s.mapImage} src='/design/cost-map-home.webp' width={1200} height={1200} alt='' fetchPriority='high' decoding='async' />
        <div className={s.categoryList} role='group' aria-label='Välj kostnadsområde'>
          {tracks.map(item => { const Icon = item.icon; return <button className={s.categoryButton} type='button' key={item.id}
            ref={element => { categoryButtons.current[item.id] = element; }} aria-pressed={category === item.id}
            aria-controls='cost-map-next-step' onClick={() => select(item.id)} data-testid={`v10-category-${item.id}`}>
            <Icon className={s.icon} size={26} aria-hidden='true' /><span><strong className={s.categoryName}>{item.name}</strong><small className={s.categoryHint}>{item.hint}</small></span><ArrowRight size={18} aria-hidden='true' />
          </button>; })}
        </div>
      </div>
      <div className={s.panel} id='cost-map-next-step' data-testid='cost-map-panel'>
        {track ? <>
          <button className={s.backButton} type='button' onClick={back} data-testid='cost-map-back'><ArrowLeft size={16} aria-hidden='true' /> Alla områden</button>
          <p className={s.panelEyebrow}>{track.name} / ditt nästa steg</p>
          <h2 className={s.panelTitle} ref={heading} tabIndex={-1} data-testid='cost-map-panel-title'>{track.title}</h2>
          <p className={s.panelLead}>{track.advice}</p>
          {track.id === 'ekonomi' && helpRoutes}
          {track.choices.length > 1 && <div className={s.filters} role='group' aria-label={`Visa alternativ inom ${track.name}`}>
            {track.choices.map((filter, index) => <button className={s.filterButton} type='button' key={filter.id} aria-pressed={index === choiceIndex}
              data-testid={`v10-filter-${filter.id}`} onClick={() => { setChoiceIndex(index); emitAnalyticsEvent('v10_filter_selected', { category: track.id, filter: filter.id }); }}>{filter.label}</button>)}
          </div>}
          {comparison.length > 0 && partnerGroup(comparison, 'Via jämförelsetjänster', 'cost_map_comparison')}
          {track.id !== 'ekonomi' && helpRoutes}
          {partnerGroup(direct, 'Direkt hos leverantörerna', 'cost_map_direct')}
          {partnerGroup(services, 'Hjälp med ersättning', 'cost_map_service')}
          {matches.length === 0 && <p>Inga aktiva partnerlänkar för detta val. Guiderna hjälper dig vidare.</p>}
          <Link className={s.helpLink} href={track.href}>Alla guider inom {track.name.toLowerCase()} <ArrowRight size={16} aria-hidden='true' /></Link>
          <p className={s.disclosure}>Vi kan få ersättning via annonslänkar. Urvalet omfattar våra aktiva partners, inte hela marknaden. Priser och villkor kontrolleras hos partnern.</p>
        </> : <div className={s.initialPanel} data-testid='v11-empty-state'>
          <p className={s.panelEyebrow}>Från överblick till nästa steg</p>
          <h2 className={s.panelTitle}>Vad vill du få bättre koll på?</h2>
          <p className={s.panelLead}>Välj en kostnad i hemmet. Du får en väg till relevant hjälp och tydligt märkta partneralternativ.</p>
          <p className={s.panelLead}>Inga prisuppgifter behövs. Har du egna erbjudanden kan du räkna på dem när du vill.</p>
          <Link className={s.helpLink} href='/verktyg/hushallskostnadskollen/'>Få koll på hushållets kostnader <ArrowRight size={17} aria-hidden='true' /></Link>
        </div>}
      </div>
    </div>
    <div className={s.trustStrip}><span className={s.trustNumber} aria-hidden='true'>01</span><strong className={s.trustTitle}>Jämför mer än månadspriset.</strong>{['Kampanjens längd', 'Ordinarie pris', 'Avgifter & bindningstid'].map(text => <span className={s.trustItem} key={text}><Check size={21} aria-hidden='true' />{text}</span>)}</div>
    <nav className={s.fallback} aria-label='Alla kostnadsområden'>{tracks.map(item => <Link key={item.id} href={item.href}>{item.name}</Link>)}</nav>
  </section>;
}
