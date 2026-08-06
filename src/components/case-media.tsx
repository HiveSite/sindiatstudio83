import type { CSSProperties } from 'react'
import type { CaseStudy, CaseStudyImage, CaseStudyMedia } from '@/types/content'
import styles from './case-media.module.css'

function imageStyle(image: CaseStudyImage): CSSProperties {
  return image.position ? { objectPosition: image.position } : {}
}

function mediaFrameStyle(item: CaseStudyMedia, image: CaseStudyImage): CSSProperties | undefined {
  if (item.kind !== 'Screenshot') return undefined
  return { aspectRatio: `${image.width} / ${image.height}` }
}

export function CaseCoverPlaceholder({ item, large = false }: { item: CaseStudy; large?: boolean }) {
  const image = item.coverImage
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
  const image = item.image
  if (!image) return null

  return (
    <figure
      className={`case-media-placeholder ${styles.mediaItem}${item.kind === 'Screenshot' ? ` ${styles.screenshot}` : ''}`}
      data-aspect={item.aspect || 'landscape'}
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
