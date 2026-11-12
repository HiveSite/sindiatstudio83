'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const slides = [
  { src: '/images/demo-hero/slide-01.webp', alt: 'Događaji i brend aktivacije - vizual Sindikat Studio 83', title: 'Događaji i doživljaji' },
  { src: '/images/demo-hero/slide-02.webp', alt: 'Produkcija događaja u kinematografskom Sindikat stilu', title: 'Produkcija događaja' },
  { src: '/images/demo-hero/slide-03.webp', alt: 'Kreativna ekipa na produkciji - Sindikat Studio 83', title: 'Kreativni tim' },
  { src: '/images/demo-hero/slide-04.webp', alt: 'Brend iskustva i kampanjska aktivacija - Sindikat', title: 'Brend aktivacije' },
  { src: '/images/demo-hero/slide-05.webp', alt: 'Foto i video produkcija kreativnog studija', title: 'Foto i video produkcija' },
  { src: '/images/demo-hero/slide-06.webp', alt: 'Operativna koordinacija događaja i produkcije', title: 'Organizacija događaja' },
  { src: '/images/demo-hero/slide-07.webp', alt: 'Strategija i rad kreativnog tima', title: 'Strategija i tim' },
  { src: '/images/demo-hero/slide-08.webp', alt: 'Digitalna produkcija i kreativna kampanja', title: 'Digital i kreativa' },
  { src: '/images/demo-hero/slide-09.webp', alt: 'Digitalni proizvod i produkcija sadržaja', title: 'Digitalni proizvodi i sadržaj' },
  { src: '/images/demo-hero/slide-10.webp', alt: 'Aktivacija i produkcija projekta', title: 'Aktivacije i produkcija' },
] as const

const englishTitles = ['Events & experiences','Event production','Creative crew','Brand experiences','Photo & video production','Event operations','Strategy & team','Digital & creative','Digital products & content','Activations & production']

export function HeroShowcase() {
  const english = usePathname().startsWith('/en')
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
    <div className="hero-photo-showcase" aria-label={english ? "Sindikat Studio 83 creative visuals" : "Kreativni hero vizuali Sindikat Studio 83"}>
      <div className="hero-photo-viewport">
        <Image key={slide.src} className="hero-photo-image" src={slide.src} alt={english ? `Sindikat Studio 83 - ${englishTitles[active]}` : slide.alt}
          fill sizes="100vw"
          priority={active === 0} loading={active === 0 ? 'eager' : 'lazy'} />
        <div className="hero-photo-label" aria-live="off"><span>{english ? 'Sindikat creative visuals' : 'Sindikat kreativni vizuali'}</span><strong>{english ? englishTitles[active] : slide.title}</strong></div>
      </div>
      <div className="hero-photo-controls">
        <output className="hero-photo-counter" aria-live="polite" aria-atomic="true" data-slide-index={active + 1} key={`count-${active}`}>{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</output>
        <div className="hero-photo-dots" aria-label={english ? "Choose an image" : "Izaberi fotografiju"}>
          {slides.map((item, index) => <button key={item.src} type="button"
            className={index === active ? 'is-active' : ''} aria-label={english ? `Show image ${index + 1}: ${englishTitles[index]}` : `Prikaži fotografiju ${index + 1}: ${item.title}`}
            aria-current={index === active ? 'true' : undefined} onClick={() => { setActive(index); setPaused(true) }} />)}
        </div>
        <button className="hero-photo-pause" type="button" aria-label={paused ? (english ? 'Resume slideshow' : 'Pokreni rotaciju') : (english ? 'Pause slideshow' : 'Pauziraj rotaciju')} onClick={() => setPaused((current) => !current)}>
          {paused ? (english ? 'Play' : 'Pokreni') : (english ? 'Pause' : 'Pauza')}
        </button>
      </div>
    </div>
  )
}
