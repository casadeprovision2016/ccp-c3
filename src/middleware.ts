import { jwtVerify } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'

type JwtUser = {
  userId: string
  email: string
  role?: string
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  return secret ? new TextEncoder().encode(secret) : null
}

async function getJwtUser(token: string | undefined): Promise<JwtUser | null> {
  const secret = getJwtSecret()
  if (!token || !secret) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as JwtUser
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const jwtUser = await getJwtUser(request.cookies.get('session')?.value)
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
