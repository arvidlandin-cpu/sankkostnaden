import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { getPartners, type PartnerCategory } from '../lib/partners';

type Props = { category: PartnerCategory; heading?: string; };

export default function PartnerOffers({ category, heading = 'Jämför hos våra partners' }: Props) {
  const items = getPartners(category).filter(item => item.trackingUrl);
  if (items.length === 0) return null;

  return (
    <section className='partnerSection partnerSectionStrong' aria-label={heading}>
      <div className='partnerIntro'>
        <p className='kicker'>GÅ VIDARE & JÄMFÖR PRIS</p>
        <h2>{heading}</h2>
        <p>Öppna partnern och kontrollera aktuellt pris för just dig. Vi kan få provision om du blir kund via länken.</p>
      </div>
      <div className='partnerGrid'>
        {items.map(item => (
          <article className='partnerCard partnerCardStrong' key={item.name}>
            <div>
              <span className='commercialTag'><BadgeCheck size={13}/> PARTNERLÄNK</span>
              <h3>{item.name}</h3>
              <p>{item.note}</p>
            </div>
            <a className='partnerButton partnerButtonStrong' href={item.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'>
              {item.name === 'Bredbandsval.se' ? 'Se bredband & priser' : item.category === 'mobil' ? `Se abonnemang hos ${item.name}` : `Se pris hos ${item.name}`} <ArrowUpRight size={18} />
            </a>
          </article>
        ))}
      </div>
      <p className='partnerFine'>Kommersiella länkar. Alla aktörer på marknaden visas inte.</p>
    </section>
  );
}
