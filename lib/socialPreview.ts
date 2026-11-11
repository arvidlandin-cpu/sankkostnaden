type SocialPreview = { url: string; width: number; height: number; alt: string };

const origin='https://sankkostnaden.se';
const categoryImages=[
  {path:'/bredband',image:'bredband',label:'bredband'},
  {path:'/elavtal',image:'el',label:'elavtal'},
  {path:'/mobil',image:'mobil',label:'mobilabonnemang'},
  {path:'/forsakring',image:'forsakring',label:'försäkringar'},
  {path:'/ekonomi',image:'ekonomi',label:'hushållets ekonomi'},
] as const;

/** Existing owned artwork for link previews; never supplier offers or rankings.
 * Keep the two active observations' metadata exactly as published.
 */
export function getSocialPreviewImage(pathname:string):SocialPreview|null{
  const path=pathname.split(/[?#]/,1)[0].replace(/\/+$/,'')||'/';
  if(['/elavtal/kvartspris','/forsakring/hemforsakring-bostadsratt','/404','/_error','/experiments'].includes(path)||path.startsWith('/experiments/'))return null;
  const category=categoryImages.find(item=>path===item.path||path.startsWith(item.path+'/'));
  if(category)return {url:`${origin}/design/category-${category.image}.webp`,width:1280,height:853,alt:`Sänk Kostnaden – illustration för ${category.label}`};
  return {url:`${origin}/design/cost-map-home.webp`,width:1254,height:1254,alt:'Sänk Kostnaden – illustration av ett hem och hushållets kostnader'};
}
