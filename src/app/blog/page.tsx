import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { BlogExplorer } from '@/components/blog-explorer'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { blogPosts } from '@/data/blog'
import { site } from '@/data/site'
import { createMetadata } from '@/lib/metadata'
import { BlogPageContent } from '@/components/localized-blog-page'
import { breadcrumbSchema, itemListSchema, webPageSchema } from '@/lib/schema'

const seoTitle = 'Marketing, web i event vodiči za Crnu Goru'
const seoDescription = 'Praktični vodiči Sindikat Studio 83 o digitalnom marketingu, Meta i Google kampanjama, webu, SEO-u, aktivacijama, događajima i sadržaju u Crnoj Gori.'

export const metadata: Metadata = createMetadata({
  title: seoTitle,
  description: seoDescription,
  path: '/blog/',
})

export default function BlogPage(){return <BlogPageContent locale="sr" />}
