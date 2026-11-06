import Link from 'next/link';
import { useRouter } from 'next/router';
import { PiggyBank } from 'lucide-react';

export default function SiteFooter(){
  const router=useRouter();

  // The homepage has its own full editorial footer. Avoid rendering a second
  // global footer underneath it while keeping the trust links site-wide elsewhere.
  if(router.pathname==='/') return null;

  return <footer className='siteFooter'>
    <div className='siteFooterInner'>
      <div className='siteFooterBrand'>
        <Link href='/'><span className='brandMark'><PiggyBank size={19}/></span><strong>Sänk Kostnaden</strong></Link>
        <p>Guider och verktyg för hushållets återkommande kostnader. Vi kan få ersättning via markerade partnerlänkar och visar ett urval av leverantörer.</p>
      </div>
      <nav aria-label='Om Sänk Kostnaden'>
        <Link href='/sa-jamfor-vi/'>Så jämför vi</Link>
        <Link href='/affiliate/'>Affiliateinformation</Link>
        <Link href='/om/'>Om sajten</Link>
        <Link href='/integritet/'>Integritet</Link>
        <Link href='/cookies/'>Cookiepolicy</Link>
        <a href='mailto:kontakt@sankkostnaden.se'>Kontakt</a>
      </nav>
    </div>
  </footer>;
}
