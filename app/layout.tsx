import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Angel Simcha — Essays',
  description:
    'Essays and publications on AI, EdTech, and Product Leadership by Chiagoziem Angel Nwafor.',
  openGraph: {
    title: 'Angel Simcha — Essays',
    description: 'AI EdTech & Product Leader',
    url: 'https://essay.angelsimcha.com',
    siteName: 'Angel Simcha',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans bg-page text-ink`}>
        {children}
      </body>
    </html>
  )
}