import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ExternalLink, PiggyBank, RotateCcw, Sparkles } from 'lucide-react';
import { getActivePartners } from '../../lib/partners';
import selectorStyles from '../../styles/SmartSelector.module.css';
import pilotStyles from '../../styles/MobileSurfPilot.module.css';

type PilotVariant = 'A' | 'B';
type SelectorOption = { label: string; points: number };
type SelectorQuestion = { title: string; help: string; options: SelectorOption[] };
type SelectorResult = { min: number; label: string; title: string; text: string; bullets: string[]; cta: string; href: string };

type PilotEvent = {
  event: string;
  experiment_id: 'mobile_surf_direct_partner_v1';
  participant_id: string;
  variant: PilotVariant;
  ts: string;
  [key: string]: string | number | boolean;
};

type PilotClickRecord = {
  click_id: string;
  participant_id: string;
  variant: PilotVariant;
  partner: string;
  placement: string;
  created_at: string;
};

declare global {
  interface Window {
    __SK_MOBILE_SURF_PILOT_EVENTS__?: PilotEvent[];
    __SK_MOBILE_SURF_PILOT_CLICKS__?: PilotClickRecord[];
  }
}

// Frozen from pages/mobil/hur-mycket-surf-behover-jag.tsx @ blob
// 006b96b7435d678232a4f3c4f3225f03743be569.
const questions: SelectorQuestion[] = [
  { title: 'Hur mycket använder du mobilen utan wifi?', help: 'Tänk på pendling, resor, skola, jobb och annan tid utanför hemmet.', options: [{ label: 'Nästan alltid wifi', points: 0 }, { label: 'Lite varje dag', points: 1 }, { label: 'Mycket varje dag', points: 2 }, { label: 'Mobilen är mitt huvudinternet', points: 4 }] },
  { title: 'Vad gör du mest på mobildata?', help: 'Video och hotspot drar betydligt mer data än meddelanden och musik.', options: [{ label: 'Meddelanden, kartor, bank', points: 0 }, { label: 'Sociala medier och musik', points: 1 }, { label: 'Mycket video och streaming', points: 3 }, { label: 'Hotspot/delar internet ofta', points: 4 }] },
  { title: 'Hur ser abonnemangen ut hemma?', help: 'Flera separata abonnemang kan vara en större kostnadsfråga än själva surfmängden.', options: [{ label: 'Bara mitt abonnemang', points: 0 }, { label: '2 personer', points: 1 }, { label: '3–4 separata abonnemang', points: 2 }, { label: '5+ separata abonnemang', points: 3 }] },
];

const results: SelectorResult[] = [
  { min: 0, label: 'SURFPROFIL · LÅG', title: 'Du behöver sannolikt inte fri surf', text: 'Din användning pekar mot en mindre datapott. Här är risken snarare att du betalar för surf du aldrig använder.', bullets: ['Börja jämförelsen på lägre surfmängder', 'Kontrollera sparad surf och EU-villkor', 'Jämför ordinarie månadspris'], cta: 'Jämför billigare mobil', href: '/mobil/billigaste-mobilabonnemanget/' },
  { min: 4, label: 'SURFPROFIL · NORMAL', title: 'Mellansegmentet är troligen rätt', text: 'Du använder mobildata regelbundet men signalerna mot obegränsad surf är inte tillräckligt starka för att betala extra utan jämförelse.', bullets: ['Jämför datapott mot verklig användning', 'Se vad priset blir efter kampanj', 'Kontrollera nät och täckning där du använder mobilen'], cta: 'Jämför mobilabonnemang', href: '/mobil/billigaste-mobilabonnemanget/' },
  { min: 8, label: 'SURFPROFIL · HÖG', title: 'Stor datapott eller fri surf kan passa', text: 'Video, hotspot eller mycket användning utan wifi gör att en stor datapott kan vara rationell. Jämför ändå totalpriset mot ett steg lägre.', bullets: ['Jämför stor datapott mot fri surf', 'Kontrollera eventuella hastighetsvillkor', 'Har ni flera abonnemang: jämför familjeupplägg'], cta: 'Jämför fri surf', href: '/mobil/fri-surf/' },
];

