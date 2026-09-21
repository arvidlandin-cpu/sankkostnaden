import { Smartphone } from 'lucide-react';
import CategoryLanding from '../components/CategoryLanding';

export default function Mobil(){
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
