/** Shared decorative home illustration connects each category to the cost map.
 * The parent is aria-hidden; the illustration never conveys a price or offer.
 * A single local source is reused from cache across the five category hubs.
 */
type Category='bredband'|'el'|'mobil'|'forsakring'|'ekonomi';
export default function CategoryHeroPhoto({category}:{category:Category}){
 return <img
   src='/design/cost-map-home.webp'
   width={1254} height={1254}
   loading='eager' decoding='async' fetchPriority='high' alt=''
   data-category={category} data-testid={'p0h-hero-photo-'+category}
 />;
}
