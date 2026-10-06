import Link from 'next/link';
import { PiggyBank } from 'lucide-react';

export default function SiteFooter(){
  return <footer className='siteFooter'>
    <div className='siteFooterInner'>
      <div className='siteFooterBrand'>
        <Link href='/'><span className='brandMark'><PiggyBank size={19}/></span><strong>Sänk Kostnaden</strong></Link>
        <p>Praktiska guider och kalkyler för återkommande hushållskostnader. Kommersiella länkar kan ge oss provision, men vi beskriver inte partnerurvalet som hela marknaden.</p>
      </div>
      <nav aria-label='Om Sänk Kostnaden'>
        <Link href='/sa-jamfor-vi/'>Så jämför vi</Link>
        <Link href='/affiliate/'>Affiliateinformation</Link>
        <Link href='/om/'>Om sajten</Link>
        <a href='mailto:kontakt@sankkostnaden.se'>Kontakt</a>
      </nav>
    </div>
  </footer>;
}
