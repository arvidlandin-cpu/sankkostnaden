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
  // First-party progressive choice tools, like Kostnadskollen, provide a
  // local back button and comparison escape. A fixed 5-link bar was visually
  // observed obscuring the active question and sponsored result at 390px.
  // Keep the navigation on ordinary category/guide pages.
  const focusedQuestionTools=new Set([
    '/bredband/vilken-hastighet-behover-jag',
    '/mobil/hur-mycket-surf-behover-jag',
    '/elavtal/vilket-elavtal-passar-mig',
  ]);
  if(router.pathname==='/'||router.pathname==='/app'||focusedQuestionTools.has(router.pathname))return null;
  return <nav className='mobileQuickBar' aria-label='Snabbnavigering'>
    {items.map(({href,match,label,Icon})=>{
      const active=router.pathname.startsWith(match);
      return <Link key={href} href={href} className={active?'active':''} aria-current={active?'page':undefined}>
        <Icon size={16}/><b>{label}</b>
      </Link>;
    })}
  </nav>;
}
