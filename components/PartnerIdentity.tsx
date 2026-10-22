import { useEffect, useRef, useState } from 'react';
import type { ActivePartner } from '../lib/partners';
import s from '../styles/PartnerIdentity.module.css';

type Brand={src:string;width:number;height:number;raster:boolean;background?:string};
// Original artwork and source provenance live in one cached SVG image atlas.
// View fragments preserve each logo independently; the atlas is not a JS payload.
const partnerBrands:Record<string,Brand>={
  "Bredbandsval.se": {
    "src": "/partner-brands.svg#brand-0",
    "width": 228.42,
    "height": 36.04,
    "raster": false
  },
  "Fello": {
    "src": "/partner-brands.svg#brand-1",
    "width": 564.3,
    "height": 183.4,
    "raster": false
  },
  "Dina Försäkringar": {
    "src": "/partner-brands.svg#brand-2",
    "width": 225.0,
    "height": 71.93,
    "raster": false
  },
  "Elskling": {
    "src": "/partner-brands.svg#brand-4",
    "width": 523,
    "height": 128,
    "raster": true
  },
  "Compricer": {
    "src": "/partner-brands.svg#brand-5",
    "width": 155.0,
    "height": 35.0,
    "raster": false
  },
  "Chilimobil": {
    "src": "/partner-brands.svg#brand-6",
    "width": 150,
    "height": 97,
    "raster": true
  },
  "Lendella": {
    "src": "/partner-brands.svg#brand-7",
    "width": 400,
    "height": 74,
    "raster": true,
    "background": "#112b45"
  },
  "Samly": {
    "src": "/partner-brands.svg#brand-8",
    "width": 400,
    "height": 131,
    "raster": true
  },
  "Internetport": {
    "src": "/partner-brands.svg#brand-9",
    "width": 307,
    "height": 50,
    "raster": true
  },
  "Ownit": {
    "src": "/partner-brands.svg#brand-10",
    "width": 469.0,
    "height": 137.0,
    "raster": false,
    "background": "#112b45"
  },
  "Bixia": {
    "src": "/partner-brands.svg#brand-11",
    "width": 124.0,
    "height": 48.0,
    "raster": false
  },
  "Gofido": {
    "src": "/partner-brands.svg#brand-12",
    "width": 80.0,
    "height": 24.0,
    "raster": false
  },
  "Hallon": {
    "src": "/partner-brands.svg#brand-13",
    "width": 241.0,
    "height": 48.0,
    "raster": false
  },
  "Hedvig": {
    "src": "/partner-brands.svg#brand-14",
    "width": 200.0,
    "height": 54.0,
    "raster": false
  },
  "Tibber": {
    "src": "/partner-brands.svg#brand-15",
    "width": 256.0,
    "height": 73.0,
    "raster": false
  },
  "Comviq": {
    "src": "/partner-brands.svg#brand-16",
    "width": 104.0,
    "height": 24.0,
    "raster": false
  }
};

/** Original, self-contained partner artwork. A missing asset falls back to the
 * actual name, never a fabricated logo or a stretched browser favicon. */
export default function PartnerIdentity({partner,large=false,appearance='default'}:{partner:Pick<ActivePartner,'name'|'domain'>;large?:boolean;appearance?:'default'|'on-dark'}){
  const [failedSource,setFailedSource]=useState<string|null>(null);
  const image=useRef<HTMLImageElement>(null);
  const brand=partnerBrands[partner.name];
  // Resource errors can occur before React hydrates the server-rendered image.
  useEffect(()=>{
    if(brand&&image.current?.complete&&image.current.naturalWidth===0)setFailedSource(brand.src);
  },[brand?.src]);
  const showImage=brand&&failedSource!==brand.src;
  const maxHeight=large?48:36;
  const maxWidth=brand&&brand.raster?Math.min(large?220:174,brand.width/2):(large?220:174);
  const background=showImage?(brand.background||(appearance==='on-dark'?'#fff':undefined)):undefined;
  return <span className={[s.identity,large?s.large:''].filter(Boolean).join(' ')} data-brand-name={partner.name}
    style={{color:'inherit',gap:0,minHeight:showImage?maxHeight:undefined,...(background?{background,padding:'9px 12px',borderRadius:9}:null)}}>
    {showImage&&<img ref={image} src={brand.src} alt='' aria-hidden='true' width={Math.round(Math.min(maxWidth,maxHeight*brand.width/brand.height))} height={Math.round(Math.min(maxHeight,maxWidth*brand.height/brand.width))} decoding='async'
      data-testid='partner-original-logo' onError={()=>setFailedSource(brand.src)}
      style={{display:'block',width:Math.min(maxWidth,maxHeight*brand.width/brand.height),maxWidth:'100%',height:Math.min(maxHeight,maxWidth*brand.height/brand.width),maxHeight,objectFit:'fill'}}/>}
    <span className={s.name} style={showImage?{position:'absolute',width:1,height:1,margin:-1,padding:0,overflow:'hidden',clipPath:'inset(50%)',whiteSpace:'nowrap',border:0}:undefined}>{partner.name}</span>
  </span>;
}
