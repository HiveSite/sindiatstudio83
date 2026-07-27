'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { navigation } from '@/data/site'

export function Header() {
  const pathname = usePathname()
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement | null>(null)

  const activeHref = navigation
    .filter((item) => normalizedPath.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  const closeMenu = (restoreFocus = false) => {
    setOpen(false)
    document.body.style.overflow = ''
    if (restoreFocus) window.requestAnimationFrame(() => toggleRef.current?.focus())
  }

  useEffect(() => {
    closeMenu(false)
  }, [pathname])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) closeMenu(true)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  const toggleMenu = () => {
    setOpen((current) => {
      const next = !current
      document.body.style.overflow = next ? 'hidden' : ''
      return next
    })
  }

  return (
    <>
      <a className="skip-link" href="#main">Preskoči na sadržaj</a>
      <header className="site-header" data-header>
        <div className="container nav-shell">
          <Link className="brand" href="/" aria-label="Sindikat Studio 83 - početna">
            <Image src="/images/brand/logo.png" width={210} height={210} priority alt="Sindikat Studio 83" />
          </Link>
          <nav className="desktop-nav" aria-label="Glavna navigacija">
            {navigation.map((item) => {
              const active = activeHref === item.href
              return <Link key={item.href} href={item.href} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>{item.label}</Link>
            })}
          </nav>
          <div className="nav-actions">
            <Link className="button button-primary button-small" href="/kontakt/?izvor=header" data-track="header_lead">Zatraži plan</Link>
            <button ref={toggleRef} className="menu-toggle" type="button" aria-label={open ? 'Zatvori meni' : 'Otvori meni'} aria-expanded={open} aria-controls="mobile-navigation" onClick={toggleMenu}>
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div id="mobile-navigation" className={`mobile-panel${open ? ' is-open' : ''}`} data-mobile-menu hidden={!open}>
          <nav aria-label="Mobilna navigacija">
            {navigation.map((item) => <Link key={item.href} href={item.href} aria-current={activeHref === item.href ? 'page' : undefined}>{item.label}</Link>)}
            <Link href="/postani-dio-tima/">Postani dio tima</Link>
          </nav>
          <Link className="button button-primary" href="/kontakt/?izvor=mobile-menu" data-track="mobile_menu_lead">Zatraži plan i procjenu</Link>
        </div>
      </header>
    </>
  )
}
