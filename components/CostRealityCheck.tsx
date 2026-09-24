import { useMemo, useState } from 'react';
import { Calculator, CheckCircle2 } from 'lucide-react';

type Props =
  | { mode:'subscription'; label:'Bredband'|'Mobilabonnemang' }
  | { mode:'electricity'; label:'Elavtal' };

function money(value:number){
  return Math.round(value).toLocaleString('sv-SE');
}

export default function CostRealityCheck(props:Props){
  const [promo,setPromo]=useState('');
  const [months,setMonths]=useState('');
  const [regular,setRegular]=useState('');
  const [kwh,setKwh]=useState('');
  const [ore,setOre]=useState('');
  const [fee,setFee]=useState('');

  const subscription=useMemo(()=>{
    if(props.mode!=='subscription') return null;
    const p=Math.max(0,Number(promo)||0);
    const m=Math.min(12,Math.max(0,Number(months)||0));
    const r=Math.max(0,Number(regular)||0);
    if(!r || !months) return null;
    const total=p*m+r*(12-m);
    return {total,average:total/12};
  },[props.mode,promo,months,regular]);

  const electricity=useMemo(()=>{
    if(props.mode!=='electricity') return null;
    const usage=Math.max(0,Number(kwh)||0);
    const delta=Math.max(0,Number(ore)||0);
    const fixed=Math.max(0,Number(fee)||0);
    if(!usage || (!delta&&!fixed)) return null;
    const variable=usage*delta/100;
    const fixedAnnual=fixed*12;
    return {variable,fixedAnnual,total:variable+fixedAnnual};
  },[props.mode,kwh,ore,fee]);

  return <section className='costRealityCheck' aria-label={`Räkna verklig kostnad för ${props.label}`}>
    <div className='costRealityHead'>
      <div><p className='kicker'>RÄKNA SJÄLV · INGA PÅHITTADE PRISER</p><h2>Vad kostar erbjudandet egentligen?</h2></div>
      <Calculator size={25}/>
    </div>

    {props.mode==='subscription'?<>
      <p>Fyll i kampanjpris och ordinarie pris från operatören. Vi räknar ut första årets verkliga kostnad så att ett lågt introduktionspris inte lurar jämförelsen.</p>
      <div className='costRealityInputs'>
        <label><span>Kampanjpris</span><div><input inputMode='decimal' value={promo} onChange={e=>setPromo(e.target.value.replace(/[^0-9,.]/g,'').replace(',','.'))} placeholder='99'/><b>kr/mån</b></div></label>
        <label><span>Kampanjlängd</span><div><input inputMode='numeric' value={months} onChange={e=>setMonths(e.target.value.replace(/\D/g,''))} placeholder='3'/><b>mån</b></div></label>
        <label><span>Ordinarie pris</span><div><input inputMode='decimal' value={regular} onChange={e=>setRegular(e.target.value.replace(/[^0-9,.]/g,'').replace(',','.'))} placeholder='299'/><b>kr/mån</b></div></label>
      </div>
      <div className='costRealityResult' aria-live='polite'>
        {subscription?<><CheckCircle2 size={18}/><div><strong>{money(subscription.total)} kr första året</strong><span>Motsvarar {money(subscription.average)} kr/mån i snitt över 12 månader.</span></div></>:<div><strong>Fyll i erbjudandet ovan</strong><span>Du får årskostnad och jämförbar snittkostnad direkt.</span></div>}
      </div>
    </>:<>
      <p>Små skillnader i öre/kWh och fasta avgifter blir stora över ett år. Ange din årsförbrukning och skillnaden mellan två avtal.</p>
      <div className='costRealityInputs'>
        <label><span>Årsförbrukning</span><div><input inputMode='numeric' value={kwh} onChange={e=>setKwh(e.target.value.replace(/\D/g,''))} placeholder='15000'/><b>kWh</b></div></label>
        <label><span>Skillnad i pris/påslag</span><div><input inputMode='decimal' value={ore} onChange={e=>setOre(e.target.value.replace(/[^0-9,.]/g,'').replace(',','.'))} placeholder='5'/><b>öre/kWh</b></div></label>
        <label><span>Skillnad i fast avgift</span><div><input inputMode='decimal' value={fee} onChange={e=>setFee(e.target.value.replace(/[^0-9,.]/g,'').replace(',','.'))} placeholder='29'/><b>kr/mån</b></div></label>
      </div>
      <div className='costRealityResult' aria-live='polite'>
        {electricity?<><CheckCircle2 size={18}/><div><strong>{money(electricity.total)} kr/år i skillnad</strong><span>{money(electricity.variable)} kr från kWh-skillnaden + {money(electricity.fixedAnnual)} kr från fasta avgifter.</span></div></>:<div><strong>Fyll i förbrukning och en prisskillnad</strong><span>Då ser du vad skillnaden faktiskt betyder på ett år.</span></div>}
      </div>
    </>}

    <small>Beräkningen använder bara siffrorna du fyller i. Kontrollera alltid aktuellt pris, kampanjperiod och villkor hos leverantören.</small>
  </section>;
}
