import { ArrowUpRight, BadgeCheck, Heart, PawPrint } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props = { category: PartnerCategory; heading?: string; intent?: PartnerIntent; limit?: number; };

function PartnerLogo({ name }: { name: string }) {
  if (name === 'Lassie') return <div className='partnerLogo partnerLogoLassie' aria-label='Lassie'><span className='logoPaw'><PawPrint size={19}/></span><b>lassie</b></div>;
  if (name === 'Sveland Djurförsäkring') return <div className='partnerLogo partnerLogoSveland' aria-label='Sveland Djurförsäkringar'><span className='logoHeart'><Heart size={19}/></span><span><b>SVELAND</b><small>DJURFÖRSÄKRINGAR</small></span></div>;
  return <div className='partnerLogo partnerLogoText'><b>{name}</b></div>;
}

export default function PartnerOffers({ category, heading = 'Jämför hos våra partners', intent, limit = 4 }: Props) {
  const items = getActivePartners(category, intent, limit);
  if (items.length === 0) return null;

  return (
    <section className='partnerSection partnerSectionStrong' aria-label={heading}>
      <div className='partnerIntro'>
        <p className='kicker'>JÄMFÖR DIREKT • ÖPPNAS I NY FLIK</p>
        <h2>{heading}</h2>
        <p>Ta fram aktuellt pris och villkor hos alternativen nedan. Vi visar ett begränsat urval relevanta aktiva partners i stället för att fylla sidan med alla samarbeten.</p>
      </div>
      <div className='partnerGrid'>
        {items.map(item => (
          <article className={'partnerCard partnerCardStrong partnerCardBrand ' + (item.name === 'Lassie' ? 'isLassie' : item.name.startsWith('Sveland') ? 'isSveland' : '')} key={item.name}>
            <div>
              <div className='partnerCardTop'><PartnerLogo name={item.name}/><span className='commercialTag'><BadgeCheck size={13}/> PARTNERLÄNK</span></div>
              <p>{item.note}</p>
            </div>
            <a className='partnerButton partnerButtonStrong' href={item.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'>
              {item.cta || (item.category === 'mobil' ? `Se abonnemang hos ${item.name}` : item.category === 'forsakring' ? `Hämta pris hos ${item.name.replace(' Djurförsäkring','')}` : item.category === 'ekonomi' ? `Jämför hos ${item.name}` : `Se pris hos ${item.name}`)} <ArrowUpRight size={18} />
            </a>
          </article>
        ))}
      </div>
      <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Urvalet omfattar inte hela marknaden och ordningen är inte en ranking av vilket alternativ som är bäst.</p>
    </section>
  );
}
