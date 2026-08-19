'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { CaseStudy, CaseStudyImage, CaseStudyMedia } from '@/types/content'
import styles from './case-media.module.css'

const coverImageOverrides: Record<string, CaseStudyImage> = {
  'imaposla-digitalni-proizvod': {
    src: '/images/cases/imaposla/imaposla-firme-poslodavci.webp',
    alt: 'ImaPosla.me prikaz radnika, firmi i profila na platformi za poslove u Crnoj Gori',
    width: 360,
    height: 260,
    position: 'center',
  },
  'sistem-za-terenske-angazmane': {
    src: '/images/cases/promo-timovi/tim.webp',
    alt: 'Kompletan promo i event tim na lokaciji tokom terenskog angažmana',
    width: 1800,
    height: 1200,
    position: 'center',
  },
  'aktivacije-regulisanih-brendova': {
    src: '/images/cases/regulisane-aktivacije/postavka.webp',
    alt: 'Kompletna brendirana postavka za promociju brenda pića u ugostiteljstvu',
    width: 1800,
    height: 1200,
    position: 'center',
  },
  'privatni-i-korporativni-dogadjaji': {
    src: '/images/cases/dogadjaji/postavka.webp',
    alt: 'Završena postavka prostora za privatni ili korporativni događaj',
    width: 1800,
    height: 1200,
    position: 'center',
  },
  'student-connect-mini-festival': {
    src: '/images/cases/student-connect/prostor.webp',
    alt: 'Glavni prostor i vizuelni identitet Student Connect programa',
    width: 1800,
    height: 1200,
    position: 'center',
  },
  'kucica-na-podgorickom-pazaru': {
    src: '/images/cases/podgoricki-pazar/kucica.webp',
    alt: 'Kompletna Sindikat kućica i vizuelna postavka na Podgoričkom pazaru',
    width: 1800,
    height: 1200,
    position: 'center',
  },
}

const mediaImageOverrides: Record<string, CaseStudyImage> = {
  'Naslovna stranica, pretraga i glavni korisnički izbori': {
    src: '/images/cases/imaposla/imaposla-pocetna-platforma-poslovi.webp',
    alt: 'ImaPosla.me desktop prikaz platforme za poslove i angažmane',
    width: 360,
    height: 260,
  },
  'Lista oglasa i detalj pojedinačne pozicije': {
    src: '/images/cases/imaposla/imaposla-oglasi-za-posao.webp',
    alt: 'ImaPosla.me prikaz oglasa i pronalaska posla',
    width: 270,
    height: 360,
  },
  'Brzi angažmani, profili radnika i usluge': {
    src: '/images/cases/imaposla/imaposla-brzi-angazmani.webp',
    alt: 'ImaPosla.me desktop prikaz brzih angažmana i kratkih poslova',
    width: 360,
    height: 262,
  },
  'Mobilno iskustvo platforme i prijavni tok': {
    src: '/images/cases/imaposla/imaposla-kategorije-poslova.webp',
    alt: 'ImaPosla.me mobilni prikaz kategorija i pretrage poslova',
    width: 166,
    height: 360,
  },
  'Kompletan promo ili event tim na lokaciji': {
    src: '/images/cases/promo-timovi/tim.webp',
    alt: 'Kompletan promo ili event tim na lokaciji',
    width: 1800,
    height: 1200,
  },
  'Briefing, priprema i podjela odgovornosti': {
    src: '/images/cases/promo-timovi/briefing.webp',
    alt: 'Briefing i priprema promo tima prije angažmana',
    width: 1800,
    height: 1200,
  },
  'Realizacija kroz više pozicija ili lokacija': {
    src: '/images/cases/promo-timovi/realizacija.webp',
    alt: 'Promo tim tokom terenske realizacije na lokaciji',
    width: 1800,
    height: 1200,
  },
  'Logistika, supervizija i operativno izvještavanje': {
    src: '/images/cases/promo-timovi/logistika.webp',
    alt: 'Logistika, supervizija i koordinacija promo tima',
    width: 1800,
    height: 1200,
  },
  'Kompletna brendirana postavka na lokaciji': {
    src: '/images/cases/regulisane-aktivacije/postavka.webp',
    alt: 'Kompletna brendirana postavka promocije na lokaciji',
    width: 1800,
    height: 1200,
  },
  'Promo tim, uniforme i priprema prije smjene': {
    src: '/images/cases/regulisane-aktivacije/tim.webp',
    alt: 'Promo tim, uniforme i priprema prije realizacije',
    width: 1800,
    height: 1200,
  },
  'Realizacija i komunikacija u prostoru': {
    src: '/images/cases/regulisane-aktivacije/realizacija.webp',
    alt: 'Realizacija promocije brenda u ugostiteljskom prostoru',
    width: 1800,
    height: 1200,
  },
  'Detalji postavke i završni dokaz standarda': {
    src: '/images/cases/regulisane-aktivacije/detalj.webp',
    alt: 'Detalji brendirane postavke i standarda realizacije',
    width: 1800,
    height: 1200,
  },
  'Završena postavka prostora prije dolaska gostiju': {
    src: '/images/cases/dogadjaji/postavka.webp',
    alt: 'Završena postavka prostora prije dolaska gostiju',
    width: 1800,
    height: 1200,
  },
  'DJ, program, bar ili tehnička realizacija': {
    src: '/images/cases/dogadjaji/program-tehnika.webp',
    alt: 'Program i tehnička realizacija događaja',
    width: 1800,
    height: 1200,
  },
  'Atmosfera, tok gostiju i ključni momenti': {
    src: '/images/cases/dogadjaji/atmosfera.webp',
    alt: 'Atmosfera i gosti tokom događaja',
    width: 1800,
    height: 1200,
  },
  'Tim, backstage i koordinacija iza scene': {
    src: '/images/cases/dogadjaji/backstage.webp',
    alt: 'Organizacioni tim i backstage koordinacija događaja',
    width: 1800,
    height: 1200,
  },
  'Glavni prostor i vizuelni identitet festivala': {
    src: '/images/cases/student-connect/prostor.webp',
    alt: 'Glavni prostor i vizuelni identitet Student Connect programa',
    width: 1800,
    height: 1200,
  },
  'Radionica, predavanje ili interaktivni sadržaj': {
    src: '/images/cases/student-connect/radionica.webp',
    alt: 'Radionica ili predavanje u okviru Student Connect programa',
    width: 1800,
    height: 1200,
  },
  'Studenti, povezivanje i atmosfera između programa': {
    src: '/images/cases/student-connect/atmosfera.webp',
    alt: 'Studenti i atmosfera tokom Student Connect programa',
    width: 1800,
    height: 1200,
  },
  'Organizacioni tim i realizacija iza scene': {
    src: '/images/cases/student-connect/tim.webp',
    alt: 'Organizacioni tim Student Connect programa iza scene',
    width: 1800,
    height: 1200,
  },
  'Kompletna kućica i vizuelna postavka u prostoru Pazara': {
    src: '/images/cases/podgoricki-pazar/kucica.webp',
    alt: 'Kompletna kućica i vizuelna postavka na Podgoričkom pazaru',
    width: 1800,
    height: 1200,
  },
  'Brending, detalji prostora i digitalni meni': {
    src: '/images/cases/podgoricki-pazar/detalji.webp',
    alt: 'Brending, detalji prostora i digitalni meni kućice',
    width: 1800,
    height: 1200,
  },
  'Atmosfera, posjetioci i tok kroz različite termine': {
    src: '/images/cases/podgoricki-pazar/atmosfera.webp',
    alt: 'Atmosfera i posjetioci na Podgoričkom pazaru',
    width: 1800,
    height: 1200,
  },
  'Tim, program i svakodnevna operativa na lokaciji': {
    src: '/images/cases/podgoricki-pazar/tim.webp',
    alt: 'Tim i svakodnevna operativa Sindikat kućice',
    width: 1800,
    height: 1200,
  },
}

