import { SignJWT, jwtVerify } from 'jose'

type Role = 'admin' | 'leader' | 'member'

export type JwtPayload = {
  userId: string
  email: string
  name?: string
  role: Role
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return new TextEncoder().encode(secret)
}

export async function signJwt(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret())
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    return payload as JwtPayload
  } catch {
    return null
  }
}
