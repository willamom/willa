import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

const publicRoutes = new Set([
  '/',
  '/privacy',
  '/terms',
  '/cookies',
  '/disclaimer',
])

const publicPrefixes = [
  '/_next',
  '/images',
  '/icons',
  '/admin',
]

const publicFiles = [
  '/favicon.ico',
  '/favicon.png',
  '/manifest.webmanifest',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isComingSoonMode = process.env.COMING_SOON_MODE === 'true'

  const isPublicPrefix = publicPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  )

  const isPublicFile = publicFiles.includes(pathname)
  const isPublicRoute = publicRoutes.has(pathname)

  if (
    isComingSoonMode &&
    !isPublicRoute &&
    !isPublicPrefix &&
    !isPublicFile
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}