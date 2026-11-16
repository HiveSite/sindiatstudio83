import Link from 'next/link'
import { cases } from '@/data/cases'
import { services } from '@/data/services'
import { site } from '@/data/site'
import { FinalCta } from '@/components/final-cta'
import { HeroShowcase } from '@/components/hero-showcase'
import { HomeServiceDirectory, HomeProjectHighlights, HomeProcessAndFaq } from '@/components/home-sales-sections'
import { JsonLd } from '@/components/json-ld'
import { OfferChooser } from '@/components/sales-offer'
import { HomeQuickChoices, HomeIndustriesPreview } from '@/components/demo-home-choices'
import { localeHref, translate, type SiteLocale } from '@/lib/locale'
import { enServices } from '@/data/en'
import { itemListSchema, webPageSchema } from '@/lib/schema'


const seoTitle = 'Marketing agencija Podgorica - kampanje, web i događaji'
const seoDescription = 'Sindikat Studio 83 iz Podgorice kreira sadržaj, vodi digitalne kampanje, pravi sajtove i organizuje događaje i promocije širom Crne Gore.'

export function HomePageContent({locale = 'sr'}: {locale?: SiteLocale}) {
  const t = (sr: string, en: string) => translate(locale, sr, en)
  const href = (value: string) => localeHref(locale, value)
  const english = locale === 'en'
  return (
    <div className="sales-home" lang={english ? "en" : undefined}>
      <JsonLd data={[
        webPageSchema({ name: t(seoTitle,'Creative and production studio in Podgorica'), description: t(seoDescription,'Sindikat Studio 83 creates content, runs digital campaigns, builds websites and delivers events across Montenegro.'), path: english ? '/en/' : '/', image: '/images/brand/og-cover.png' }),
        itemListSchema({
          name: t('Usluge Sindikat Studio 83','Sindikat Studio 83 services'),
          path: english ? '/en/' : '/',
          items: services.map((service, i) => ({ name: english ? enServices[i]?.title || service.shortTitle : service.shortTitle, href: href(`/usluge/${service.slug}/`) })),
        }),
      ]} />

      <section className="demo-hero" aria-label={t("Sindikat Studio 83 - kreativni i produkcijski studio","Sindikat Studio 83 - creative and production studio")}>
        <div className="demo-hero-photo"><HeroShowcase /></div>
        <div className="container demo-hero-content">
          <div className="demo-hero-copy">
            <span className="eyebrow">{t('Nezavisni kreativni i produkcijski studio / Podgorica','Independent creative and production studio / Podgorica')}</span>
            <h1><span>{t('OD IDEJE','FROM AN IDEA')}</span><span>{t('DO KAMPANJE','TO A CAMPAIGN')}</span><span className="demo-hero-accent">{t('KOJA RADI.','THAT WORKS.')}</span></h1>
            <p className="lead">{t('Marketing, web, sadržaj i događaji - planiramo, kreiramo i realizujemo ono što tvom biznisu stvarno treba. Jedan tim, jasna odgovornost i konkretan dogovor.','Marketing, websites, content and events - we plan, create and deliver what your business actually needs. One team, clear ownership and a concrete plan.')}</p>
            <div className="button-row demo-hero-actions">
              <Link className="button button-primary" href={href("/kontakt/?izvor=hero")} data-track="hero_contact">{t('Zatraži ponudu ↗','Request a proposal ↗')}</Link>
              <Link className="button button-ghost" href={href("/radovi/")} data-track="hero_work">{t('Pogledaj naše radove ↗','Explore our work ↗')}</Link>
            </div>
            <div className="demo-hero-subline">{t('Podgorica · cijela Crna Gora / Jedan tim, više disciplina.','Podgorica · all of Montenegro / One team, multiple disciplines.')}</div>
          </div>
        </div>
      </section>

      <section className="proof-strip"><div className="container proof-grid"><div className="proof-intro">{t('Ideje koje smo pretvorili u konkretan posao.','Ideas put into action.')}</div>{site.proof.map((item,i) => <div className="proof-stat" key={item.value}><strong>{item.value}</strong><span>{english ? ['projects in our portfolio','collaborators and partners','people in our network'][i] || item.label : item.label}</span></div>)}</div></section>

      <HomeProjectHighlights locale={locale} />

      <section className="section buyer-entry-section" aria-labelledby="buyer-entry-title"><div className="container"><div className="home-sales-heading"><div><span className="eyebrow">{t('Tražiš konkretnu uslugu?','Looking for a specific service?')}</span><h2 id="buyer-entry-title">{t('Marketing agencija u Podgorici za posao koji želiš da završiš.','A marketing studio in Podgorica for the work you need done.')}</h2></div><p>{t('Ne moraš poznavati marketinške termine. Izaberi šta tvom poslu trenutno treba, provjeri obim usluge i pošalji kratak upit.','You do not need agency jargon. Choose what your business needs, review the scope and send a short enquiry.')}</p></div><div className="buyer-entry-grid"><Link href={href('/usluge/sadrzaj-za-kampanje/')}><strong>{t('Vođenje društvenih mreža i Reels','Social media management and Reels')}</strong><span>{t('Sadržaj, produkcija i dogovoreni plan objava','Content, production and an agreed publishing plan')} ↗</span></Link><Link href={href('/usluge/web-i-konverzije/')}><strong>{t('Izrada sajta u Podgorici','Website design in Podgorica')}</strong><span>{t('Mobilni sajtovi, landing stranice i prijavne forme','Mobile websites, landing pages and enquiry forms')} ↗</span></Link><Link href={href('/usluge/performance-marketing/')}><strong>{t('Vođenje Google i Meta oglasa','Google and Meta Ads management')}</strong><span>{t('Kampanje i mjerenje korisnih upita','Campaigns and meaningful enquiry tracking')} ↗</span></Link><Link href={href('/usluge/aktivacije-i-eventi/')}><strong>{t('Organizacija događaja i promo timovi','Event planning and promotional teams')}</strong><span>{t('Koncept, koordinacija i realizacija na terenu','Concept, coordination and on-site delivery')} ↗</span></Link></div></div></section>

      <HomeQuickChoices locale={locale} />

      <HomeServiceDirectory locale={locale} />

      <OfferChooser locale={locale} />

      <HomeProcessAndFaq locale={locale} />

      <HomeIndustriesPreview locale={locale} />

      <FinalCta locale={locale} title={t("Imaš ideju ili problem koji treba riješiti?","Have an idea or a challenge to solve?")} text={t("Napiši nam šta želiš da postigneš i kada ti treba. Predložićemo konkretnu uslugu, obim posla i sljedeći korak.","Tell us what you want to achieve and your timeline. We will recommend the right service, scope and next step.")} label={t("Pošalji brief","Send a brief")} />
    </div>
  )
}

