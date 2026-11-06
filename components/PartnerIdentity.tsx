import { useEffect, useRef, useState } from 'react';
import type { ActivePartner } from '../lib/partners';
import s from '../styles/PartnerIdentity.module.css';

// All fragments share one cache revision; refresh it when atlas bytes change.
const atlasRevision='4434f31810c4';

type Brand={src:string;width:number;height:number;raster:boolean;background?:string};
// Original artwork and source provenance live in one cached SVG image atlas.
// View fragments preserve each logo independently; the atlas is not a JS payload.
const partnerBrands:Record<string,Brand>={
"Vattenfall": {
    "src": "/partner-brands.svg#brand-17",
    "width": 170.0787,
    "height": 56.6929,
    "raster": false
  },
  "E.ON": {
    "src": "/partner-brands.svg#brand-18",
    "width": 96.0,
    "height": 28.0,
    "raster": false
  },
  "Dalakraft": {
    "src": "/partner-brands.svg#brand-19",
    "width": 246,
    "height": 98,
    "raster": true
  },
  "Telinet Energi": {
    "src": "/partner-brands.svg#brand-20",
    "width": 600.0,
    "height": 81.70212765957447,
    "raster": true
  },
  "Vimla": {
    "src": "/partner-brands.svg#brand-21",
    "width": 255.0,
    "height": 74.0,
    "raster": false
  },
  "Tre": {
    "src": "/partner-brands.svg#brand-22",
    "width": 448,
    "height": 448,
    "raster": true
  },
  "Nestor Mobil": {
    "src": "/partner-brands.svg#brand-23",
    "width": 475,
    "height": 200,
    "raster": true
  },
  "Tellus Mobil": {
    "src": "/partner-brands.svg#brand-24",
    "width": 124,
    "height": 80,
    "raster": true,
    "background": "#112b45"
  },
  "Sveland Djurförsäkring": {
    "src": "/partner-brands.svg#brand-25",
    "width": 600.0,
    "height": 244.93505480360417,
    "raster": false
  },
  "Lassie": {
    "src": "/partner-brands.svg#brand-26",
    "width": 104.0,
    "height": 26.0,
    "raster": false
  },
  "ERGO Försäkring": {
    "src": "/partner-brands.svg#brand-27",
    "width": 139.8,
    "height": 40.9,
    "raster": false
  },
  "Insurello": {
    "src": "/partner-brands.svg#brand-28",
    "width": 600.0,
    "height": 123.6328125,
    "raster": true
  },
  "Svedea": {
    "src": "/partner-brands.svg#brand-29",
    "width": 351.0,
    "height": 70.7,
    "raster": false,
    "background": "#112b45"
  },
  "Telia": {
    "src": "/partner-brands.svg#brand-30",
    "width": 82.0,
    "height": 32.0,
    "raster": false
  },
  "Tele2": {
    "src": "/partner-brands.svg#brand-31",
    "width": 401.4,
    "height": 150.0,
    "raster": false
  },
  "Fortum": {
    "src": "/partner-brands.svg#brand-32",
    "width": 103.0,
    "height": 24.0,
    "raster": false
  },
  "Kärnfull Energi": {
    "src": "/partner-brands.svg#brand-33",
    "width": 88.0,
    "height": 17.0,
    "raster": false
  },
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
  const maxHeight=large?56:44;
  const maxWidth=brand&&brand.raster?Math.min(large?220:174,brand.width):(large?220:174);
  const background=showImage?(brand.background||(appearance==='on-dark'?'#fff':undefined)):undefined;
  return <span className={[s.identity,large?s.large:''].filter(Boolean).join(' ')} data-brand-name={partner.name}
    style={{color:'inherit',gap:0,minHeight:showImage?maxHeight:undefined,...(background?{background,padding:'9px 12px',borderRadius:9}:null)}}>
    {showImage&&<img ref={image} src={brand.src.replace('.svg#',`.svg?v=${atlasRevision}#`)} alt='' aria-hidden='true' width={Math.round(Math.min(maxWidth,maxHeight*brand.width/brand.height))} height={Math.round(Math.min(maxHeight,maxWidth*brand.height/brand.width))} decoding='async'
      data-testid='partner-original-logo' onError={()=>setFailedSource(brand.src)}
      style={{display:'block',width:Math.min(maxWidth,maxHeight*brand.width/brand.height),maxWidth:'100%',height:'auto',aspectRatio:`${brand.width} / ${brand.height}`,maxHeight,objectFit:'fill'}}/>}
    <span className={s.name} style={showImage?{position:'absolute',width:1,height:1,margin:-1,padding:0,overflow:'hidden',clipPath:'inset(50%)',whiteSpace:'nowrap',border:0}:undefined}>{partner.name}</span>
  </span>;
}
