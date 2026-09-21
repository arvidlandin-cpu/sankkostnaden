import { Wifi } from 'lucide-react';
import CategoryLanding from '../components/CategoryLanding';

export default function Bredband(){
  return <CategoryLanding
    category='bredband'
    canonical='https://sankkostnaden.se/bredband/'
    title='Jämför bredband 2026 – pris & hastighet'
    description='Jämför bredband 2026 efter pris, hastighet och bindningstid. Se vilken fart du behöver och kontrollera vad som finns på din adress.'
    kicker='JÄMFÖR BREDBAND'
    heading='Jämför bredband utan att betala för mer fart än du behöver.'
    lead='Börja med vad som finns på din adress. Jämför sedan samma hastighet, verklig årskostnad och bindningstid.'
    icon={Wifi}
    compareHref='/bredband/bredband-pa-min-adress/'
    compareLabel='Hitta relevanta bredbandsalternativ'
    helpHref='/bredband/vilken-hastighet-behover-jag/'
    helpLabel='Hjälp mig välja hastighet'
    partnerHeading='Aktuella bredbandsalternativ'
    checks={[
      'Vad som faktiskt går att beställa på adressen',
      'Samma hastighet när priser jämförs',
      'Kampanjpris och ordinarie pris över ett år',
      'Bindningstid, uppsägningstid och eventuell utrustning',
    ]}
    introTitle='Fyra saker räcker för en bra första jämförelse'
    introText='Bredband blir snabbt rörigt om du jämför allt samtidigt. Börja med tillgänglighet och rätt hastighet. Först därefter är priset meningsfullt att jämföra.'
    guides={[
      {href:'/bredband/billigaste-bredbandet/',title:'Billigaste bredbandet',text:'Räkna verklig förstaårskostnad.'},
      {href:'/bredband/vilken-hastighet-behover-jag/',title:'Vilken hastighet behöver jag?',text:'Tre frågor om hushållets behov.'},
      {href:'/bredband/fiber-eller-mobilt-bredband/',title:'Fiber eller mobilt?',text:'Välj teknik efter stabilitet, signal och behov.'},
      {href:'/bredband/utan-bindningstid/',title:'Utan bindningstid',text:'Jämför flexibilitet och pris.'},
    ]}
    moreGuides={[
      {href:'/bredband/100-100/',title:'Bredband 100/100',text:'När räcker 100 Mbit/s?'},
      {href:'/bredband/250-250/',title:'Bredband 250/250',text:'När är 250 Mbit/s lagom?'},
      {href:'/bredband/500-500/',title:'Bredband 500/500',text:'För större hushåll och hög samtidighet.'},
      {href:'/bredband/1000-1000/',title:'Bredband 1000/1000',text:'När är gigabit motiverat?'},
      {href:'/bredband/5g-bredband/',title:'5G-bredband',text:'När kan det ersätta fiber?'},
    ]}
  />;
}
