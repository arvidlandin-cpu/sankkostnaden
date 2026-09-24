import Link from 'next/link';
import { useRouter } from 'next/router';
import { Wifi, Smartphone, ShieldCheck, Zap, CircleDollarSign } from 'lucide-react';

const items=[
  {href:'/bredband/',match:'/bredband',label:'Bredband',Icon:Wifi},
  {href:'/mobil/',match:'/mobil',label:'Mobil',Icon:Smartphone},
  {href:'/elavtal/',match:'/elavtal',label:'El',Icon:Zap},
  {href:'/forsakring/',match:'/forsakring',label:'Försäkring',Icon:ShieldCheck},
  {href:'/ekonomi/',match:'/ekonomi',label:'Ekonomi',Icon:CircleDollarSign},
];

export default function MobileQuickBar(){
  const router=useRouter();
  return <nav className='mobileQuickBar' aria-label='Snabbnavigering'>
    {items.map(({href,match,label,Icon})=>{
      const active=router.pathname.startsWith(match);
      return <Link key={href} href={href} className={active?'active':''} aria-current={active?'page':undefined}>
        <Icon size={16}/><b>{label}</b>
      </Link>;
    })}
  </nav>;
}
