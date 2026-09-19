export type PartnerCategory = 'el' | 'bredband' | 'mobil' | 'forsakring';
export type PartnerStatus = 'active' | 'pending' | 'closed';
export type PartnerIntent = 'compare' | 'family' | 'data' | 'no-binding' | 'fiber' | 'mobile-broadband' | 'pet' | 'home' | 'electricity' | 'refurbished';

export type Partner = {
  name: string;
  category: PartnerCategory;
  note: string;
  trackingUrl: string | null;
  status: PartnerStatus;
  intents: PartnerIntent[];
  priority?: number;
  cta?: string;
};

export const partners: Partner[] = [
  { name:'Cheap Energy', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=985028&c=3469603', status:'active', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Stockholms Elbolag', category:'el', note:'Elavtal med bland annat fast och rörligt pris. Kontrollera aktuellt pris och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=985027&c=3469603', status:'active', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Svealands Elbolag', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=985029&c=3469603', status:'active', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Motala Energi', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=986637&c=3469603', status:'active', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Kärnfull Energi', category:'el', note:'Elavtal med fokus på kärnkraft. Kontrollera aktuellt pris och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=984789&c=3469603', status:'active', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Elskling', category:'el', note:'Jämförelsetjänst för elavtal.', trackingUrl:null, status:'pending', intents:['compare','electricity'] },
  { name:'Mölndal Energi', category:'el', note:'Elhandelsbolag med elavtal för privatkunder.', trackingUrl:null, status:'pending', intents:['electricity'] },
  { name:'Bredbandsval.se', category:'bredband', note:'Jämförelsetjänst för bredband och TV. Tillgänglighet och pris kontrolleras för din adress.', trackingUrl:'https://visit.bredbandsval.se/click?p=390345&a=3498422&url=https%3A%2F%2Fwww.bredbandsval.se%2F', status:'active', intents:['compare','fiber','mobile-broadband','no-binding'], priority:10, cta:'Se bredband & priser' },
  { name:'Telenor', category:'bredband', note:'Bredband och TV.', trackingUrl:null, status:'pending', intents:['fiber','mobile-broadband'] },
  { name:'mResell', category:'mobil', note:'Refurbished Apple-produkter som kan sänka kostnaden jämfört med att köpa nytt.', trackingUrl:null, status:'pending', intents:['refurbished'] },
  { name:'Telia', category:'mobil', note:'Mobilabonnemang och familjealternativ.', trackingUrl:'https://go.telia.se/t/t?a=1960510145&as=2111115937&t=2&tk=1', status:'active', intents:['compare','family','data'], priority:8 },
  { name:'Vimla', category:'mobil', note:'Mobilabonnemang med olika surfmängder. Kontrollera aktuellt pris och villkor hos operatören.', trackingUrl:'https://on.vimla.se/t/t?a=1081333617&as=2111115937&t=2&tk=1', status:'active', intents:['compare','family','data','no-binding'], priority:8 },
  { name:'Tre', category:'mobil', note:'Mobilabonnemang och mobilt bredband.', trackingUrl:null, status:'pending', intents:['compare','family','data','mobile-broadband'] },
  { name:'Tellus Mobil', category:'mobil', note:'Mobilabonnemang.', trackingUrl:null, status:'pending', intents:['compare','data'] },
  { name:'Sveland Djurförsäkring', category:'forsakring', note:'Djurförsäkring. Jämför premie, självrisk, omfattning och villkor för ditt djur.', trackingUrl:'https://in.sveland.se/t/t?a=1962700516&as=2111115937&t=2&tk=1', status:'active', intents:['pet'], priority:8 },
  { name:'Lassie', category:'forsakring', note:'Djurförsäkring. Kontrollera aktuell premie, självrisk och omfattning innan du tecknar.', trackingUrl:'https://ion.lassie.co/t/t?a=1644319682&as=2111115937&t=2&tk=1', status:'active', intents:['pet'], priority:8 },
  { name:'Sejfa', category:'forsakring', note:'Digital hemförsäkring.', trackingUrl:null, status:'pending', intents:['home'] },
  { name:'ICA Försäkring', category:'forsakring', note:'Hem-, bil- och personförsäkringar.', trackingUrl:null, status:'closed', intents:['home'] },
];

const score=(p:Partner,intent?:PartnerIntent)=>(p.priority||0)+(intent&&p.intents.includes(intent)?100:0)+(p.intents.includes('compare')?5:0);

export function getPartners(category: PartnerCategory) { return partners.filter(p => p.category === category); }
export function getActivePartners(category: PartnerCategory, intent?: PartnerIntent, limit = 4) {
  return partners
    .filter(p => p.category === category && p.status === 'active' && p.trackingUrl && (!intent || p.intents.includes(intent)))
    .sort((a,b)=>score(b,intent)-score(a,intent) || a.name.localeCompare(b.name,'sv'))
    .slice(0,limit);
}
export function getPartnerStats(){
  return {
    active: partners.filter(p=>p.status==='active').length,
    pending: partners.filter(p=>p.status==='pending').length,
    closed: partners.filter(p=>p.status==='closed').length,
  };
}