const experimentId = 'mobile_surf_direct_partner_v1' as const;
const assignmentKey = 'sk-mobile-surf-pilot-v1-assignment';
const participantKey = 'sk-mobile-surf-pilot-v1-participant';

function createParticipantId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `pilot-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createLocalClickId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID().replace(/-/g, '');
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

function withAdtractionEpi(trackingUrl: string, clickId: string, variant: PilotVariant, placement: string) {
  const url = new URL(trackingUrl);
  url.searchParams.set('epi', clickId);
  url.searchParams.set('epi2', `v${variant.toLowerCase()}`);
  url.searchParams.set('epi3', 'surf_low_own');
  url.searchParams.set('epi4', placement);
  url.searchParams.set('epi5', 'msv1');
  return url.toString();
}

function emitPilotEvent(participantId: string, variant: PilotVariant, event: string, extra: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const payload: PilotEvent = {
    event,
    experiment_id: experimentId,
    participant_id: participantId,
    variant,
    ts: new Date().toISOString(),
    ...extra,
  };
  window.__SK_MOBILE_SURF_PILOT_EVENTS__ = [...(window.__SK_MOBILE_SURF_PILOT_EVENTS__ || []), payload];
  window.dispatchEvent(new CustomEvent('sk:mobile-surf-pilot', { detail: payload }));
}

export default function MobileSurfPilot() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [variant, setVariant] = useState<PilotVariant | null>(null);
  const [participantId, setParticipantId] = useState('');
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [forceNoPartner, setForceNoPartner] = useState(false);
  const [clickId, setClickId] = useState('');
  const lastResultKey = useRef('');
  const lastClickContext = useRef('');

  const answered = answers.filter(value => value >= 0).length;
  const score = answers.reduce((sum, answer, index) => sum + (answer >= 0 ? questions[index].options[answer].points : 0), 0);
  const result = useMemo(() => [...results].reverse().find(item => score >= item.min) || results[0], [score]);
  const complete = answered === questions.length;
  const ownSubscription = answers[2] === 0;
  const lowProfile = result.min === 0;
  const pilotBranchMatched = complete && lowProfile && ownSubscription;

  const selectedPartner = forceNoPartner ? undefined : getActivePartners('mobil', 'data', 1)[0];
  const partnerRelevant = Boolean(selectedPartner && selectedPartner.category === 'mobil' && selectedPartner.intents.includes('data'));


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get('variant')?.toLowerCase();
    const forcedVariant: PilotVariant | null = forced === 'a' ? 'A' : forced === 'b' ? 'B' : null;
    const simulateNoPartner = params.get('partner') === 'none';
    setForceNoPartner(simulateNoPartner);

    const storedParticipant = window.localStorage.getItem(participantKey);
    const id = storedParticipant || createParticipantId();
    if (!storedParticipant) window.localStorage.setItem(participantKey, id);

    const storedAssignment = window.localStorage.getItem(assignmentKey);
    const assigned: PilotVariant = forcedVariant || (storedAssignment === 'A' || storedAssignment === 'B' ? storedAssignment : Math.random() < 0.5 ? 'A' : 'B');
    if (!forcedVariant && !storedAssignment) window.localStorage.setItem(assignmentKey, assigned);

    setParticipantId(id);
    setVariant(assigned);
    emitPilotEvent(id, assigned, 'pilot_assignment', {
      assignment_source: forcedVariant ? 'query' : storedAssignment ? 'storage' : 'random_50_50',
      partner_simulated_none: simulateNoPartner,
    });
  }, []);

  useEffect(() => {
    if (!complete || !variant || !participantId) return;
    const key = `${answers.join(',')}|${variant}`;
    if (lastResultKey.current === key) return;
    lastResultKey.current = key;
    emitPilotEvent(participantId, variant, 'pilot_result_view', {
      score,
      profile: result.label,
      own_subscription: ownSubscription,
      pilot_branch_matched: pilotBranchMatched,
      partner_available_in_registry: partnerRelevant,
    });
  }, [answers, complete, ownSubscription, participantId, partnerRelevant, pilotBranchMatched, result.label, score, variant]);

  const choose = (questionIndex: number, optionIndex: number) => {
    setAnswers(current => current.map((value, index) => index === questionIndex ? optionIndex : value));
    setComparisonOpen(false);
    if (variant && participantId) {
      emitPilotEvent(participantId, variant, 'pilot_answer', {
        question_index: questionIndex + 1,
        option_index: optionIndex + 1,
        option_label: questions[questionIndex].options[optionIndex].label,
      });
    }
  };

  const openComparison = () => {
    setComparisonOpen(true);
    if (variant && participantId) emitPilotEvent(participantId, variant, 'pilot_compare_open', { profile: result.label });
  };

  const recordAffiliateClick = () => {
    if (!variant || !participantId || !selectedPartner || !clickId) return;
    const record: PilotClickRecord = {
      click_id: clickId,
      participant_id: participantId,
      variant,
      partner: selectedPartner.name,
      placement,
      created_at: new Date().toISOString(),
    };
    window.__SK_MOBILE_SURF_PILOT_CLICKS__ = [...(window.__SK_MOBILE_SURF_PILOT_CLICKS__ || []), record];
    const stored = JSON.parse(window.localStorage.getItem('sk-mobile-surf-pilot-v1-clicks') || '[]') as PilotClickRecord[];
    window.localStorage.setItem('sk-mobile-surf-pilot-v1-clicks', JSON.stringify([...stored, record].slice(-100)));
    emitPilotEvent(participantId, variant, 'pilot_affiliate_click', {
      click_id: clickId,
      partner: selectedPartner.name,
      placement,
    });
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(-1));
    setComparisonOpen(false);
    setClickId('');
    lastClickContext.current = '';
    lastResultKey.current = '';
    if (variant && participantId) emitPilotEvent(participantId, variant, 'pilot_reset');
  };

  const showPartnerCard = pilotBranchMatched && partnerRelevant && (variant === 'B' || comparisonOpen);
  const showNoMatch = pilotBranchMatched && !partnerRelevant && (variant === 'B' || comparisonOpen);
  const placement = comparisonOpen ? 'pilot_compare_result' : 'pilot_result_direct';

  useEffect(() => {
    if (!showPartnerCard || !variant || !selectedPartner?.trackingUrl) {
      setClickId('');
      lastClickContext.current = '';
      return;
    }
    const context = `${variant}|${selectedPartner.name}|${placement}`;
    if (lastClickContext.current === context) return;
    lastClickContext.current = context;
    setClickId(createLocalClickId());
  }, [placement, selectedPartner?.name, selectedPartner?.trackingUrl, showPartnerCard, variant]);

  const affiliateHref = selectedPartner?.trackingUrl && clickId && variant
    ? withAdtractionEpi(selectedPartner.trackingUrl, clickId, variant, placement)
    : '';

  return (
    <>
      <header className={selectorStyles.topbar}>
        <Link className={selectorStyles.brand} href='/'><span><PiggyBank size={20} /></span><strong>Sänk Kostnaden</strong></Link>
        <div className={pilotStyles.testBanner}>Privat pilot · ej kommersiell</div>
      </header>

      <main className={selectorStyles.shell}>
        <div className={pilotStyles.variantRow}>
          <span>Experiment: {experimentId}</span>
          <strong data-testid='pilot-variant'>Variant {variant || '…'}</strong>
        </div>

        <section className={selectorStyles.hero}>
          <span><Sparkles size={15} /> PILOT · MOBIL</span>
          <h1>Hur mycket surf behöver du – på riktigt?</h1>
          <p>Fryst prototyp av samma tre frågor som den befintliga surfguiden. Endast överlämningen efter låg surfprofil testas.</p>
          <div className={selectorStyles.progress} role='progressbar' aria-label='Framsteg' aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><i style={{ width: `${(answered / questions.length) * 100}%` }} /></div>
          <small>{answered} av {questions.length} svar klara</small>
        </section>

        <section className={selectorStyles.layout}>
          <div className={selectorStyles.questions}>
            {questions.map((question, questionIndex) => (
              <article className={selectorStyles.question} key={question.title}>
                <div className={selectorStyles.questionHead}><b>0{questionIndex + 1}</b><div><h2>{question.title}</h2><p>{question.help}</p></div></div>
                <div className={selectorStyles.options}>
                  {question.options.map((option, optionIndex) => (
                    <button className={answers[questionIndex] === optionIndex ? selectorStyles.selected : ''} key={option.label} onClick={() => choose(questionIndex, optionIndex)}>
                      <span>{answers[questionIndex] === optionIndex && <Check size={15} />}{option.label}</span>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className={`${selectorStyles.result} ${complete ? selectorStyles.complete : ''}`}>
            <span className={selectorStyles.resultLabel}>{complete ? result.label : 'DIN PROFIL BYGGS'}</span>
            <h2>{complete ? result.title : 'Svara på frågorna så gör vi jobbet.'}</h2>
            <p>{complete ? result.text : 'Du får en konkret behovsprofil och ett tydligt nästa steg – utan att behöva kunna marknaden själv.'}</p>

            {complete && <ul>{result.bullets.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>}

            {pilotBranchMatched && variant === 'A' && !comparisonOpen && (
              <button className={pilotStyles.primaryAction} onClick={openComparison} data-testid='pilot-control-continue'>
                Fortsätt till jämförelse <ArrowRight size={17} />
              </button>
            )}

            {pilotBranchMatched && variant === 'B' && !comparisonOpen && (
              <button className={pilotStyles.secondaryAction} onClick={openComparison} data-testid='pilot-variant-compare'>
                Läs samma jämförelse
              </button>
            )}

            {showPartnerCard && selectedPartner && (
              <section className={pilotStyles.partnerCard} data-testid='pilot-partner-card'>
                <span>RELEVANT ALTERNATIV · TESTLÄGE</span>
                <h3>{selectedPartner.name}</h3>
                <p>{selectedPartner.note}</p>
                {affiliateHref ? (
                  <a
                    href={affiliateHref}
                    target='_blank'
                    rel='sponsored noopener noreferrer'
                    className={pilotStyles.affiliateAction}
                    onClick={recordAffiliateClick}
                    data-testid='pilot-affiliate-link'
                    data-affiliate-partner={selectedPartner.name}
                    data-affiliate-category='mobil'
                    data-affiliate-intent='data'
                    data-affiliate-placement={placement}
                    data-affiliate-click-id={clickId}
                    data-experiment-id={experimentId}
                    data-experiment-variant={variant}
                    data-partner-position='1'
                  >
                    {selectedPartner.cta || `Se abonnemang hos ${selectedPartner.name}`} <ExternalLink size={16} />
                  </a>
                ) : (
                  <span className={pilotStyles.lockedAction}>Förbereder spårning…</span>
                )}
                <small>Annonslänk. Aktuellt pris, surfmängd och villkor kontrolleras hos operatören. Klicket märks med ett slumpmässigt EPI-ID för senare avstämning mot Adtraction.</small>
              </section>
            )}

            {showNoMatch && (
              <section className={pilotStyles.noMatch} data-testid='pilot-no-match'>
                <strong>Verifierat matchande alternativ saknas i testläget.</strong>
                <p>Ingen partner visas när relevans eller verifiering saknas. Prototypen hittar inte på en rekommendation.</p>
              </section>
            )}

            {complete && !pilotBranchMatched && (
              <div className={pilotStyles.neutralContinuation} data-testid='pilot-neutral-continuation'>
                <p>Den här profilen ingår inte i första pilotgrenen. A och B fortsätter därför identiskt.</p>
                <Link href={result.href}>{result.cta} <ArrowRight size={17} /></Link>
              </div>
            )}

            <button className={selectorStyles.reset} onClick={reset}><RotateCcw size={14} /> Börja om</button>
            <small>Piloten använder befintlig GA4 affiliate_click-spårning för utgående partnerklick och sparar samtidigt slumpmässigt click-ID lokalt för QA/avstämning. Ingen personlig besparing beräknas.</small>
          </aside>
        </section>
      </main>
    </>
  );
}
