import { client } from '@/sanity/client'
import { allEssaysQuery, featuredEssayQuery } from '@/sanity/queries'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Essay {
  _id: string
  title: string
  slug: string
  publishedAt: string
  category: string
  excerpt: string
  readTime: number
  externalUrl?: string
  featured?: boolean
}

const CATEGORIES = [
  'All',
  'AI Publications',
  'EdTech',
  'Product Leadership',
  'Competition Essays',
  'Thoughts',
]

export const revalidate = 60

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const [allEssays, featuredEssay] = await Promise.all([
    client.fetch<Essay[]>(allEssaysQuery),
    client.fetch<Essay | null>(featuredEssayQuery),
  ])

  const selectedCategory = searchParams.category || 'All'

  const filtered: Essay[] =
    selectedCategory === 'All'
      ? allEssays
      : allEssays.filter((e) => e.category === selectedCategory)

  // featured must be declared before nonFeatured
  const featured: Essay | null =
    featuredEssay &&
      (selectedCategory === 'All' || featuredEssay.category === selectedCategory)
      ? featuredEssay
      : null

  const nonFeatured: Essay[] = featured
    ? filtered.filter((e) => e._id !== featured._id)
    : filtered

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 md:px-12 py-8 flex items-center justify-between border-b border-border">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          Angel Simcha
        </Link>
        <nav className="flex items-center gap-8">
          <a
            href="https://angelsimcha.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-muted hover:text-ink transition-colors"
          >
            Home
          </a>
          <a
            href="https://linkedin.com/in/angel-nwafor"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-muted hover:text-ink transition-colors"
          >
            LinkedIn
          </a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Page intro */}
        <div className="pt-16 pb-12">
          <p className="category-label mb-4">Essays & Publications</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light leading-tight text-ink mb-4">
            Writing on AI, EdTech,
            <br />
            and what comes next.
          </h1>
          <p className="font-sans text-base text-muted max-w-lg leading-relaxed">
            Essays, competition submissions, and AI publications by Chiagoziem Angel Nwafor — CPO
            at HammetLabs.
          </p>
        </div>

        <div className="border-t border-border" />

        {/* Featured Essay */}
        {featured && (
          <div className="py-14">
            <p className="category-label mb-6">Featured — {formatDate(featured.publishedAt)}</p>
            <EssayLink essay={featured} featured />
          </div>
        )}

        {/* Category Filters */}
        <div className="border-t border-border pt-10 pb-6">
          <p className="category-label mb-5">All Essays</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/' : `/?category=${encodeURIComponent(cat)}`}
                className={`px-4 py-1.5 text-xs tracking-wide font-sans border transition-colors ${selectedCategory === cat
                    ? 'bg-ink text-page border-ink'
                    : 'bg-transparent text-muted border-border hover:border-ink hover:text-ink'
                  }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Essay List */}
        <div className="pb-20">
          {nonFeatured.length === 0 && !featured ? (
            <p className="font-sans text-muted py-12">No essays yet in this category.</p>
          ) : (
            <div>
              {nonFeatured.map((essay: Essay, i: number) => (
                <div key={essay._id}>
                  <EssayRow essay={essay} />
                  {i < nonFeatured.length - 1 && <div className="border-t border-border" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 py-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-serif text-sm text-muted italic">
            Chiagoziem Angel Nwafor · CPO, HammetLabs
          </p>
          <p className="font-sans text-xs text-muted tracking-wide">essay.angelsimcha.com</p>
        </div>
      </footer>
    </div>
  )
}

function EssayLink({ essay, featured }: { essay: Essay; featured?: boolean }) {
  const href = essay.externalUrl ? essay.externalUrl : `/essays/${essay.slug}`
  const isExternal = !!essay.externalUrl

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group block"
    >
      {essay.category && <p className="category-label mb-3">{essay.category}</p>}
      <h2
        className={`font-serif font-light leading-tight text-ink group-hover:opacity-70 transition-opacity ${featured ? 'text-4xl md:text-5xl mb-4' : 'text-3xl md:text-4xl mb-3'
          }`}
      >
        {essay.title}
        {isExternal && <span className="inline-block ml-2 text-muted text-2xl">↗</span>}
      </h2>
      {essay.excerpt && (
        <p className="font-sans text-base text-muted leading-relaxed mb-4 max-w-2xl">
          {essay.excerpt}
        </p>
      )}
      <p className="font-sans text-xs tracking-widest uppercase text-muted">
        {essay.readTime ? `${essay.readTime} min read` : ''}
        {essay.readTime && essay.publishedAt ? ' · ' : ''}
        {essay.publishedAt ? formatDate(essay.publishedAt) : ''}
      </p>
    </a>
  )
}

function EssayRow({ essay }: { essay: Essay }) {
  const href = essay.externalUrl ? essay.externalUrl : `/essays/${essay.slug}`
  const isExternal = !!essay.externalUrl

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex items-start justify-between gap-6 py-8"
    >
      <div className="flex-1 min-w-0">
        {essay.category && <p className="category-label mb-2">{essay.category}</p>}
        <h3 className="font-serif text-2xl md:text-3xl font-light leading-snug text-ink group-hover:opacity-70 transition-opacity">
          {essay.title}
          {isExternal && <span className="ml-2 text-muted">↗</span>}
        </h3>
        {essay.excerpt && (
          <p className="font-sans text-sm text-muted mt-2 leading-relaxed line-clamp-2 max-w-xl">
            {essay.excerpt}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right hidden md:block">
        <p className="font-sans text-xs tracking-widest uppercase text-muted">
          {essay.publishedAt ? formatDate(essay.publishedAt) : ''}
        </p>
        {essay.readTime && (
          <p className="font-sans text-xs text-muted mt-1">{essay.readTime} min</p>
        )}
      </div>
    </a>
  )
}