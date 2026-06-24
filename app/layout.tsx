import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { siteConfig } from '@/lib/site'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const defaultTitle = `${siteConfig.name} | Mom-first pregnancy and postpartum planning`
const ogImage = '/images/willa-og.png'
const faviconVersion = '4'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    'pregnancy',
    'postpartum',
    'motherhood',
    'birth plan',
    'postpartum care',
    'mom registry',
    'new mom support',
    'fourth trimester',
    'lactation support',
    'doula support',
  ],
  icons: {
    icon: [
      {
        url: `/favicon.ico?v=${faviconVersion}`,
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        url: `/favicon.png?v=${faviconVersion}`,
        type: 'image/png',
      },
    ],
    shortcut: [`/favicon.ico?v=${faviconVersion}`],
    apple: [
      {
        url: `/icons/icon-192.png?v=${faviconVersion}`,
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: defaultTitle,
    description: siteConfig.description,
    locale: 'en_US',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Willa mom-first pregnancy and postpartum planning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: siteConfig.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#4f5d3d',
  width: 'device-width',
  initialScale: 1,
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[#fbf7ef] text-[#211f1b]">
        {children}
      </body>
    </html>
  )
}