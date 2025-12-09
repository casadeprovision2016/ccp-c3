import { SignJWT, jwtVerify } from 'jose'
import { getCloudflareContext } from '@opennextjs/cloudflare'

type Role = 'admin' | 'leader' | 'member'

export type JwtPayload = {
  userId: string
  email: string
  name?: string
  role: Role
}

async function getJwtSecret(): Promise<Uint8Array> {
  let secret = process.env.JWT_SECRET

  if (!secret) {
    try {
      const { env } = await getCloudflareContext({ async: true })
      secret = (env as CloudflareEnv).JWT_SECRET
    } catch {
      // Ignore error if context is not available
    }
  }

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
    .sign(await getJwtSecret())
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, await getJwtSecret())
    return payload as JwtPayload
  } catch {
    return null
  }
}
