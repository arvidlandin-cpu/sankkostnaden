import { Wifi, Smartphone, ShieldCheck, Zap } from 'lucide-react';
export default function MobileQuickBar(){
 return <nav className='mobileQuickBar' aria-label='Snabbnavigering'>
  <a href='/bredband/'><Wifi size={16}/><b>Bredband</b></a>
  <a href='/mobil/'><Smartphone size={16}/><b>Mobil</b></a>
  <a href='/elavtal/'><Zap size={16}/><b>El</b></a>
  <a href='/forsakring/'><ShieldCheck size={16}/><b>Försäkring</b></a>
 </nav>
}