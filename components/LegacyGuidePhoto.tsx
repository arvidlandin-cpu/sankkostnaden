import styles from '../styles/LegacyJourney.module.css';
import { getCategoryArtwork } from '../lib/categoryArtwork';
type Category='bredband'|'el';
/** Secondary editorial context on desktop. Mobile prioritizes guide/tool use. */
export default function LegacyGuidePhoto({category}:{category:Category}){
  return <div className={styles.photo} aria-hidden='true'>
    <img {...getCategoryArtwork(category)} alt='' loading='eager' decoding='async' fetchPriority='high' data-testid={'legacy-photo-'+category}/>
  </div>;
}
