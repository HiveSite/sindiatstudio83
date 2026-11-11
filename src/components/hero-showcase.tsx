'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const slides = [
  { src: '/images/demo-hero/slide-01.webp', alt: 'Event i brend iskustva - kreativni vizual Sindikat Studio 83', title: 'Event & experience' },
  { src: '/images/demo-hero/slide-02.webp', alt: 'Produkcija događaja u kinematografskom Sindikat stilu', title: 'Produkcija događaja' },
  { src: '/images/demo-hero/slide-03.webp', alt: 'Kreativna ekipa na produkciji - Sindikat Studio 83', title: 'Creative crew' },
  { src: '/images/demo-hero/slide-04.webp', alt: 'Brend iskustva i kampanjska aktivacija - Sindikat', title: 'Brand experiences' },
  { src: '/images/demo-hero/slide-05.webp', alt: 'Foto i video produkcija kreativnog studija', title: 'Foto i video produkcija' },
  { src: '/images/demo-hero/slide-06.webp', alt: 'Operativna koordinacija događaja i produkcije', title: 'Event operations' },
  { src: '/images/demo-hero/slide-07.webp', alt: 'Strategija i rad kreativnog tima', title: 'Strategija i tim' },
  { src: '/images/demo-hero/slide-08.webp', alt: 'Digitalna produkcija i kreativna kampanja', title: 'Digital & creative' },
  { src: '/images/demo-hero/slide-09.webp', alt: 'Digitalni proizvod i produkcija sadržaja', title: 'Product & content' },
  { src: '/images/demo-hero/slide-10.webp', alt: 'Aktivacija i produkcija projekta', title: 'Aktivacije i produkcija' },
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
    <div className="hero-photo-showcase" aria-label="Kreativni hero vizuali Sindikat Studio 83">
      <div className="hero-photo-viewport">
        <Image key={slide.src} className="hero-photo-image" src={slide.src} alt={slide.alt}
          fill sizes="100vw"
          priority={active === 0} loading={active === 0 ? 'eager' : 'lazy'} />
        <div className="hero-photo-label" aria-live="off"><span>Sindikat kreativni vizuali</span><strong>{slide.title}</strong></div>
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
