import { CircleDollarSign } from 'lucide-react';
import CategoryLanding from '../../components/CategoryLanding';

export default function Ekonomi(){
  return <CategoryLanding
    category='ekonomi'
    canonical='https://sankkostnaden.se/ekonomi/'
    title='Jämför privatlån & samlingslån 2026'
    description='Jämför privatlån och samlingslån. Kontrollera effektiv ränta, avgifter, löptid och total kostnad innan du väljer.'
    kicker='LÅN & EKONOMI'
    heading='Jämför hela lånekostnaden – inte bara månadsbeloppet.'
    lead='En lägre månadsbetalning kan bero på längre löptid. Jämför därför effektiv ränta, avgifter, löptid och total återbetalning.'
    icon={CircleDollarSign}
    compareHref='/ekonomi/jamfor-privatlan/'
    compareLabel='Hitta relevanta lånejämförelser'
    helpHref='/verktyg/hushallskostnadskollen/'
    helpLabel='Börja med hushållskostnaderna'
    partnerIntent='loan'
    partnerHeading='Tjänster för att jämföra privatlån'
    checks={[
      'Samma lånebelopp i jämförelsen',
      'Effektiv ränta inklusive obligatoriska avgifter',
      'Så lik återbetalningstid som möjligt',
      'Total återbetalning under hela löptiden',
    ]}
    introTitle='Fyra uppgifter gör låneerbjudanden jämförbara'
    introText='Räntan sätts individuellt. Därför är det de faktiska erbjudandenas effektiva ränta, avgifter, löptid och total återbetalning som behöver jämföras.'
    guides={[
      {href:'/ekonomi/jamfor-privatlan/',title:'Så jämför du privatlån',text:'Fyra uppgifter som avgör kostnaden.'},
      {href:'/ekonomi/samlingslan/',title:'Samlingslån',text:'När kan det faktiskt sänka kostnaden?'},
      {href:'/verktyg/hushallskostnadskollen/',title:'Hushållskostnadskollen',text:'Se helheten innan du ändrar lån.'},
      {href:'/guide/arskoll-fasta-kostnader/',title:'Årskoll av fasta kostnader',text:'Gå igenom hushållets återkommande avtal.'},
    ]}
  />;
}
