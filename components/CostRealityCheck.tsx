import { useMemo, useState } from 'react';
import { Calculator, CheckCircle2 } from 'lucide-react';

type Props =
  | { mode:'subscription'; label:'Bredband'|'Mobilabonnemang' }
  | { mode:'electricity'; label:'Elavtal' };

function money(value:number){
  return Math.round(value).toLocaleString('sv-SE');
}
function numberValue(value:string){
  if(value.trim()==='') return null;
  const parsed=Number(value.replace(',','.'));
  return Number.isFinite(parsed) ? Math.max(0,parsed) : null;
}

export default function CostRealityCheck(props:Props){
  const [hasPromo,setHasPromo]=useState(false);
  const [promo,setPromo]=useState('');
  const [months,setMonths]=useState('');
  const [regular,setRegular]=useState('');
  const [startFee,setStartFee]=useState('');
  const [mandatoryMonthly,setMandatoryMonthly]=useState('');

  const [kwh,setKwh]=useState('');
  const [aOre,setAOre]=useState('');
  const [aFee,setAFee]=useState('');
  const [bOre,setBOre]=useState('');
  const [bFee,setBFee]=useState('');

  const subscription=useMemo(()=>{
    if(props.mode!=='subscription') return null;
    const r=numberValue(regular);
    const start=numberValue(startFee) ?? 0;
    const addon=numberValue(mandatoryMonthly) ?? 0;

    let base=0;
    if(hasPromo){
      const p=numberValue(promo);
      const m=numberValue(months);
      if(p===null||m===null||m<=0||m>12) return null;
      if(m<12&&r===null) return null;
      base=p*m+(r??0)*(12-m);
    }else{
      if(r===null) return null;
      base=r*12;
    }
    const total=base+start+addon*12;
    return {total,average:total/12,start,addon};
  },[props.mode,hasPromo,promo,months,regular,startFee,mandatoryMonthly]);

  const subscriptionHint=useMemo(()=>{
    if(props.mode!=='subscription') return '';
    if(hasPromo&&numberValue(months)===null) return 'Ange hur många månader kampanjen gäller.';
    if(hasPromo&&((numberValue(months)??0)<=0||(numberValue(months)??0)>12)) return 'Kampanjlängden måste vara 1–12 månader.';
    if(hasPromo&&numberValue(promo)===null) return 'Ange kampanjpriset. Skriv 0 om kampanjmånaderna faktiskt är gratis.';
    if((!hasPromo||(numberValue(months)??0)<12)&&numberValue(regular)===null) return 'Ange ordinarie månadspris.';
    return '';
  },[props.mode,hasPromo,promo,months,regular]);

  const electricity=useMemo(()=>{
    if(props.mode!=='electricity') return null;
    const usage=numberValue(kwh);
    const aVariable=numberValue(aOre);
    const aFixed=numberValue(aFee);
    const bVariable=numberValue(bOre);
    const bFixed=numberValue(bFee);
    if(usage===null||usage<=0||aVariable===null||aFixed===null||bVariable===null||bFixed===null) return null;
    const aTotal=usage*aVariable/100+aFixed*12;
    const bTotal=usage*bVariable/100+bFixed*12;
    const difference=Math.abs(aTotal-bTotal);
    const cheaper=aTotal===bTotal?'Lika':aTotal<bTotal?'A':'B';
    return {aTotal,bTotal,difference,cheaper};
  },[props.mode,kwh,aOre,aFee,bOre,bFee]);

  return <section className='costRealityCheck' aria-label={`Räkna kostnad för ${props.label}`}>
    <div className='costRealityHead'>
      <div><p className='kicker'>RÄKNA PÅ SAMMA GRUND</p><h2>{props.mode==='electricity'?'Jämför två elavtal på ett år.':'Räkna första årets abonnemangskostnad.'}</h2></div>
      <Calculator size={25}/>
    </div>

    {props.mode==='subscription'?<>
      <p>Fyll i priset från operatören. Startavgift och obligatoriska månadstillägg räknas med så att första året blir jämförbart.</p>
      <div className='costRealityToggle'>
        <button type='button' className={!hasPromo?'selected':''} onClick={()=>setHasPromo(false)}>Ingen kampanj</button>
        <button type='button' className={hasPromo?'selected':''} onClick={()=>setHasPromo(true)}>Har kampanjpris</button>
      </div>
      <div className='costRealityInputs'>
        {hasPromo&&<label><span>Kampanjpris</span><div><input inputMode='decimal' value={promo} onChange={e=>setPromo(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='99'/><b>kr/mån</b></div></label>}
        {hasPromo&&<label><span>Kampanjlängd</span><div><input inputMode='numeric' value={months} onChange={e=>setMonths(e.target.value.replace(/\D/g,''))} placeholder='3'/><b>mån</b></div></label>}
        <label><span>Ordinarie pris {hasPromo&&numberValue(months)===12&&<small>behövs inte för första året</small>}</span><div><input inputMode='decimal' value={regular} onChange={e=>setRegular(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='299'/><b>kr/mån</b></div></label>
        <label><span>Startavgift <small>valfritt</small></span><div><input inputMode='decimal' value={startFee} onChange={e=>setStartFee(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='0'/><b>kr</b></div></label>
        <label><span>Obligatoriskt tillägg <small>valfritt</small></span><div><input inputMode='decimal' value={mandatoryMonthly} onChange={e=>setMandatoryMonthly(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='0'/><b>kr/mån</b></div></label>
      </div>
      <div className='costRealityResult' aria-live='polite'>
        {subscription?<><CheckCircle2 size={18}/><div><strong>{money(subscription.total)} kr första året</strong><span>Motsvarar {money(subscription.average)} kr/mån i snitt, inklusive angivna obligatoriska avgifter.</span></div></>:<div><strong>Fyll i erbjudandet ovan</strong><span>{subscriptionHint||'Du får en jämförbar 12-månaderskostnad direkt.'}</span></div>}
      </div>
    </>:<>
      <p>Ange samma årsförbrukning och de elhandelsdelar du vill jämföra för två avtal. Kalkylen visar nettot även när ett avtal har lägre kWh-pris men högre fast avgift.</p>
      <label className='costRealityUsage'><span>Årsförbrukning</span><div><input inputMode='numeric' value={kwh} onChange={e=>setKwh(e.target.value.replace(/\D/g,''))} placeholder='15000'/><b>kWh</b></div></label>
      <div className='electricityCompareGrid'>
        <div className='electricityOffer'>
          <strong>Avtal A</strong>
          <label><span>Pris/påslag</span><div><input inputMode='decimal' value={aOre} onChange={e=>setAOre(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='5'/><b>öre/kWh</b></div></label>
          <label><span>Fast avgift</span><div><input inputMode='decimal' value={aFee} onChange={e=>setAFee(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='0'/><b>kr/mån</b></div></label>
        </div>
        <div className='electricityOffer'>
          <strong>Avtal B</strong>
          <label><span>Pris/påslag</span><div><input inputMode='decimal' value={bOre} onChange={e=>setBOre(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='0'/><b>öre/kWh</b></div></label>
          <label><span>Fast avgift</span><div><input inputMode='decimal' value={bFee} onChange={e=>setBFee(e.target.value.replace(/[^0-9,.]/g,''))} placeholder='29'/><b>kr/mån</b></div></label>
        </div>
      </div>
      <div className='costRealityResult' aria-live='polite'>
        {electricity?<><CheckCircle2 size={18}/><div><strong>{electricity.cheaper==='Lika'?'Samma kostnad':`Avtal ${electricity.cheaper} är ${money(electricity.difference)} kr billigare per år`}</strong><span>A: {money(electricity.aTotal)} kr/år · B: {money(electricity.bTotal)} kr/år för de angivna elhandelskomponenterna.</span></div></>:<div><strong>Fyll i båda avtalen</strong><span>Identiska värden ger 0 kr skillnad. Byte av A och B vänder vilket avtal som visas som billigast.</span></div>}
      </div>
    </>}

    <small>Beräkningen använder bara siffrorna du fyller i. Kontrollera att beloppen jämförs på samma momsgrund och att alla obligatoriska avgifter finns med. Elnätsavgift ingår inte i elkalkylen.</small>
  </section>;
}
