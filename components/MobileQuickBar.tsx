import { PiggyBank, Wifi, Smartphone, ShieldCheck, Zap } from 'lucide-react';
export default function MobileQuickBar(){
 return <nav className='mobileQuickBar' aria-label='Snabbnavigering'>
  <a className='mqHome' href='/'><PiggyBank size={17}/><small>Start</small></a>
  <a href='/bredband/'><Wifi size={15}/><b>Bredband</b></a>
  <a href='/mobil/'><Smartphone size={15}/><b>Mobil</b></a>
  <a href='/elavtal/'><Zap size={15}/><b>El</b></a>
  <a href='/forsakring/'><ShieldCheck size={15}/><b>Försäkring</b></a>
 </nav>
}