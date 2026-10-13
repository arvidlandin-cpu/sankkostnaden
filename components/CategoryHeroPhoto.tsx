/**
 * P0H: render an actual browser-loaded responsive image, not solely a CSS
 * background fetched asynchronously. Decorative visual; not partner content.
 * CSS gradient sits above this image, and the CSS background remains fallback.
 */
type Category='bredband'|'el'|'mobil'|'forsakring'|'ekonomi';
const sources:Record<Category,string>={
 bredband:'4008771',el:'3875141',mobil:'5901387',forsakring:'28949489',ekonomi:'6964105'
};
export default function CategoryHeroPhoto({category}:{category:Category}){
 const id=sources[category];
 const base=['https://images.pexels.com/photos',id,'pexels-photo-'+id+'.jpeg'].join('/')+'?auto=compress&cs=tinysrgb&fit=crop';
 return <img
   src={base+'&w=1600'}
   srcSet={base+'&w=700 700w, '+base+'&w=1100 1100w, '+base+'&w=1600 1600w, '+base+'&w=2400 2400w'}
   sizes='(max-width:760px) 100vw, (max-width:1024px) 52vw, 52vw'
   loading='eager' decoding='async' fetchPriority='high' alt='' data-testid={'p0h-hero-photo-'+category}
 />;
}
