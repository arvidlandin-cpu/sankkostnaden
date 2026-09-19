export type PartnerCategory = 'el' | 'bredband' | 'mobil' | 'forsakring';

export type Partner = {
  name: string;
  category: PartnerCategory;
  note: string;
  trackingUrl: string | null;
};

export const partners: Partner[] = [
  { name: 'Elskling', category: 'el', note: 'Jämförelsetjänst för elavtal.', trackingUrl: null },
  { name: 'Mölndal Energi', category: 'el', note: 'Elhandelsbolag med elavtal för privatkunder.', trackingUrl: null },
  { name: 'Bredbandsval.se', category: 'bredband', note: 'Jämförelsetjänst för bredband och TV. Tillgänglighet och pris kontrolleras för din adress.', trackingUrl: 'https://visit.bredbandsval.se/click?p=390345&a=3498422&url=https%3A%2F%2Fwww.bredbandsval.se%2F' },
  { name: 'Telenor', category: 'bredband', note: 'Bredband och TV.', trackingUrl: null },
  { name: 'mResell', category: 'mobil', note: 'Refurbished Apple-produkter som kan sänka kostnaden jämfört med att köpa nytt.', trackingUrl: null },
  { name: 'Telia', category: 'mobil', note: 'Mobilabonnemang och familjealternativ.', trackingUrl: 'https://go.telia.se/t/t?a=1960510145&as=2111115937&t=2&tk=1' },
  { name: 'Vimla', category: 'mobil', note: 'Mobilabonnemang med olika surfmängder. Kontrollera aktuellt pris och villkor hos operatören.', trackingUrl: 'https://on.vimla.se/t/t?a=1081333617&as=2111115937&t=2&tk=1' },
  { name: 'Tre', category: 'mobil', note: 'Mobilabonnemang och mobilt bredband.', trackingUrl: null },
  { name: 'Tellus Mobil', category: 'mobil', note: 'Mobilabonnemang.', trackingUrl: null },
  { name: 'Sveland Djurförsäkring', category: 'forsakring', note: 'Djurförsäkring. Jämför premie, självrisk, omfattning och villkor för ditt djur.', trackingUrl: 'https://in.sveland.se/t/t?a=1962700516&as=2111115937&t=2&tk=1' },
  { name: 'Lassie', category: 'forsakring', note: 'Djurförsäkring. Kontrollera aktuell premie, självrisk och omfattning innan du tecknar.', trackingUrl: 'https://ion.lassie.co/t/t?a=1644319682&as=2111115937&t=2&tk=1' },
  { name: 'Sejfa', category: 'forsakring', note: 'Digital hemförsäkring.', trackingUrl: null },
  { name: 'ICA Försäkring', category: 'forsakring', note: 'Hem-, bil- och personförsäkringar.', trackingUrl: null },
];

export function getPartners(category: PartnerCategory) {
  return partners.filter(partner => partner.category === category);
}
