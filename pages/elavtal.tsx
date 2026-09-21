import { Zap } from 'lucide-react';
import CategoryLanding from '../components/CategoryLanding';

export default function Elavtal(){
  return <CategoryLanding
    category='el'
    canonical='https://sankkostnaden.se/elavtal/'
    title='Jämför elavtal 2026 – pris, påslag & avtalsform'
    description='Jämför elavtal 2026 efter pris, påslag, fasta avgifter, avtalsform och villkor. Se vad som passar ditt hushåll.'
    kicker='JÄMFÖR ELAVTAL'
    heading='Jämför hela elkostnaden – inte bara öre per kWh.'
    lead='Använd samma årsförbrukning när du jämför. Kontrollera pris eller påslag, fasta avgifter, rabattens längd och villkoren efter kampanjen.'
    icon={Zap}
    compareHref='/elavtal/jamfor-elavtal/'
    compareLabel='Hitta relevanta elavtal'
    helpHref='/elavtal/vilket-elavtal-passar-mig/'
    helpLabel='Hjälp mig välja avtalsform'
    partnerIntent='electricity'
    partnerHeading='Aktuella elalternativ'
    checks={[
      'Samma årsförbrukning i alla jämförelser',
      'Påslag eller energipris plus fasta avgifter',
      'Rabattens längd och ordinarie villkor',
      'Bindnings- och uppsägningstid',
    ]}
    introTitle='Börja med kostnaden du faktiskt kan påverka'
    introText='Nätavgiften går normalt inte att välja bort. Fokusera därför på elhandelsavtalet och jämför samma avtalsform och förbrukning på lika villkor.'
    guides={[
      {href:'/elavtal/billigaste-elavtalet/',title:'Billigaste elavtalet',text:'Så räknar du hela kostnaden.'},
      {href:'/elavtal/vilket-elavtal-passar-mig/',title:'Vilket elavtal passar mig?',text:'Fast, rörligt eller kvartspris.'},
      {href:'/elavtal/byta-elavtal/',title:'Byta elavtal',text:'Checklista före bytet.'},
      {href:'/elavtal/sa-laser-du-elfakturan/',title:'Så läser du elfakturan',text:'Hitta kostnaderna du faktiskt kan påverka.'},
    ]}
    moreGuides={[
      {href:'/elavtal/rorligt-elpris/',title:'Rörligt elpris',text:'Fördelar, risk och villkor.'},
      {href:'/elavtal/kvartspris/',title:'Kvartspris',text:'För hushåll som kan styra förbrukningen.'},
      {href:'/elavtal/rorligt-fast-kvartspris/',title:'Rörligt, fast eller kvartspris?',text:'Jämför avtalsformerna.'},
      {href:'/elavtal/elavtal-utan-bindningstid/',title:'Elavtal utan bindningstid',text:'Flexibilitet och uppsägningstid.'},
    ]}
  />;
}
