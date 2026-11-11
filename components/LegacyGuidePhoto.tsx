import styles from '../styles/LegacyJourney.module.css';
import { getCategoryArtwork } from '../lib/categoryArtwork';
type Category='bredband'|'el';
// Match the existing CSS breakpoint without downloading hidden desktop art.
const mobilePlaceholder='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
/** Secondary editorial context on desktop. Mobile prioritizes guide/tool use. */
export default function LegacyGuidePhoto({category}:{category:Category}){
  return <div className={styles.photo} aria-hidden='true'>
    <picture>
      <source media='(max-width:760px)' srcSet={mobilePlaceholder}/>
      <img {...getCategoryArtwork(category)} alt='' loading='eager' decoding='async' fetchPriority='high' data-testid={'legacy-photo-'+category}/>
    </picture>
  </div>;
}
