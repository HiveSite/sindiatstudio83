import type { CSSProperties } from 'react'
import type { CaseStudy, CaseStudyImage, CaseStudyMedia } from '@/types/content'
import styles from './case-media.module.css'

function imageStyle(image: CaseStudyImage): CSSProperties {
  return image.position ? { objectPosition: image.position } : {}
}

export function CaseCoverPlaceholder({ item, large = false }: { item: CaseStudy; large?: boolean }) {
  const image = item.coverImage

  return (
    <div
      className={`case-visual case-visual-${item.slug}${large ? ' case-visual-large' : ''}${image ? ` ${styles.coverWithImage}` : ''}`}
    >
      {image ? (
        <>
          <img
            className={styles.coverImage}
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={large ? 'eager' : 'lazy'}
            decoding="async"
            style={imageStyle(image)}
          />
          <span className={styles.coverShade} aria-hidden="true" />
        </>
      ) : null}

      <div className="case-cover-copy">
        <span>{item.type}</span>
        <strong>{item.coverMark}</strong>
        <small>{item.coverLabel}</small>
      </div>

      <div className="case-orbit" aria-hidden="true" />
    </div>
  )
}

export function CaseMediaPlaceholder({ item }: { item: CaseStudyMedia }) {
  const image = item.image

  if (!image) {
    return (
      <article className="case-media-placeholder" data-aspect={item.aspect || 'landscape'}>
        <div className="case-media-placeholder-inner">
          <span>{item.kind}</span>
          <strong>{item.label}</strong>
        </div>
      </article>
    )
  }

  return (
    <figure
      className={`case-media-placeholder ${styles.mediaItem}${item.kind === 'Screenshot' ? ` ${styles.screenshot}` : ''}`}
      data-aspect={item.aspect || 'landscape'}
    >
      <div className={styles.mediaFrame}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          style={imageStyle(image)}
        />
        <span className={styles.mediaVeil} aria-hidden="true" />
      </div>
      <figcaption className={styles.mediaCaption}>
        <span>{item.kind}</span>
        <strong>{item.label}</strong>
      </figcaption>
    </figure>
  )
}
