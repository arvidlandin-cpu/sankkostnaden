import { getCategoryArtwork, type ArtworkCategory } from '../lib/categoryArtwork';
/** A category-specific decorative scene. Parent wrapper is aria-hidden. */
export default function CategoryHeroPhoto({category}:{category:ArtworkCategory}){
 const artwork=getCategoryArtwork(category);
 return <img
   {...artwork}
   loading='eager' decoding='async' fetchPriority='high' alt=''
   data-category={category} data-testid={'p0h-hero-photo-'+category}
 />;
}
