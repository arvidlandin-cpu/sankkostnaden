import type { ActivePartner } from '../lib/partners';
import s from '../styles/PartnerIdentity.module.css';

/** Crisp partner NAME treatment rather than stretching 16px favicons into fake logos.
 * The initial badge is our UI decoration, explicitly not a recreated corporate logo.
 * Actual partner name is always visible as selectable text.
 */
export default function PartnerIdentity({partner,large=false}:{partner:Pick<ActivePartner,'name'|'domain'>;large?:boolean}){
  const initials=partner.name.replace(/\.se$/i,'').split(/\s+/).filter(Boolean).slice(0,2).map(part=>part.charAt(0)).join('').toUpperCase();
  return <span className={[s.identity,large?s.large:''].filter(Boolean).join(' ')} data-brand-name={partner.name}>
    <span className={s.mark} aria-hidden='true'>{initials}</span>
    <span className={s.name}>{partner.name}</span>
  </span>;
}
