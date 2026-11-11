'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const slides = [
  { src: '/images/cases/promo-timovi/tim.webp', alt: 'Sindikat promo tim tokom realizacije događaja', title: 'Ljudi i realizacija' },
  { src: '/images/cases/battlebots-arena/battlebots-finalna-arena-i-publika.webp', alt: 'BattleBots Arena, finalna arena i publika', title: 'Event produkcija' },
  { src: '/images/cases/student-connect/prostor.webp', alt: 'Student Connect, prostor događaja', title: 'Kreativni događaji' },
  { src: '/images/cases/podgoricki-pazar/kucica.webp', alt: 'Sindikat kućica na Podgoričkom pazaru', title: 'Brend iskustva' },
  { src: '/images/cases/mini-sajtovi-i-digitalni-alati/mini-sajtovi-cover.webp', alt: 'Web i digitalni projekti Sindikata', title: 'Web i digital' },
] as const

export function HeroShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (paused || reduced.matches || document.visibilityState === 'hidden') return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') setActive((current) => (current + 1) % slides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [paused])

  const slide = slides[active]
  return (
    <div className="hero-photo-showcase" aria-label="Fotografije iz projekata Sindikat Studio 83">
      <div className="hero-photo-viewport">
        <Image key={slide.src} className="hero-photo-image" src={slide.src} alt={slide.alt}
          fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 90vw, 48vw"
          priority={active === 0} loading={active === 0 ? 'eager' : 'lazy'} />
        <div className="hero-photo-label" aria-live="off"><span>Stvarni projekti</span><strong>{slide.title}</strong></div>
      </div>
      <div className="hero-photo-controls">
        <span className="hero-photo-counter">{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <div className="hero-photo-dots" aria-label="Izaberi fotografiju">
          {slides.map((item, index) => <button key={item.src} type="button"
            className={index === active ? 'is-active' : ''} aria-label={`Prikaži fotografiju ${index + 1}: ${item.title}`}
            aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)} />)}
        </div>
        <button className="hero-photo-pause" type="button" aria-label={paused ? 'Pokreni rotaciju' : 'Pauziraj rotaciju'} onClick={() => setPaused((current) => !current)}>
          {paused ? 'Pokreni' : 'Pauza'}
        </button>
      </div>
    </div>
  )
}
