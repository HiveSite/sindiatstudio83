import { Breadcrumbs } from '@/components/breadcrumbs'
import { LeadForm } from '@/components/lead-form'
import { JsonLd } from '@/components/json-ld'
import { site } from '@/data/site'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'


import { translate, localeHref,type SiteLocale } from '@/lib/locale'
const seoTitle = 'Kontakt - digitalni marketing, web, eventi i promo timovi'
const seoDescription = 'Pošalji upit Sindikat Studio 83 timu iz Podgorice za digitalni marketing, web, aktivacije, događaje, sadržaj, promo timove ili recruitment kampanju u Crnoj Gori.'

export function ContactPageContent({locale='sr'}:{locale?:SiteLocale}) {
  const t=(sr:string,en:string)=>translate(locale,sr,en)
  const crumbs = [{ label: t('Kontakt','Contact'), href: localeHref(locale,'/kontakt/') }]
  return <>
    <JsonLd data={[
      breadcrumbSchema(crumbs),
      webPageSchema({ name: t(seoTitle,'Contact Sindikat Studio 83'), description: t(seoDescription,'Tell Sindikat Studio 83 about marketing, websites, content, events, promotions or recruitment projects in Montenegro.'), path: localeHref(locale,'/kontakt/'), type: 'ContactPage' }),
    ]} />
    <section className="page-hero"><div className="container"><Breadcrumbs items={crumbs} locale={locale} /><div className="page-hero-grid"><div><span className="eyebrow">{t("Kontakt","Contact")}</span><h1>{t("Reci nam šta ti treba. Javljamo se sa sljedećim korakom.","Tell us what you need. We will suggest the next step.")}</h1><p className="lead">{t("Dovoljno je da ostaviš ime, email i ukratko opišeš cilj. Za preciznu ponudu dodatne detalje možemo prikupiti kasnije.","Just leave your name, email and a short description of your goal. We can gather additional details later when preparing a precise proposal.")}</p></div><aside className="page-hero-aside"><strong>{t("Najkorisnije informacije","Most useful information")}</strong><ul><li>{t("cilj ili problem koji sada koči projekat","the goal or problem holding the project back")}</li><li>{t("rok, lokacija i važni termini","timeline, location and important dates")}</li><li>{t("postojeći sajt, kampanje, sadržaj ili partneri","existing website, campaigns, content or partners")}</li><li>{t("ko donosi odluke i ko obrađuje rezultat","who makes decisions and handles the results")}</li></ul></aside></div></div></section>

    <section className="section"><div className="container contact-layout"><aside className="contact-sidebar"><span className="eyebrow">{t("Direktan kontakt","Direct contact")}</span><h2>{t("Podgorica i cijela Crna Gora.","Podgorica and all of Montenegro.")}</h2><p>{t("Digitalne projekte možemo voditi potpuno online. Za aktivacije, promo angažmane i događaje planiramo ljude, lokacije, transport i dobavljače prema stvarnom obimu.","We can run digital projects entirely online. For activations, promotional work and events, we plan teams, locations, transport and suppliers according to the actual scope.")}</p><div className="contact-card"><strong>Email</strong><a href={`mailto:${site.email}`} data-track="email_click">{site.email}</a><p>{t("U naslov poruke stavi naziv firme ili projekta da bismo ga lakše povezali sa materijalima.","Include your company or project name in the email subject so we can match it to your materials.")}</p></div><div className="contact-card"><strong>Instagram</strong><a href={site.instagram} target="_blank" rel="noopener noreferrer" data-track="instagram_click">@sindikat_studio83</a><p>{t("Za briefove, ponude i dokumente forma ili email su pouzdaniji od direktnih poruka.","For briefs, proposals and documents, the form or email is more reliable than direct messages.")}</p></div><div className="contact-card"><strong>{t("Odgovor","Response")}</strong><p>{t(site.responseTime,'We respond within one business day.')} {t('Ako nema dovoljno informacija za procjenu, prvo šaljemo kratka konkretna pitanja umjesto generičke ponude.','If details are missing, we ask specific questions rather than sending a generic quote.')}</p></div></aside><LeadForm locale={locale === 'en' ? 'en' : 'me'} /></div></section>

    <section className="section section-dark"><div className="container split-sticky"><div className="sticky-copy"><span className="eyebrow">{t("Nakon slanja","After submitting")}</span><h2>{t("Prvo ćemo razumjeti šta ti treba.","We will first understand what you need.")}</h2><p className="lead">{t("Nećemo ti odmah ponuditi sve što radimo. Prvo ćemo pogledati cilj, rok i ono što već imaš, pa predložiti rješenje koje zaista ima smisla.","We will not immediately suggest everything we offer. First we review your goal, timeline and existing resources, then propose a solution that genuinely fits.")}</p></div><div className="step-list">{[
      ['01',t("Pregled briefa","Review the brief"),t("Provjeravamo cilj, rok, lokacije, postojeće materijale i odgovornosti koje su već definisane.","We review the objective, timeline, locations, existing materials and responsibilities already agreed.")],
      ['02',t("Pitanja koja nedostaju","Clarifying questions"),t("Pitaćemo samo ono što nam je potrebno da tačno odredimo posao, rok i cijenu.","We ask only what we need to define the work, timeline and price accurately.")],
      ['03',t("Preporučeni prvi korak","Recommended first step"),t("Predložićemo kratak razgovor, pregled postojećeg stanja ili konkretan plan, u zavisnosti od toga šta ti treba.","We may suggest a short call, review of the current situation or a practical plan, depending on your needs.")],
      ['04',t("Ponuda i početak","Proposal and kickoff"),t("Dogovaramo šta isporučujemo, koliko košta, ko je za šta odgovoran i kada počinjemo.","We agree what will be delivered, how much it costs, who is responsible and when the work begins.")],
    ].map(([number,title,text]) => <div className="step" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>
  </>
}
