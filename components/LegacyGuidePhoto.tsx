import styles from '../styles/LegacyJourney.module.css';
type Category='bredband'|'el';
/** Decorative connection to the shared household cost map. Mobile prioritizes
 * the guide and its tools; the illustration adds no mandatory content band. */
export default function LegacyGuidePhoto({category}:{category:Category}){
  return <div className={styles.photo} aria-hidden='true'>
    <img src='/design/cost-map-home.webp' width={1254} height={1254} alt='' loading='eager' decoding='async' fetchPriority='high' data-testid={'legacy-photo-'+category}/>
  </div>;
}
