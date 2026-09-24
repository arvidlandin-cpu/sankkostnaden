export type PartnerCategory = 'el' | 'bredband' | 'mobil' | 'forsakring' | 'ekonomi';
export type PartnerStatus = 'active' | 'pending' | 'closed';
export type PartnerIntent = 'compare' | 'family' | 'data' | 'no-binding' | 'fiber' | 'mobile-broadband' | 'pet' | 'home' | 'travel' | 'health' | 'claims' | 'electricity' | 'refurbished' | 'loan' | 'saving';

export type Partner = {
  name: string;
  category: PartnerCategory;
  note: string;
  trackingUrl: string | null;
  intentTrackingUrls?: Partial<Record<PartnerIntent, string>>;
  status: PartnerStatus;
  intents: PartnerIntent[];
  priority?: number;
  monetizationWeight?: number;
  cta?: string;
  domain?: string;
  linkCheckedAt?: string;
};

export const partners: Partner[] = [
  { name:'Cheap Energy', domain:'cheapenergy.se', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=985028&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Stockholms Elbolag', domain:'stockholmselbolag.se', category:'el', note:'Elavtal med bland annat fast och rörligt pris. Kontrollera aktuellt pris och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=985027&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Svealands Elbolag', domain:'svealandselbolag.se', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=985029&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Motala Energi', domain:'motalaenergi.se', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=986637&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Kärnfull Energi', domain:'karnfull.se', category:'el', note:'Elavtal med fokus på kärnkraft. Kontrollera aktuellt pris och villkor hos elbolaget.', trackingUrl:'https://addrevenue.io/t?a=984789&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:8, cta:'Se elavtal & villkor' },
  { name:'Elskling', domain:'elskling.se', category:'el', note:'Jämförelsetjänst för elavtal. Jämför aktuella elavtal och kontrollera pris, påslag, avgifter och villkor innan du väljer.', trackingUrl:'https://go.adt231.net/t/t?a=2066001225&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:10, cta:'Jämför elavtal' },
  { name:'Vattenfall', domain:'vattenfall.se', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform, påslag, fasta avgifter och övriga villkor hos Vattenfall.', trackingUrl:'https://go.adt291.com/t/t?a=1515676052&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:9, monetizationWeight:3.5, cta:'Se elavtal hos Vattenfall' },
  { name:'Fortum', domain:'fortum.se', category:'el', note:'Elavtal för privatkunder. Kontrollera aktuellt pris, avtalsform, påslag, fasta avgifter och villkor hos Fortum.', trackingUrl:'https://ion.fortum.com/t/t?a=1312475339&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','electricity'], priority:9, monetizationWeight:7, cta:'Se elavtal hos Fortum' },
  { name:'Mölndal Energi', category:'el', note:'Elhandelsbolag med elavtal för privatkunder.', trackingUrl:null, status:'pending', intents:['electricity'] },
  { name:'Bredbandsval.se', domain:'bredbandsval.se', category:'bredband', note:'Jämförelsetjänst för bredband och TV. Tillgänglighet och pris kontrolleras för din adress.', trackingUrl:'https://visit.bredbandsval.se/click?p=390345&a=3498422&url=https%3A%2F%2Fwww.bredbandsval.se%2F', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','fiber','mobile-broadband','no-binding'], priority:10, cta:'Se bredband & priser' },
  { name:'Ownit', domain:'ownit.se', category:'bredband', note:'Bredband via fiber. Kontrollera tillgänglighet på adressen, aktuell hastighet, pris, utrustning och villkor hos Ownit.', trackingUrl:'https://go.adt242.com/t/t?a=1211102606&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','fiber'], priority:9, monetizationWeight:1, cta:'Se bredband hos Ownit' },
  { name:'Internetport', domain:'internetport.se', category:'bredband', note:'Svensk bredbandsleverantör med fiber via stadsnät och mobilt 4G/5G-bredband. Kontrollera tillgänglighet, hastighet, pris och bindningstid på din adress.', trackingUrl:'https://in.internetport.se/t/t?a=2075749856&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','fiber','mobile-broadband','no-binding'], priority:9, monetizationWeight:4, cta:'Se bredband hos Internetport' },
  { name:'Telenor', category:'bredband', note:'Bredband och TV.', trackingUrl:null, status:'pending', intents:['fiber','mobile-broadband'] },
  { name:'mResell', domain:'mresell.se', category:'mobil', note:'Refurbished Apple-produkter. Affiliateprogrammet är för närvarande inte aktivt och partnern ska därför inte visas som aktiv utgång.', trackingUrl:null, status:'closed', intents:['refurbished'], priority:8, monetizationWeight:4.5, cta:'Se refurbished Apple hos mResell' },
  { name:'Telia', domain:'telia.se', category:'mobil', note:'Mobilabonnemang och familjealternativ.', trackingUrl:'https://go.telia.se/t/t?a=1960510145&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','family','data'], priority:8, monetizationWeight:6 },
  { name:'Hallon', domain:'hallon.se', category:'mobil', note:'Mobilabonnemang med olika surfmängder. Kontrollera aktuellt pris, surfmängd och villkor hos operatören.', trackingUrl:'https://go.hallon.se/t/t?a=1083250335&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','data','no-binding'], priority:10, monetizationWeight:2, cta:'Se abonnemang hos Hallon' },
  { name:'Vimla', domain:'vimla.se', category:'mobil', note:'Mobilabonnemang med olika surfmängder. Kontrollera aktuellt pris och villkor hos operatören.', trackingUrl:'https://on.vimla.se/t/t?a=1081333617&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','family','data','no-binding'], priority:8, monetizationWeight:4 },
  { name:'Tre', intentTrackingUrls:{'mobile-broadband':'https://at.tre.se/t/t?a=1243479444&as=2111115937&t=2&tk=1&url=https%3A%2F%2Fwww.tre.se%2Fhandla%2Fbredband'}, domain:'tre.se', category:'mobil', note:'Mobilabonnemang och mobilt bredband. Kontrollera aktuellt pris, surfmängd, nät, bindningstid och villkor hos Tre.', trackingUrl:'https://at.tre.se/t/t?a=1243479444&as=2111115937&t=2&tk=1&url=https%3A%2F%2Fwww.tre.se%2Fhandla%2Fmobilabonnemang', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','family','data','mobile-broadband'], priority:9, monetizationWeight:1.3, cta:'Se abonnemang hos Tre' },
  { name:'Comviq', domain:'comviq.se', category:'mobil', note:'Mobilabonnemang med olika surfmängder och familjealternativ. Kontrollera aktuellt pris, surfmängd och villkor hos Comviq.', trackingUrl:'https://at.to.comviq.se/t/t?a=1864643893&as=2111115937&t=2&tk=1&url=https%3A%2F%2Fwww.comviq.se%2Fmobilabonnemang', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','family','data','no-binding'], priority:9, monetizationWeight:1.2, cta:'Se abonnemang hos Comviq' },
  { name:'Tele2', domain:'tele2.se', category:'mobil', note:'Mobilabonnemang med olika surfmängder och familjealternativ. Kontrollera aktuellt pris, surfmängd, nät och villkor hos Tele2.', trackingUrl:'https://at.to.tele2.se/t/t?a=1864648074&as=2111115937&t=2&tk=1&url=https%3A%2F%2Fwww.tele2.se%2Fmobilabonnemang', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','family','data'], priority:9, monetizationWeight:1.1, cta:'Se abonnemang hos Tele2' },
  { name:'Tellus Mobil', domain:'tellusmobil.se', category:'mobil', note:'Mobilabonnemang. Kontrollera aktuellt pris, surfmängd, nät och villkor hos Tellus Mobil.', trackingUrl:'https://to.tellusmobil.se/t/t?a=1645066233&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','data','no-binding'], priority:9, cta:'Se abonnemang hos Tellus Mobil' },
  { name:'Sveland Djurförsäkring', domain:'sveland.se', category:'forsakring', note:'Djurförsäkring. Jämför premie, självrisk, omfattning och villkor för ditt djur.', trackingUrl:'https://in.sveland.se/t/t?a=1962700516&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['pet'], priority:8, monetizationWeight:10 },
  { name:'Lassie', domain:'lassie.co', category:'forsakring', note:'Djurförsäkring. Kontrollera aktuell premie, självrisk och omfattning innan du tecknar.', trackingUrl:'https://ion.lassie.co/t/t?a=1644319682&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['pet'], priority:8, monetizationWeight:9.5 },
  { name:'Gofido', domain:'gofido.se', category:'forsakring', note:'Digital hemförsäkring. Jämför premie, självrisk, omfattning och villkor innan du tecknar.', trackingUrl:'https://addrevenue.io/t?a=984856&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['home','compare'], priority:9, cta:'Se pris & villkor' },
  { name:'Hedvig', domain:'hedvig.com', category:'forsakring', note:'Digital försäkring för privatpersoner. Kontrollera aktuell premie, självrisk, omfattning och villkor innan du tecknar.', trackingUrl:'https://addrevenue.io/t?a=985083&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['home','compare'], priority:9, cta:'Se pris & villkor hos Hedvig' },
  { name:'ERGO Försäkring', domain:'erv.se', category:'forsakring', note:'Partnerlänken leder till Europeiska ERV:s flöde för reseförsäkring. Kontrollera omfattning, självrisk, reslängd, undantag och villkor innan du tecknar.', trackingUrl:'https://on.erv.se/t/t?a=297967547&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['travel'], priority:8, monetizationWeight:0.5, cta:'Se reseförsäkring hos Europeiska ERV' },
  { name:'Insurello', domain:'insurello.se', category:'forsakring', note:'Tjänst som hjälper privatpersoner att hitta möjliga försäkringsersättningar och driva skadeärenden. Kontrollera avgiftsmodell, fullmakt och villkor innan du startar ett ärende.', trackingUrl:'https://go.adt256.com/t/t?a=1616939388&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['claims'], priority:9, cta:'Se om du kan ha rätt till ersättning' },
  { name:'Happens', category:'forsakring', note:'Jämförelsetjänst för försäkringar.', trackingUrl:null, status:'pending', intents:['home','compare'] },
  { name:'Dina Försäkringar', domain:'dina.se', category:'forsakring', note:'Försäkringsbolag med försäkringar för privatpersoner. Kontrollera aktuell premie, självrisk, omfattning och villkor innan du tecknar.', trackingUrl:'https://go.adt284.net/t/t?a=1841416841&as=2111115937&t=2&tk=1', status:'active', linkCheckedAt:'2026-09-24', intents:['home','compare'], priority:9, monetizationWeight:3.5, cta:'Se försäkringar hos Dina' },
  { name:'Svedea', domain:'svedea.se', category:'forsakring', note:'Försäkringsbolag med bland annat hem-, villa-, bil-, båt-, MC-, hund- och kattförsäkring. Kontrollera aktuell premie, självrisk, omfattning och villkor för den försäkring du behöver.', trackingUrl:'https://addrevenue.io/t?a=987546&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['home','pet','compare'], priority:9, monetizationWeight:2.5, cta:'Se försäkringar hos Svedea' },
  { name:'Sejfa', category:'forsakring', note:'Digital hemförsäkring.', trackingUrl:null, status:'closed', intents:['home'] },
  { name:'ICA Försäkring', category:'forsakring', note:'Hem-, bil- och personförsäkringar.', trackingUrl:null, status:'closed', intents:['home'] },
    { name:'Zmarta', domain:'zmarta.se', category:'ekonomi', note:'Den nuvarande affiliateutgången leder till Zmarta Försäkring i stället för privatlån. Partnern visas därför inte i låneflödet förrän rätt lånelänk är verifierad.', trackingUrl:null, status:'pending', intents:['compare','loan'], priority:10, cta:'Jämför lån hos Zmarta' },
{ name:'Samly', domain:'samly.se', category:'ekonomi', note:'Jämförelsetjänst för privatlån och samlingslån. Kontrollera effektiv ränta, avgifter och villkor innan du ansöker.', trackingUrl:'https://addrevenue.io/t?a=985228&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','loan'], priority:9, cta:'Jämför lån' },
  { name:'Lendella', domain:'lendella.se', category:'ekonomi', note:'Jämförelsetjänst för privatlån. Kontrollera effektiv ränta, avgifter och villkor innan du ansöker.', trackingUrl:'https://addrevenue.io/t?a=985100&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','loan'], priority:9, cta:'Jämför lån' },
  { name:'Toborrow', domain:'toborrow.se', category:'ekonomi', note:'Den nuvarande affiliateutgången leder till företagslån. Partnern visas därför inte i privatlåneflödet förrän en verifierad privatlånelänk finns.', trackingUrl:null, status:'pending', intents:['compare','loan'], priority:8, cta:'Jämför lån' },
  { name:'Alwy', domain:'alwy.se', category:'ekonomi', note:'Affiliateutgången leder för närvarande till ett erbjudande för företag och finansiella rådgivare och ska inte visas i privatflödet.', trackingUrl:null, status:'pending', intents:['saving'], priority:8, cta:'Se tjänsten' },
  { name:'Compari', domain:'compari.se', category:'ekonomi', note:'Affiliateutgången är för närvarande inte tillgänglig. Partnern visas därför inte som aktiv utgång.', trackingUrl:null, status:'closed', intents:['compare','loan'], priority:7, cta:'Jämför lån' },
  { name:'Jämförbanker.se', domain:'jamforbanker.se', category:'ekonomi', note:'Jämförelsetjänst för privatlån. Partnerlänken leder vidare till Axo Finans, så du kan möta Axo-namnet efter klicket. Kontrollera effektiv ränta, avgifter och villkor innan du ansöker.', trackingUrl:'https://addrevenue.io/t?a=985319&c=3469603', status:'active', linkCheckedAt:'2026-09-24', intents:['compare','loan'], priority:7, cta:'Jämför lån via Jämförbanker / Axo' },
];

export type ActivePartner = Partner & { trackingUrl: string };

const svMonths=['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];
export function partnerLinkCheckedLabel(p:Partner){
  if(!p.linkCheckedAt) return 'datum saknas';
  const [year,month,day]=p.linkCheckedAt.split('-').map(Number);
  return `${day} ${svMonths[month-1]||''} ${year}`;
}
export function partnerGroupCheckedLabel(items:Partner[]){
  const dates=items.map(item=>item.linkCheckedAt).filter((value):value is string=>Boolean(value)).sort();
  if(!dates.length) return 'datum saknas';
  const [year,month,day]=dates[0].split('-').map(Number);
  return `${day} ${svMonths[month-1]||''} ${year}`;
}
export function partnerSourceLabel(p:Partner){
  return p.domain ? p.domain : 'partnerns webbplats';
}

export const partnerRankScore=(p:Partner,intent?:PartnerIntent)=>(p.priority||0)+(intent&&p.intents.includes(intent)?100:0)+(p.intents.includes('compare')?5:0);
export const partnerCommercialWeight=(p:Partner)=>(p.monetizationWeight||0);

// Relevans och kommersiell ersättning hålls isär. partnerRankScore styr användarens
// relevansordning. monetizationWeight får bara användas i separat, tydligt märkt
// kommersiell exponering eller efterföljande intäktsanalys.

export function getPartners(category: PartnerCategory) { return partners.filter(p => p.category === category); }
export function getActivePartners(category: PartnerCategory, intent?: PartnerIntent, limit = 4): ActivePartner[] {
  return partners
    .filter((p): p is ActivePartner => p.category === category && p.status === 'active' && typeof p.trackingUrl === 'string' && p.trackingUrl.length > 0 && (!intent || p.intents.includes(intent)))
    .sort((a,b)=>partnerRankScore(b,intent)-partnerRankScore(a,intent) || a.name.localeCompare(b.name,'sv'))
    .slice(0,limit)
    .map(p=>intent&&p.intentTrackingUrls?.[intent]?{...p,trackingUrl:p.intentTrackingUrls[intent]!}:p);
}
export function getPartnerStats(){
  return {
    active: partners.filter(p=>p.status==='active').length,
    pending: partners.filter(p=>p.status==='pending').length,
    closed: partners.filter(p=>p.status==='closed').length,
  };
}
