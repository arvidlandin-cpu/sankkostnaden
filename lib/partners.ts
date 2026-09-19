export type PartnerCategory = 'el' | 'bredband' | 'mobil' | 'forsakring' | 'ekonomi';
export type PartnerStatus = 'active' | 'pending' | 'closed';
export type PartnerIntent = 'compare' | 'family' | 'data' | 'no-binding' | 'fiber' | 'mobile-broadband' | 'pet' | 'home' | 'electricity' | 'refurbished' | 'loan' | 'saving';

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
  { name:'Gofido', category:'forsakring', note:'Digital hemförsäkring. Jämför premie, självrisk, omfattning och villkor innan du tecknar.', trackingUrl:'https://addrevenue.io/t?a=984856&c=3469603', status:'active', intents:['home','compare'], priority:9, cta:'Se pris & villkor' },
  { name:'Happens', category:'forsakring', note:'Jämförelsetjänst för försäkringar.', trackingUrl:null, status:'pending', intents:['home','compare'] },
  { name:'Svedea', category:'forsakring', note:'Försäkringsbolag med bland annat hem-, villa-, bil- och djurförsäkring.', trackingUrl:null, status:'pending', intents:['home','pet','compare'] },
  { name:'Sejfa', category:'forsakring', note:'Digital hemförsäkring.', trackingUrl:null, status:'pending', intents:['home'] },
  { name:'ICA Försäkring', category:'forsakring', note:'Hem-, bil- och personförsäkringar.', trackingUrl:null, status:'closed', intents:['home'] },
  { name:'Samly', category:'ekonomi', note:'Jämförelsetjänst för privatlån och samlingslån. Kontrollera effektiv ränta, avgifter och villkor innan du ansöker.', trackingUrl:'https://addrevenue.io/t?a=985228&c=3469603', status:'active', intents:['compare','loan'], priority:9, cta:'Jämför lån' },
  { name:'Lendella', category:'ekonomi', note:'Jämförelsetjänst för privatlån. Kontrollera effektiv ränta, avgifter och villkor innan du ansöker.', trackingUrl:'https://addrevenue.io/t?a=985100&c=3469603', status:'active', intents:['compare','loan'], priority:9, cta:'Jämför lån' },
  { name:'Toborrow', category:'ekonomi', note:'Jämförelse och förmedling av privatlån. Kontrollera effektiv ränta, avgifter och villkor innan du ansöker.', trackingUrl:'https://addrevenue.io/t?a=985173&c=3469603', status:'active', intents:['compare','loan'], priority:8, cta:'Jämför lån' },
  { name:'Alwy', category:'ekonomi', note:'Tjänst för privatekonomi, sparande och kostnadskontroll.', trackingUrl:'https://addrevenue.io/t?a=984927&c=3469603', status:'active', intents:['saving'], priority:8, cta:'Se tjänsten' },
  { name:'Compari', category:'ekonomi', note:'Jämförelsetjänst för privatlån.', trackingUrl:'https://addrevenue.io/t?a=985235&c=3469603', status:'active', intents:['compare','loan'], priority:7, cta:'Jämför lån' },
  { name:'Jämförbanker.se', category:'ekonomi', note:'Jämförelsetjänst för privatlån.', trackingUrl:'https://addrevenue.io/t?a=985319&c=3469603', status:'active', intents:['compare','loan'], priority:7, cta:'Jämför lån' },
];

export type ActivePartner = Partner & { trackingUrl: string };

const score=(p:Partner,intent?:PartnerIntent)=>(p.priority||0)+(intent&&p.intents.includes(intent)?100:0)+(p.intents.includes('compare')?5:0);

export function getPartners(category: PartnerCategory) { return partners.filter(p => p.category === category); }
export function getActivePartners(category: PartnerCategory, intent?: PartnerIntent, limit = 4): ActivePartner[] {
  return partners
    .filter((p): p is ActivePartner => p.category === category && p.status === 'active' && typeof p.trackingUrl === 'string' && p.trackingUrl.length > 0 && (!intent || p.intents.includes(intent)))
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
