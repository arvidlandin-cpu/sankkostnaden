import IntentGuide from '../../components/IntentGuide';

export default function Page(){
 return <IntentGuide
  title='Jämför hemförsäkring 2026 – pris, självrisk & skydd'
  description='Jämför hemförsäkring 2026. Kontrollera pris, självrisk, allrisk, reseskydd och omfattning så att du jämför likvärdigt skydd.'
  kicker='JÄMFÖR HEMFÖRSÄKRING'
  canonical='https://sankkostnaden.se/forsakring/jamfor-hemforsakring/'
  category='forsakring'
  intent='home'
  bullets={['Jämför årspremie efter eventuella rabatter','Kontrollera grundsjälvrisk och särskilda självrisker','Jämför reseskydd, allrisk och ersättningsgränser','Kontrollera vilka personer i hushållet som omfattas']}
  sections={[
   {heading:'Hur jämför man hemförsäkring?',body:'Börja med att bestämma vilket skydd hushållet behöver. Jämför sedan årspremie, självrisk, ersättningsgränser och viktiga undantag på samma nivå. Då undviker du att ett lägre pris egentligen beror på ett smalare skydd.'},
   {heading:'Jämför pris och självrisk tillsammans',body:'En lägre premie kan kombineras med högre självrisk. Bedöm därför både den återkommande årskostnaden och hur mycket du själv behöver kunna betala om en skada inträffar.'},
   {heading:'Kontrollera allrisk och reseskydd',body:'Allrisk, ibland kallad drulle, kan vara inkluderad eller ett tillval. Reseskyddets omfattning och tidsgränser kan också skilja sig. Kontrollera de delar som är relevanta för ditt hushåll i de aktuella villkoren.'},
   {heading:'Räkna samlingsrabatter på hela paketet',body:'En rabatt på hemförsäkringen behöver inte ge lägst total kostnad om andra försäkringar samtidigt blir dyrare. Jämför nettot för hela försäkringspaketet om du samlar flera försäkringar hos samma bolag.'}
  ]}
  related={[
   {href:'/forsakring/vad-kostar-hemforsakring/',label:'Vad kostar hemförsäkring?'},
   {href:'/forsakring/hemforsakring-bostadsratt/',label:'Hemförsäkring bostadsrätt'},
   {href:'/forsakring/hemforsakring-hyresratt/',label:'Hemförsäkring hyresrätt'},
   {href:'/forsakring/hemforsakring-skyddskoll/',label:'Skyddskoll för hemförsäkring'}
  ]}
 />;
}