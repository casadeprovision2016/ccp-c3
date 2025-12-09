import { verifyJwt } from '@/lib/auth/jwt'
import { NextResponse, type NextRequest } from 'next/server'

type JwtUser = {
  userId: string
  email: string
  role?: string
}

async function getJwtUser(token: string | undefined): Promise<JwtUser | null> {
  if (!token) return null
  const payload = await verifyJwt(token)
  return payload as unknown as JwtUser
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const token = request.cookies.get('session')?.value
  const jwtUser = await getJwtUser(token)
  const user = jwtUser

  if (!user && request.nextUrl.pathname.startsWith('/panel')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/panel'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/panel/:path*',
    '/login',
  ],
}
