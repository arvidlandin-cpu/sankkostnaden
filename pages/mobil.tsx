import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Smartphone } from 'lucide-react';
import CategoryLanding from '../components/CategoryLanding';
import CostRealityCheck from '../components/CostRealityCheck';
import { getActivePartners } from '../lib/partners';

export default function Mobil(){
  const refurbished=getActivePartners('mobil','refurbished',1)[0];
  const refurbishedBlock=refurbished?<section className='refurbishedSpotlight' aria-label='Refurbished mobil'>
    <div className='refurbishedSpotlightCopy'>
      <p className='kicker'>SPARA ÄVEN PÅ TELEFONEN</p>
      <h2>Ska du byta mobil också?</h2>
      <p>Abonnemanget är bara en del av mobilkostnaden. En refurbished iPhone kan sänka inköpspriset rejält jämfört med nytt – kontrollera modell, skick, batteri och garanti innan köp.</p>
      <div className='refurbishedSpotlightActions'>
        <a href={refurbished.trackingUrl} data-partner={refurbished.name} data-category='mobil' data-intent='refurbished' data-placement='mobile_hub_refurbished' target='_blank' rel='sponsored nofollow noopener'>Se refurbished Apple hos {refurbished.name} <ArrowUpRight size={16}/></a>
        <Link href='/mobil/refurbished-mobil/'>Läs guiden först <ArrowRight size={16}/></Link>
      </div>
      <small>Partnerlänk · vi kan få provision om du köper. Det påverkar inte priset för dig.</small>
    </div>
    <div className='refurbishedSpotlightBrand'>
      <img src={`https://www.google.com/s2/favicons?domain=${refurbished.domain}&sz=128`} alt='' loading='lazy'/>
      <strong>{refurbished.name}</strong>
      <span>Refurbished Apple</span>
    </div>
  </section>:null;

  return <CategoryLanding
    category='mobil'
    canonical='https://sankkostnaden.se/mobil/'
    title='Jämför mobilabonnemang 2026 – pris & surf'
    description='Jämför mobilabonnemang 2026 efter pris, surf, nät och bindningstid. Räkna på verklig årskostnad för en person eller familj.'
    kicker='JÄMFÖR MOBIL'
    heading='Betala för surf du använder – inte för en större datapott.'
    lead='Börja med faktisk surfmängd och rätt nät. Jämför sedan kampanjpris, ordinarie pris och villkor över ett helt år.'
    icon={Smartphone}
    compareHref='/mobil/billigaste-mobilabonnemanget/'
    compareLabel='Hitta relevanta abonnemang'
    helpHref='/mobil/hur-mycket-surf-behover-jag/'
    helpLabel='Hjälp mig välja surf'
    partnerHeading='Aktuella mobilalternativ'
    afterPartners={<><CostRealityCheck mode='subscription' label='Mobilabonnemang' />{refurbishedBlock}</>}
    checks={[
      'Faktisk surfmängd per månad',
      'Täckning där du oftast använder mobilen',
      'Kampanjpris och ordinarie pris över ett år',
      'Bindningstid, roaming och eventuella tillägg',
    ]}
    introTitle='Fyra saker avgör om abonnemanget är prisvärt'
    introText='Ett lågt introduktionspris eller mycket surf är inte automatiskt bäst. Matcha först surf och nät mot behovet och jämför sedan hela förstaårskostnaden.'
    guides={[
      {href:'/mobil/billigaste-mobilabonnemanget/',title:'Billigaste mobilabonnemanget',text:'Jämför verklig förstaårskostnad.'},
      {href:'/mobil/hur-mycket-surf-behover-jag/',title:'Hur mycket surf behöver jag?',text:'Tre frågor om din användning.'},
      {href:'/mobil/familjeabonnemang/',title:'Familjeabonnemang',text:'Räkna hela familjens kostnad.'},
      {href:'/mobil/refurbished-mobil/',title:'Refurbished mobil',text:'Sänk inköpspriset på telefonen – jämför skick, batteri och garanti.'},
      {href:'/mobil/utan-bindningstid/',title:'Utan bindningstid',text:'Jämför flexibilitet och pris.'},
    ]}
    moreGuides={[
      {href:'/mobil/fri-surf/',title:'Fri surf',text:'När obegränsad data är värd priset.'},
      {href:'/mobil/5g-abonnemang/',title:'5G-abonnemang',text:'Jämför nät, fart och kostnad.'},
      {href:'/mobil/mobilabonnemang-55-plus/',title:'Mobilabonnemang 55+',text:'Jämför seniorpris med vanliga abonnemang.'},
      {href:'/mobil/lonar-sig-familjeabonnemang/',title:'Lönar sig familjeabonnemang?',text:'Räkna på totalsumman.'},
    ]}
  />;
}
