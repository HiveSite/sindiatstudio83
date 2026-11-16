import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { FinalCta } from '@/components/final-cta'
import { JsonLd } from '@/components/json-ld'
import { SectionHeading } from '@/components/section-heading'
import { blogPostBySlug, blogPosts, categoryLabels } from '@/data/blog'
import { serviceBySlug } from '@/data/services'
import { site } from '@/data/site'
import { cleanArticleBody, plainTextFromHtml } from '@/lib/blog'
import { createMetadata } from '@/lib/metadata'
import { ArticlePageContent } from '@/components/localized-blog-article'
import { breadcrumbSchema, webPageSchema } from '@/lib/schema'

export const dynamicParams = false
export function generateStaticParams() { return blogPosts.map((post) => ({ slug: post.slug })) }

const serviceSlugByCategory: Record<string, string> = {
  performance: 'performance-marketing',
  seo: 'web-i-konverzije',
  web: 'web-i-konverzije',
  kreative: 'sadrzaj-za-kampanje',
  dogadjaji: 'aktivacije-i-eventi',
  aktivacije: 'aktivacije-i-eventi',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPostBySlug[slug]
  if (!post) return {}
  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}/`,
    image: post.cover,
    imageAlt: post.coverAlt,
    type: 'article',
    publishedTime: post.date || undefined,
    modifiedTime: post.date || undefined,
    tags: post.tags,
  })
}

export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <ArticlePageContent slug={slug} locale="sr" />}
