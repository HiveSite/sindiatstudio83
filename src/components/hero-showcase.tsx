'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const slides = [
  {src:'/images/cases/dogadjaji/backstage.webp',alt:'Produkcijska atmosfera iza scene',title:'Produkcija sadržaja'},
  {src:'/images/cases/promo-timovi/tim.webp',alt:'Sindikat promo tim na događaju',title:'Ljudi i realizacija'},
  {src:'/images/cases/battlebots-arena/battlebots-finalna-arena-i-publika.webp',alt:'BattleBots Arena sa učesnicima i publikom',title:'Event produkcija'},
  {src:'/images/cases/student-connect/prostor.webp',alt:'Prostor za Student Connect događaj',title:'Kreativni događaji'},
  {src:'/images/cases/podgoricki-pazar/atmosfera.webp',alt:'Atmosfera na Podgoričkom pazaru',title:'Brend iskustva'},
  {src:'/images/cases/dogadjaji/program-tehnika.webp',alt:'Program i tehnika događaja',title:'Tehnička realizacija'},
  {src:'/images/cases/promo-timovi/briefing.webp',alt:'Priprema i briefing promo tima',title:'Organizacija timova'},
  {src:'/images/cases/student-connect/radionica.webp',alt:'Radionica u okviru Student Connect projekta',title:'Radionice i zajednica'},
  {src:'/images/cases/battlebots-arena/battlebots-arena-produkcija-i-rasvjeta.webp',alt:'Arena i produkcijska rasvjeta',title:'Event iskustva'},
  {src:'/images/cases/mini-sajtovi-i-digitalni-alati/mini-sajtovi-cover.webp',alt:'Web i digitalni projekti Sindikata',title:'Web i digital'},
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
          fill sizes="100vw"
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
