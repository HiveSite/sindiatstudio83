'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { navigation, site } from '@/data/site'
import { enNavigation } from '@/data/en'

const desktopMediaQuery = '(min-width: 1041px)'
const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Header() {
  const pathname = usePathname()
  const english = pathname === '/en' || pathname.startsWith('/en/')
  const visibleNavigation = english ? enNavigation : navigation
  const toMe = english ? pathname.replace(/^\/en(?=\/|$)/, '') || '/' : pathname
  const supportedEnglish = /^\/(?:$|usluge|industrije|radovi|cijene|blog|o-nama|kontakt|privatnost|kolacici|uslovi-koriscenja|hvala)(?:\/|$)/.test(pathname)
  const toEn = english ? pathname : supportedEnglish ? '/en' + (pathname === '/' ? '/' : pathname) : '/en/'
  const normalizedPath = pathname.endsWith('/') ? pathname : `${pathname}/`
  const [open, setOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageRef = useRef<HTMLDivElement | null>(null)
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
    setLanguageOpen(false)
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

  useEffect(() => {
    if (!languageOpen) return

    const closeLanguageMenu = (event: MouseEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false)
    }
    const closeLanguageMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLanguageOpen(false)
    }

    document.addEventListener('mousedown', closeLanguageMenu)
    window.addEventListener('keydown', closeLanguageMenuOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeLanguageMenu)
      window.removeEventListener('keydown', closeLanguageMenuOnEscape)
    }
  }, [languageOpen])

  const toggleMenu = () => {
    setLanguageOpen(false)
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
            <div ref={languageRef} className={`language-switcher${languageOpen ? ' is-open' : ''}`}>
              <button
                className="language-switcher-button"
                type="button"
                aria-label={english ? "Choose language" : "Izaberi jezik"}
                aria-haspopup="menu"
                aria-expanded={languageOpen}
                aria-controls="language-menu"
                onClick={() => setLanguageOpen((current) => !current)}
              >
                <svg className="language-switcher-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3.5 12h17M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21M12 3C9.6 5.4 8.4 8.4 8.4 12s1.2 6.6 3.6 9" />
                </svg>
                <span className="language-switcher-code">{english ? "EN" : "ME"}</span>
                <span className="language-switcher-chevron" aria-hidden="true" />
              </button>
              <div id="language-menu" className="language-switcher-menu" role="menu" hidden={!languageOpen}>
                <Link href={toMe} className={english ? 'language-option' : 'language-option is-active'} role="menuitem" aria-current={!english ? 'page' : undefined} onClick={() => setLanguageOpen(false)}>
                  <span className="language-option-code">ME</span>
                  <span><strong>Srpski - ijekavica</strong><small>{english ? 'Serbian, Ijekavian' : 'Aktivni jezik'}</small></span>
                  {!english ? <span className="language-option-check" aria-hidden="true">✓</span> : null}
                </Link>
                <Link href={toEn} className={english ? 'language-option is-active' : 'language-option'} role="menuitem" aria-current={english ? 'page' : undefined} onClick={() => setLanguageOpen(false)}>
                  <span className="language-option-code">EN</span>
                  <span><strong>English</strong><small>{english ? 'Current language' : 'English version'}</small></span>
                  {english ? <span className="language-option-check" aria-hidden="true">✓</span> : null}
                </Link>
              </div>
            </div>
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
          <Link className="button button-primary" href={english ? "/en/kontakt/?izvor=mobile-menu" : "/kontakt/?izvor=mobile-menu"} data-track="mobile_menu_lead">Pošalji upit</Link>
        </div>
      </header>
      <button className="mobile-menu-scrim" type="button" aria-label={english ? "Close menu" : "Zatvori meni"} tabIndex={-1} hidden={!open} onClick={() => closeMenu(true)} />
    </>
  )
}
