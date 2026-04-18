import { client } from '@/sanity/client'
import { essayBySlugQuery, allSlugsQuery } from '@/sanity/queries'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateLong } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface EssayPage {
  _id: string
  title: string
  slug: string
  publishedAt: string
  category: string
  excerpt: string
  readTime: number
  externalUrl?: string
  body: any[]
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string }[]>(allSlugsQuery)
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const essay = await client.fetch<EssayPage>(essayBySlugQuery, { slug: params.slug })
  if (!essay) return {}
  return {
    title: `${essay.title} — Angel Simcha`,
    description: essay.excerpt,
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <figure className="my-10">
        <div className="relative w-full aspect-video overflow-hidden bg-border">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ''}
            fill
            className="object-cover"
          />
        </div>
        {value.caption && (
          <figcaption className="text-center font-sans text-xs text-muted mt-3 tracking-wide">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-70 transition-opacity"
      >
        {children}
      </a>
    ),
  },
  block: {
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-ink pl-6 my-8 font-serif text-2xl font-light italic leading-relaxed text-ink/80">
        {children}
      </blockquote>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-serif text-3xl font-light mt-14 mb-4 text-ink">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif text-2xl font-light mt-10 mb-3 text-ink">{children}</h3>
    ),
  },
}

export default async function EssayPage({ params }: { params: { slug: string } }) {
  const essay = await client.fetch<EssayPage>(essayBySlugQuery, { slug: params.slug })

  if (!essay) notFound()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="px-6 md:px-12 py-8 flex items-center justify-between border-b border-border">
        <Link href="/" className="font-serif text-xl tracking-tight text-ink">
          Angel Simcha
        </Link>
        <Link
          href="/"
          className="font-sans text-sm text-muted hover:text-ink transition-colors"
        >
          ← All Essays
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-12 py-16">
        {/* Essay header */}
        <div className="mb-12">
          {essay.category && (
            <p className="category-label mb-5">{essay.category}</p>
          )}
          <h1 className="font-serif text-4xl md:text-6xl font-light leading-tight text-ink mb-6">
            {essay.title}
          </h1>
          {essay.excerpt && (
            <p className="font-sans text-lg text-muted leading-relaxed mb-8">
              {essay.excerpt}
            </p>
          )}
          <div className="flex items-center gap-6 border-t border-b border-border py-4">
            <p className="font-sans text-xs tracking-widest uppercase text-muted">
              {essay.publishedAt ? formatDateLong(essay.publishedAt) : ''}
            </p>
            {essay.readTime && (
              <p className="font-sans text-xs tracking-widest uppercase text-muted">
                {essay.readTime} min read
              </p>
            )}
            {essay.externalUrl && (
              <a
                href={essay.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs tracking-widest uppercase text-muted hover:text-ink transition-colors ml-auto"
              >
                Published externally ↗
              </a>
            )}
          </div>
        </div>

        {/* Essay body */}
        {essay.body && (
          <div className="prose prose-lg max-w-none font-sans leading-relaxed">
            <PortableText value={essay.body} components={portableTextComponents} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 md:px-12 py-8 mt-16">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-sans text-sm text-muted hover:text-ink transition-colors">
            ← Back to Essays
          </Link>
          <p className="font-serif text-sm text-muted italic">
            Angel Simcha
          </p>
        </div>
      </footer>
    </div>
  )
}