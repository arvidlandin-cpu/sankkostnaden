import IntentGuide from '../../components/IntentGuide';

export default function Page(){
  return <IntentGuide
    title='Reseförsäkring 2026 – kontrollera skydd innan du tecknar'
    description='Kontrollera vilket reseskydd du redan har och jämför sedan omfattning, självrisk, avbeställningsskydd, tidsgränser och viktiga undantag innan du tecknar extra reseförsäkring.'
    kicker='RESEFÖRSÄKRING'
    canonical='https://sankkostnaden.se/forsakring/reseforsakring/'
    category='forsakring'
    intent='travel'
    bullets={['Kontrollera först reseskydd i hemförsäkring och betalkort','Jämför avbeställning, självrisk och maxbelopp','Se hur länge resan får pågå','Läs undantag för aktiviteter, sjukdom och resmål']}
    sections={[
      {heading:'Börja med skyddet du redan betalar för',body:'Hemförsäkring och vissa betalkort kan innehålla reseskydd. Kontrollera omfattning och tidsgränser innan du köper ett separat skydd så att du inte betalar dubbelt för samma behov.'},
      {heading:'Jämför det som faktiskt kan skilja',body:'Avbeställning, ersättningsgränser, självrisker, förseningar och undantag kan skilja mellan lösningar. Jämför därför innehållet på samma grund i stället för att bara titta på premien.'},
      {heading:'Längre eller annorlunda resor kräver extra kontroll',body:'Resans längd, destination och aktiviteter kan påverka vilket skydd som behövs. Kontrollera alltid de aktuella villkoren för just din resa innan du tecknar.'}
    ]}
    related={[
      {href:'/forsakring/',label:'Alla försäkringsguider'},
      {href:'/forsakring/jamfor-hemforsakring/',label:'Jämför hemförsäkring'},
      {href:'/forsakring/forsakringsersattning/',label:'Försäkringsersättning'}
    ]}
  />;
}
