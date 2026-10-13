import styles from '../styles/LegacyJourney.module.css';
type Category='bredband'|'el';
/* Reuse the source-vetted everyday photos already shown in modern editorial guides.
   A real responsive image replaces the old generic #7019025 CSS background. */
const ids:Record<Category,string>={bredband:'4260743',el:'8055828'};
export default function LegacyGuidePhoto({category}:{category:Category}){
  const id=ids[category];
  const src='https://images.pexels.com/photos/'+id+'/pexels-photo-'+id+'.jpeg?auto=compress&cs=tinysrgb&fit=crop';
  return <>
    <div className={styles.photo} aria-hidden='true'>
      <img src={src+'&w=1600'} srcSet={src+'&w=640 640w, '+src+'&w=1000 1000w, '+src+'&w=1600 1600w, '+src+'&w=2000 2000w'} sizes='(max-width:760px) 100vw, 60vw' alt='' loading='eager' decoding='async' fetchPriority='high' data-testid={'legacy-photo-'+category}/>
    </div>
    <div className={styles.photoWash} aria-hidden='true'/>
  </>;
}
