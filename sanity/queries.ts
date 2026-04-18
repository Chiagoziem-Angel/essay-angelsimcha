import { groq } from 'next-sanity'

export const allEssaysQuery = groq`
  *[_type == "essay"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    readTime,
    externalUrl,
    featured
  }
`

export const featuredEssayQuery = groq`
  *[_type == "essay" && featured == true] | order(publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    readTime,
    externalUrl
  }
`

export const essayBySlugQuery = groq`
  *[_type == "essay" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    category,
    excerpt,
    readTime,
    externalUrl,
    body
  }
`

export const allSlugsQuery = groq`
  *[_type == "essay"]{ "slug": slug.current }
`