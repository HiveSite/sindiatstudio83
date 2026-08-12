import type { CSSProperties } from 'react'
import type { CaseStudy, CaseStudyImage, CaseStudyMedia } from '@/types/content'
import styles from './case-media.module.css'

const coverImageOverrides: Record<string, CaseStudyImage> = {
  'imaposla-digitalni-proizvod': {
    src: '/images/cases/imaposla/imaposla-firme-poslodavci.webp',
    alt: 'ImaPosla.me prikaz pretrage osoba i firmi za posao u Crnoj Gori',
    width: 1307,
    height: 945,
    position: 'center',
  },
}

const mediaImageOverrides: Record<string, CaseStudyImage> = {
  'Naslovna stranica, pretraga i glavni korisnički izbori': {
    src: '/images/cases/imaposla/imaposla-pocetna-platforma-poslovi.webp',
    alt: 'ImaPosla.me početna stranica sa firmama i brzim angažmanima',
    width: 1304,
    height: 943,
  },
  'Lista oglasa i detalj pojedinačne pozicije': {
    src: '/images/cases/imaposla/imaposla-oglasi-za-posao.webp',
    alt: 'ImaPosla.me prikaz oglasa i kratkih poslova sa jasnim terminom',
    width: 510,
    height: 681,
  },
  'Brzi angažmani, profili radnika i usluge': {
    src: '/images/cases/imaposla/imaposla-brzi-angazmani.webp',
    alt: 'ImaPosla.me desktop prikaz brzih angažmana i kratkih poslova',
    width: 1294,
    height: 940,
  },
  'Mobilno iskustvo platforme i prijavni tok': {
    src: '/images/cases/imaposla/imaposla-kategorije-poslova.webp',
    alt: 'ImaPosla.me mobilni prikaz pretrage i kategorija poslova',
    width: 395,
    height: 858,
  },
}

const extraMediaOverrides: Record<string, CaseStudyImage[]> = {
  'Mobilno iskustvo platforme i prijavni tok': [
    {
      src: '/images/cases/imaposla/imaposla-usluge-marketplace.webp',
      alt: 'ImaPosla.me mobilni prikaz usluga, proizvoda i filtera',
      width: 390,
      height: 850,
    },
  ],
}

function imageStyle(image: CaseStudyImage): CSSProperties {
  return image.position ? { objectPosition: image.position } : {}
}

function mediaFrameStyle(item: CaseStudyMedia, image: CaseStudyImage): CSSProperties | undefined {
  if (item.kind !== 'Screenshot') return undefined
  return { aspectRatio: `${image.width} / ${image.height}` }
}

function MediaFigure({
  item,
  image,
  aspect,
}: {
  item: CaseStudyMedia
  image: CaseStudyImage
  aspect?: string
}) {
  const resolvedAspect = aspect || item.aspect || 'landscape'

  return (
    <figure
      className={`case-media-placeholder ${styles.mediaItem}${item.kind === 'Screenshot' ? ` ${styles.screenshot}` : ''}`}
      data-aspect={resolvedAspect}
      aria-label={item.label}
    >
      <div className={styles.mediaFrame} style={mediaFrameStyle(item, image)}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          style={imageStyle(image)}
        />
      </div>
    </figure>
  )
}

export function CaseCoverPlaceholder({ item, large = false }: { item: CaseStudy; large?: boolean }) {
  const image = item.coverImage || coverImageOverrides[item.slug]
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
          width={image.width}
          height={image.height}
          loading={large ? 'eager' : 'lazy'}
          decoding="async"
          style={imageStyle(image)}
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
  const image = item.image || mediaImageOverrides[item.label]
  if (!image) return null

  const extras = extraMediaOverrides[item.label] || []

  return (
    <>
      <MediaFigure item={item} image={image} />
      {extras.map((extra, index) => (
        <MediaFigure key={`${item.label}-${index}`} item={item} image={extra} aspect="portrait" />
      ))}
    </>
  )
}
