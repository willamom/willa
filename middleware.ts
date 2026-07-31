import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

const closedBetaOpenRoutes = new Set([
  '/',
  '/privacy',
  '/terms',
  '/cookies',
  '/disclaimer',
])

const closedBetaOpenPrefixes = [
  '/providers',
  '/admin',
  '/api',
  '/auth',
  '/_next',
  '/images',
  '/icons',
]

const closedBetaOpenFiles = [
  '/favicon.ico',
  '/favicon.png',
  '/manifest.webmanifest',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
]

function isClosedBetaOpenPath(pathname: string) {
  if (closedBetaOpenRoutes.has(pathname)) return true
  if (closedBetaOpenFiles.includes(pathname)) return true

  if (closedBetaOpenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return true
  }

  return pathname.includes('.')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isClosedBetaMode =
    process.env.CLOSED_BETA_MODE === 'true' ||
    process.env.COMING_SOON_MODE === 'true'

  if (isClosedBetaMode && !isClosedBetaOpenPath(pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.search = '?closedBeta=1'

    return NextResponse.redirect(url)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}