import Link from 'next/link'
import { Fragment } from 'react'

export interface BreadcrumbItem { label: string; href: string }

export function Breadcrumbs({ items = [] }: { items?: BreadcrumbItem[] }) {
  const list = [{ label: 'Početna', href: '/' }, ...items]
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {list.map((item, index) => index === list.length - 1
        ? <span key={item.href} aria-current="page">{item.label}</span>
        : <Fragment key={item.href}><Link href={item.href}>{item.label}</Link><i>/</i></Fragment>)}
    </nav>
  )
}
