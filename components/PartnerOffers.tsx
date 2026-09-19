import { ArrowUpRight } from 'lucide-react';
import { getPartners, type PartnerCategory } from '../lib/partners';

type Props = {
  category: PartnerCategory;
  heading?: string;
};

export default function PartnerOffers({ category, heading = 'Jämför alternativ' }: Props) {
  const items = getPartners(category).filter(item => item.trackingUrl);

  if (items.length === 0) return null;

  return (
    <section className='partnerSection' aria-label={heading}>
      <div className='partnerIntro'>
        <p className='kicker'>JÄMFÖR DIREKT</p>
        <h2>{heading}</h2>
        <p>Gå vidare direkt till en godkänd partner för aktuellt pris och villkor. Kommersiella länkar är tydligt märkta.</p>
      </div>
      <div className='partnerGrid'>
        {items.map(item => (
          <article className='partnerCard' key={item.name}>
            <div>
              <span className='commercialTag'>Kommersiellt alternativ</span>
              <h3>{item.name}</h3>
              <p>{item.note}</p>
            </div>
            <a className='partnerButton' href={item.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'>
              {item.name === 'Bredbandsval.se' ? 'Jämför bredband hos Bredbandsval.se' : `Se pris hos ${item.name}`} <ArrowUpRight size={17} />
            </a>
          </article>
        ))}
      </div>
      <p className='partnerFine'>Vi kan få ersättning om du blir kund via en kommersiell länk, utan att priset höjs för dig.</p>
    </section>
  );
}
