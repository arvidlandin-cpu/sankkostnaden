import { ArrowUpRight, PiggyBank } from 'lucide-react';
import { partners } from '../lib/partners';
export default function MobileQuickBar(){
 const active=partners.filter(p=>p.status==='active'&&p.trackingUrl);
 return <div className='mobileQuickBar' aria-label='Snabbval'>
  <a className='mqHome' href='/'><PiggyBank size={18}/><small>Start</small></a>
  {active.map(p=><a key={p.name} href={p.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'><b>{p.name==='Bredbandsval.se'?'Bredband':p.name.replace(' Djurförsäkring','')}</b><ArrowUpRight size={13}/></a>)}
 </div>
}