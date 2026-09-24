import MobilePartnerMatcher from './MobilePartnerMatcher';
import { BroadbandPartnerMatcher, ElectricityPartnerMatcher, InsurancePartnerMatcher, LoanPartnerMatcher } from './GuidedPartnerMatchers';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props={category:PartnerCategory; intent?:PartnerIntent; heading?:string};

function directoryIntro(category:PartnerCategory,intent?:PartnerIntent){
 if(category==='ekonomi'&&intent==='loan') return 'Här visas våra aktiva partners för privatlån. Räntan sätts individuellt, så jämför effektiv ränta, avgifter, löptid och total återbetalning i de erbjudanden du faktiskt får.';
 if(category==='forsakring') return 'Här visas våra relevanta aktiva försäkringspartners. Jämför premie, självrisk, omfattning och villkor för samma typ av skydd.';
 if(category==='bredband') return 'Här visas våra aktiva bredbandspartners. Kontrollera tillgänglighet på din adress och jämför samma hastighet, ordinarie pris, kampanj och bindningstid.';
 if(category==='mobil') return 'Här visas våra aktiva mobilpartners. Jämför samma surfbehov och kontrollera nät, kampanjpris, ordinarie pris och bindningstid.';
 if(category==='el') return 'Här visas våra aktiva elpartners. Jämför påslag, fasta avgifter, avtalsform och villkor utifrån samma årsförbrukning.';
 return 'Här visas våra relevanta aktiva partners. Kontrollera alltid aktuella villkor hos leverantören innan du väljer.';
}

export default function PartnerDirectory({category,intent,heading='Aktiva alternativ att jämföra'}:Props){
 if(category==='mobil'&&(!intent||intent==='compare')) return <MobilePartnerMatcher/>;
 if(category==='bredband'&&(!intent||intent==='compare')) return <BroadbandPartnerMatcher/>;
 if(category==='el'&&(!intent||intent==='compare'||intent==='electricity')) return <ElectricityPartnerMatcher/>;
 if(category==='forsakring'&&(intent==='home'||intent==='pet')) return <InsurancePartnerMatcher preset={intent}/>;
 if(category==='ekonomi'&&intent==='loan') return <LoanPartnerMatcher/>;
 const items=getActivePartners(category,intent,6);
 if(!items.length) return null;
 return <section id='partners' className='partnerSection' aria-label={heading}>
  <div className='partnerIntro'><p className='kicker'>JÄMFÖRELSEÖVERSIKT</p><h2>{heading}</h2><p>{directoryIntro(category,intent)}</p></div>
  <div className='partnerGrid'>
   {items.map(item=><article className='partnerCard partnerCardStrong' key={item.name}>
    <div><div className='partnerCardTop'><div className='partnerBrand'>{item.domain&&<img src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`} alt='' loading='lazy'/>}<span className='partnerWordmark'>{item.name}</span></div><span className='commercialTag'><BadgeCheck size={13}/> PARTNERLÄNK</span></div><p>{item.note}</p></div>
    <a className='partnerButton partnerButtonStrong' href={item.trackingUrl} data-partner={item.name} data-category={item.category} data-intent={intent || 'unspecified'} data-placement='partner_directory' target='_blank' rel='sponsored nofollow noopener'>{item.cta || (item.category==='mobil' ? `Se abonnemang hos ${item.name}` : item.category==='bredband' ? `Se bredband hos ${item.name}` : item.category==='el' ? `Se elavtal hos ${item.name}` : item.category==='ekonomi' ? `Jämför lån hos ${item.name}` : `Se premie hos ${item.name.replace(' Djurförsäkring','')}`)} <ArrowUpRight size={18}/></a>
   </article>)}
  </div>
  <p className='partnerFine'>Kommersiella länkar – vi kan få provision om du blir kund. Det påverkar inte priset för dig. Listan visar våra relevanta aktiva partners, inte hela marknaden, och ordningen är inte en ranking.</p>
 </section>
}
