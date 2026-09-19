import { ArrowUpRight, BadgeCheck, Heart, PawPrint } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props = { category: PartnerCategory; heading?: string; intent?: PartnerIntent; limit?: number; };

function PartnerLogo({ name }: { name: string }) {
  if (name === 'Lassie') return <div className='partnerLogo partnerLogoLassie' aria-label='Lassie'><span className='logoPaw'><PawPrint size={19}/></span><b>lassie</b></div>;
  if (name === 'Sveland Djurförsäkring') return <div className='partnerLogo partnerLogoSveland' aria-label='Sveland Djurförsäkringar'><span className='logoHeart'><Heart size={19}/></span><span><b>SVELAND</b><small>DJURFÖRSÄKRINGAR</small></span></div>;
  return <div className='partnerLogo partnerLogoText'><b>{name}</b></div>;
}

function sectionCopy(category: PartnerCategory, intent?: PartnerIntent) {
  if (category === 'ekonomi' && intent === 'loan') return {
    kicker: 'JÄMFÖR PRIVATLÅN · ÖPPNAS I NY FLIK',
    intro: 'Partnerna nedan är tjänster för att jämföra eller ansöka om privatlån. Räntan du erbjuds är individuell, så jämför effektiv ränta, avgifter, löptid och total återbetalning i de faktiska erbjudanden du får.',
  };
  if (category === 'ekonomi' && intent === 'saving') return {
    kicker: 'PRIVATEKONOMI · ÖPPNAS I NY FLIK',
    intro: 'Här visas en relevant tjänst för bättre ekonomisk överblick. Kontrollera funktioner, pris och villkor hos leverantören innan du väljer.',
  };
  if (category === 'forsakring') return {
    kicker: 'JÄMFÖR FÖRSÄKRING · ÖPPNAS I NY FLIK',
    intro: 'Premien beror på dina uppgifter och vilket skydd du väljer. Jämför därför premie, självrisk, omfattning och viktiga undantag för ett likvärdigt skydd.',
  };
  if (category === 'bredband') return {
    kicker: 'JÄMFÖR BREDBAND · ÖPPNAS I NY FLIK',
    intro: 'Pris och tillgänglighet beror på adress och nät. Kontrollera vad som går att beställa hos dig och jämför samma hastighet, ordinarie pris, kampanj och bindningstid.',
  };
  if (category === 'mobil') return {
    kicker: 'JÄMFÖR MOBIL · ÖPPNAS I NY FLIK',
    intro: 'Jämför samma surfbehov och kontrollera kampanjpris, ordinarie pris, nät, bindningstid och övriga villkor innan du väljer.',
  };
  return {
    kicker: 'JÄMFÖR ELAVTAL · ÖPPNAS I NY FLIK',
    intro: 'Kontrollera aktuellt elpris, påslag, fasta avgifter, avtalsform och villkor hos respektive elbolag. Utgå från samma årsförbrukning när du jämför.',
  };
}

export default function PartnerOffers({ category, heading = 'Jämför hos våra partners', intent, limit = 4 }: Props) {
  const items = getActivePartners(category, intent, limit);
  if (items.length === 0) return null;
  const copy = sectionCopy(category, intent);

  return (
    <section className='partnerSection partnerSectionStrong' aria-label={heading}>
      <div className='partnerIntro'>
        <p className='kicker'>{copy.kicker}</p>
        <h2>{heading}</h2>
        <p>{copy.intro}</p>
      </div>
      <div className='partnerGrid'>
        {items.map(item => (
          <article className={'partnerCard partnerCardStrong partnerCardBrand ' + (item.name === 'Lassie' ? 'isLassie' : item.name.startsWith('Sveland') ? 'isSveland' : '')} key={item.name}>
            <div>
              <div className='partnerCardTop'><PartnerLogo name={item.name}/><span className='commercialTag'><BadgeCheck size={13}/> PARTNERLÄNK</span></div>
              <p>{item.note}</p>
            </div>
            <a className='partnerButton partnerButtonStrong' href={item.trackingUrl} target='_blank' rel='sponsored nofollow noopener'>
              {item.cta || (item.category === 'mobil' ? `Se abonnemang hos ${item.name}` : item.category === 'forsakring' ? `Hämta pris hos ${item.name.replace(' Djurförsäkring','')}` : item.category === 'ekonomi' ? `Se tjänsten hos ${item.name}` : `Se pris hos ${item.name}`)} <ArrowUpRight size={18} />
            </a>
          </article>
        ))}
      </div>
      <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Urvalet omfattar inte hela marknaden och ordningen är inte en ranking.</p>
    </section>
  );
}
