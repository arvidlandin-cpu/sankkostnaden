import Link from 'next/link';
import { Wifi, Smartphone, ShieldCheck, Zap, CircleDollarSign } from 'lucide-react';
export default function MobileQuickBar(){
 return <nav className='mobileQuickBar' aria-label='Snabbnavigering'>
  <Link href='/bredband/'><Wifi size={16}/><b>Bredband</b></Link>
  <Link href='/mobil/'><Smartphone size={16}/><b>Mobil</b></Link>
  <Link href='/elavtal/'><Zap size={16}/><b>El</b></Link>
  <Link href='/forsakring/'><ShieldCheck size={16}/><b>Försäkring</b></Link>
  <Link href='/ekonomi/'><CircleDollarSign size={16}/><b>Ekonomi</b></Link>
 </nav>
}