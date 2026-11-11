'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const quickLinks = [
  { href: '/', label: 'Početna', icon: 'home' },
  { href: '/usluge/', label: 'Usluge', icon: 'grid' },
  { href: '/radovi/', label: 'Projekti', icon: 'image' },
  { href: '/usluge/#pronadji-model', label: 'Ponuda', icon: 'tag' },
  { href: '/kontakt/?izvor=mobile-nav', label: 'Upit', icon: 'send' },
] as const

function NavIcon({ name }: { name: (typeof quickLinks)[number]['icon'] }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 16-5-5L5 21" /></>,
    tag: <><path d="M20 13 13 20a2 2 0 0 1-3 0l-7-7V4a1 1 0 0 1 1-1h9l7 7a2 2 0 0 1 0 3Z" /><circle cx="8" cy="8" r="1" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></>,
  }
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export function MobileQuickNav() {
  const pathname = usePathname()
  return (
    <nav className="mobile-quick-nav" aria-label="Brza mobilna navigacija">
      {quickLinks.map((item) => {
        const base = item.href.split(/[?#]/)[0]
        const active = item.href === '/' ? pathname === '/' : item.icon === 'tag' ? false : pathname === base || pathname.startsWith(base)
        return (
          <Link
            key={item.label}
            className={'mobile-quick-link' + (active ? ' is-current' : '') + (item.icon === 'send' ? ' is-lead' : '')}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            data-track={item.icon === 'send' ? 'mobile_nav_lead' : undefined}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
