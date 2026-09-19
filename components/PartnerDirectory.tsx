import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props={category:PartnerCategory; intent?:PartnerIntent; heading?:string};

export default function PartnerDirectory({category,intent,heading='Aktiva alternativ att jämföra'}:Props){
 const items=getActivePartners(category,intent,50);
 if(!items.length) return null;
 return <section className='partnerSection' aria-label={heading}>
  <div className='partnerIntro'><p className='kicker'>JÄMFÖRELSEÖVERSIKT</p><h2>{heading}</h2><p>På jämförelsesidan visar vi alla relevanta aktiva samarbeten. Kontrollera alltid aktuellt pris, innehåll och villkor hos leverantören innan du väljer.</p></div>
  <div className='partnerGrid'>
   {items.map(item=><article className='partnerCard partnerCardStrong' key={item.name}>
    <div><div className='partnerCardTop'><div className='partnerLogo partnerLogoText'><b>{item.name}</b></div><span className='commercialTag'><BadgeCheck size={13}/> PARTNERLÄNK</span></div><p>{item.note}</p></div>
    <a className='partnerButton partnerButtonStrong' href={item.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'>{item.cta||'Se aktuellt erbjudande'} <ArrowUpRight size={18}/></a>
   </article>)}
  </div>
  <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Listan omfattar våra aktiva relevanta partners, inte hela marknaden, och ordningen är inte en bedömning av vilket alternativ som är bäst.</p>
 </section>
}
