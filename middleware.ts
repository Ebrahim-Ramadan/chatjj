import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkAuthentication } from './app/actions'

export async function middleware(request: NextRequest) {
  // Check if user is authenticated
  // const isAuthenticated = await checkAuthentication()

  // If not authenticated and trying to access root chat, redirect to signup
  // if (!isAuthenticated && request.nextUrl.pathname === '/') {
  //   return NextResponse.redirect(new URL('/sign-up', request.url))
  // }

  // Existing about page rewrite
  if (request.nextUrl.pathname.startsWith('/about')) {
    return NextResponse.rewrite(new URL('/about-2', request.url))
  }

  // For authenticated users or other routes, continue normally
  return NextResponse.next()
}