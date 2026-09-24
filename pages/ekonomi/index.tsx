import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CircleDollarSign } from 'lucide-react';
import CategoryLanding from '../../components/CategoryLanding';
import { getActivePartners } from '../../lib/partners';

export default function Ekonomi(){
  const saving=getActivePartners('ekonomi','saving',1)[0];
  const savingBlock=saving?<section className='claimsSpotlight' aria-label='Privatekonomisk överblick'>
    <div>
      <p className='kicker'>SE HELA EKONOMIN</p>
      <h2>Vill du få bättre koll innan du jämför nästa avtal?</h2>
      <p>En samlad bild av utgifter och sparande kan göra det lättare att prioritera vilka kostnader som är mest värda att se över först.</p>
      <div className='claimsSpotlightActions'>
        <a href={saving.trackingUrl} data-partner={saving.name} data-category='ekonomi' data-intent='saving' data-placement='economy_hub_saving' target='_blank' rel='sponsored nofollow noopener'>Se tjänsten hos {saving.name} <ArrowUpRight size={16}/></a>
        <Link href='/ekonomi/kostnadskontroll-och-sparande/'>Läs guiden först <ArrowRight size={16}/></Link>
      </div>
      <small>Partnerlänk · kontrollera funktioner, pris och villkor hos tjänsten.</small>
    </div>
    <div className='claimsSpotlightBrand'>
      <img src={`https://www.google.com/s2/favicons?domain=${saving.domain}&sz=128`} alt='' loading='lazy'/>
      <strong>{saving.name}</strong>
      <span>Privatekonomisk överblick</span>
    </div>
  </section>:null;

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
    afterPartners={savingBlock}
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
      {href:'/ekonomi/kostnadskontroll-och-sparande/',title:'Kostnadskontroll & sparande',text:'Få överblick och prioritera nästa kostnad.'},
      {href:'/verktyg/hushallskostnadskollen/',title:'Hushållskostnadskollen',text:'Se helheten innan du ändrar lån.'},
      {href:'/guide/arskoll-fasta-kostnader/',title:'Årskoll av fasta kostnader',text:'Gå igenom hushållets återkommande avtal.'},
      {href:'/forsakring/trygghetsforsakring/',title:'Skydda fasta kostnader vid inkomstbortfall',text:'Guide till Trygghetsförsäkring vid arbetslöshet eller sjukskrivning.'},
    ]}
  />;
}
