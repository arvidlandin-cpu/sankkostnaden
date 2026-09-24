import IntentGuide from '../../components/IntentGuide';

export default function Page(){
  return <IntentGuide
    title='Kostnadskontroll och sparande 2026 – få bättre överblick'
    description='Skapa bättre överblick över återkommande utgifter och sparande. Börja med verkliga kostnader, prioritera stora poster och följ upp förändringen över tid.'
    kicker='KOSTNADSKONTROLL & SPARANDE'
    canonical='https://sankkostnaden.se/ekonomi/kostnadskontroll-och-sparande/'
    category='ekonomi'
    intent='saving'
    bullets={['Samla återkommande utgifter på ett ställe','Prioritera stora kostnader du faktiskt kan påverka','Skilj engångskostnader från månadskostnader','Följ upp om förändringar verkligen gav lägre kostnad']}
    sections={[
      {heading:'Överblick kommer före optimering',body:'Det är svårt att veta vilken kostnad som är mest värd att angripa om utgifterna ligger utspridda. Börja därför med en samlad bild av vad hushållet faktiskt betalar varje månad.'},
      {heading:'Prioritera sådant som går att påverka',body:'Elavtal, bredband, mobil, försäkring och vissa finansiella kostnader är ofta enklare att jämföra än boende och transport. Börja där potentialen är stor och förändringen är realistisk.'},
      {heading:'Mät utfallet efter bytet',body:'En lägre introduktionskostnad är inte alltid en varaktig besparing. Följ upp ordinarie pris, avgifter och förändrad månadskostnad så att besparingen blir verklig över tid.'}
    ]}
    related={[
      {href:'/app/',label:'Starta Kostnadskollen'},
      {href:'/verktyg/hushallskostnadskollen/',label:'Räkna hushållets kostnader'},
      {href:'/guide/arskoll-fasta-kostnader/',label:'Gör en årskoll'}
    ]}
  />;
}
