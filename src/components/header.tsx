'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { navigation, site } from '@/data/site'
import { enNavigation, enCaseSummaries } from '@/data/en'

const desktopMediaQuery = '(min-width: 1041px)'
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Header() {
  const pathname = usePathname()
  const english = pathname === '/en' || pathname.startsWith('/en/')
  const visibleNavigation = english ? enNavigation : navigation
  const toMe = english ? pathname.replace(/^\/en(?=\/|$)/, '') || '/' : pathname
  const supportedEnglish = /^\/(?:$|usluge|industrije|radovi|cijene|blog|o-nama|kontakt|privatnost|kolacici|uslovi-koriscenja|hvala)(?:\/|$)/.test(pathname)
  const unavailableEnglishCase = /^\/radovi\/([^/]+)\/?$/.exec(pathname)
  const hasEnglishCase = !unavailableEnglishCase || enCaseSummaries.some((item) => item.slug === unavailableEnglishCase[1])
  const toEn = english ? pathname : !hasEnglishCase ? '/en/radovi/' : supportedEnglish ? '/en' + (pathname === '/' ? '/' : pathname) : '/en/'
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const activeHref = visibleNavigation
    .filter((item) => normalizedPath.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  const closeMenu = (restoreFocus = false) => {
    setOpen(false)
    document.body.style.overflow = ''
    if (restoreFocus) window.requestAnimationFrame(() => toggleRef.current?.focus())
  }

  useEffect(() => {
    closeMenu(false)
    document.documentElement.lang = english ? 'en' : 'sr-Latn-ME'
  }, [pathname, english])

  useEffect(() => {
    const media = window.matchMedia(desktopMediaQuery)
    const closeOnDesktop = () => {
      if (media.matches) closeMenu(false)
    }
    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [])

  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => panel?.querySelector<HTMLElement>(focusableSelector)?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu(true)
        return
      }

      if (event.key !== 'Tab' || !panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute('hidden'))
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  const toggleMenu = () => {
    setOpen((current) => !current)
  }

  return (
    <>
      <a className="skip-link" href="#main">{english ? "Skip to content" : "Preskoči na sadržaj"}</a>
      <header className="site-header" data-header>
        <div className="container nav-shell">
          <Link className="brand" href={english ? "/en/" : "/"} aria-label={english ? "Sindikat Studio 83 - homepage" : "Sindikat Studio 83 - početna"}>
            <Image src="/images/brand/logo.png" width={210} height={210} priority alt="Sindikat Studio 83" />
          </Link>
          <nav className="desktop-nav" aria-label={english ? "Main navigation" : "Glavna navigacija"}>
            {visibleNavigation.map((item) => {
              const active = activeHref === item.href
              return <Link key={item.href} href={item.href} className={active ? 'is-active' : undefined} aria-current={active ? 'page' : undefined}>{item.label}</Link>
            })}
          </nav>
          <div className="nav-actions">
            <nav className="simple-language-nav" aria-label={english ? 'Site language' : 'Jezik sajta'}>
              <Link href={toMe} className={!english ? 'is-current' : ''} aria-current={!english ? 'page' : undefined} aria-label={english ? 'Serbian version' : 'Srpska verzija'}>ME</Link>
              <span aria-hidden="true">/</span>
              <Link href={toEn} className={english ? 'is-current' : ''} aria-current={english ? 'page' : undefined} aria-label={english ? 'English version' : 'Engleska verzija'}>EN</Link>
            </nav>
            <Link className="button button-primary button-small" href={english ? "/en/kontakt/?izvor=header" : "/kontakt/?izvor=header"} data-track="header_lead">{english ? "Request a proposal" : "Pošalji upit"}</Link>
            <button ref={toggleRef} className="menu-toggle" type="button" aria-label={open ? (english ? 'Close menu' : 'Zatvori meni') : (english ? 'Open menu' : 'Otvori meni')} aria-expanded={open} aria-controls="mobile-navigation" onClick={toggleMenu}>
              <span /><span /><span />
            </button>
          </div>
        </div>
        <div
          ref={panelRef}
          id="mobile-navigation"
          className={`mobile-panel${open ? ' is-open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label={english ? "Mobile navigation" : "Mobilna navigacija"}
          hidden={!open}
        >
          <nav aria-label={english ? "Mobile navigation" : "Mobilna navigacija"}>
            {visibleNavigation.map((item) => <Link key={item.href} href={item.href} aria-current={activeHref === item.href ? 'page' : undefined}>{item.label}</Link>)}
            <a href={site.imaposla} data-track="imaposla_team_click">{english ? "Join the team" : "Postani dio tima"}</a>
          </nav>
          <Link className="button button-primary" href={english ? "/en/kontakt/?izvor=mobile-menu" : "/kontakt/?izvor=mobile-menu"} data-track="mobile_menu_lead">{english ? "Send enquiry" : "Pošalji upit"}</Link>
        </div>
      </header>
      <button className="mobile-menu-scrim" type="button" aria-label={english ? "Close menu" : "Zatvori meni"} tabIndex={-1} hidden={!open} onClick={() => closeMenu(true)} />
    </>
  )
}