const extraMediaOverrides: Record<string, CaseStudyImage[]> = {
  'Mobilno iskustvo platforme i prijavni tok': [
    {
      src: '/images/cases/imaposla/imaposla-usluge-marketplace.webp',
      alt: 'ImaPosla.me mobilni prikaz usluga i ponuda',
      width: 165,
      height: 360,
    },
  ],
}

function imageStyle(image: CaseStudyImage): CSSProperties {
  return image.position ? { objectPosition: image.position } : {}
}

function MediaFigure({
  item,
  image,
  aspect,
  onError,
}: {
  item: CaseStudyMedia
  image: CaseStudyImage
  aspect?: string
  onError?: () => void
}) {
  const resolvedAspect = aspect || item.aspect || 'landscape'

  return (
    <figure
      className={`case-media-placeholder ${styles.mediaItem}${item.kind === 'Screenshot' ? ` ${styles.screenshot}` : ''}`}
      data-aspect={resolvedAspect}
      aria-label={item.label}
    >
      <div className={styles.mediaFrame}>
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          style={imageStyle(image)}
          onError={onError}
        />
      </div>
    </figure>
  )
}

export function CaseCoverPlaceholder({ item, large = false }: { item: CaseStudy; large?: boolean }) {
  const candidate = item.coverImage || coverImageOverrides[item.slug]
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const image = candidate && candidate.src !== failedSrc ? candidate : undefined
  const showOverlay = !image || !large

  return (
    <div
      className={`case-visual case-visual-${item.slug}${large ? ' case-visual-large' : ''}${image ? ` ${styles.coverWithImage}` : ''}`}
    >
      {image ? (
        <img
          className={`${styles.coverImage}${large ? ` ${styles.fullCoverImage}` : ''}`}
          src={image.src}
          alt={image.alt}
          loading={large ? 'eager' : 'lazy'}
          decoding="async"
          style={imageStyle(image)}
          onError={() => setFailedSrc(image.src)}
        />
      ) : null}

      {image && !large ? <span className={styles.coverShade} aria-hidden="true" /> : null}

      {showOverlay ? (
        <>
          <div className="case-cover-copy">
            <span>{item.type}</span>
            <strong>{item.coverMark}</strong>
            <small>{item.coverLabel}</small>
          </div>
          <div className="case-orbit" aria-hidden="true" />
        </>
      ) : null}
    </div>
  )
}

export function CaseMediaPlaceholder({ item }: { item: CaseStudyMedia }) {
  const candidate = item.image || mediaImageOverrides[item.label]
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const image = candidate && candidate.src !== failedSrc ? candidate : undefined
  if (!image) return null

  const extras = extraMediaOverrides[item.label] || []

  return (
    <>
      <MediaFigure item={item} image={image} onError={() => setFailedSrc(image.src)} />
      {extras.map((extra, index) => (
        <MediaFigure key={`${item.label}-${index}`} item={item} image={extra} aspect="portrait" />
      ))}
    </>
  )
}
