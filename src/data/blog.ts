import rawPosts from './blog-posts.json'
import type { BlogPost } from '@/types/content'

export const blogPosts = rawPosts as BlogPost[]
export const blogPostBySlug = Object.fromEntries(blogPosts.map((post) => [post.slug, post])) as Record<string, BlogPost>

export const categoryLabels: Record<string, string> = {
  strategija: 'Strategija',
  performance: 'Performance',
  kreative: 'Kreative',
  dogadjaji: 'Događaji',
  aktivacije: 'Aktivacije',
  seo: 'SEO',
  web: 'Web',
}
