import Link from 'next/link'
import {site} from '@/data/site'
import {localeHref,translate,type SiteLocale} from '@/lib/locale'
export function ThankYouPageContent({locale='sr'}:{locale?:SiteLocale}){
 const t=(sr:string,en:string)=>translate(locale,sr,en)
 const href=(path:string)=>localeHref(locale,path)
 return <section className="section"><div className="container center">
  <span className="eyebrow">{t('Upit je evidentiran','Enquiry received')}</span>
  <h1>{t('Hvala. Sada pregledamo kontekst, ne samo poruku.','Thank you. We will review the context, not just the message.')}</h1>
  <p className="lead">{t('Provjerićemo cilj, rok, lokaciju, postojeće materijale i uslugu ili industriju iz koje je upit poslat.','We will review the objective, timeline, location, existing materials and the service or industry your enquiry relates to.')} {t(site.responseTime,'We respond within one business day.')}</p>
  <div className="button-row" style={{justifyContent:'center',marginTop:28}}>
   <Link className="button button-primary" href={href('/radovi/')}>{t('Pogledaj projekte','Explore projects')}</Link>
   <Link className="button button-ghost" href={href('/usluge/')}>{t('Pregled usluga','Explore services')}</Link>
  </div>
 </div></section>
}
