import { SignJWT, jwtVerify } from 'jose'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import crypto from 'crypto'

type Role = 'admin' | 'leader' | 'member'

export type JwtPayload = {
  userId: string
  email: string
  name?: string
  role: Role
}

async function getJwtSecret(): Promise<Uint8Array> {
  // Prefer process.env (Vitest's vi.stubEnv sets process.env), then import.meta.env, then Cloudflare context
  let secret: string | undefined = process.env.JWT_SECRET

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - import.meta may not be typed in Node environment
  if (!secret && typeof import.meta !== 'undefined' && import.meta.env) {
    secret = import.meta.env.JWT_SECRET
  }

  if (!secret) {
    try {
      const { env } = await getCloudflareContext({ async: true })
      secret = (env as CloudflareEnv).JWT_SECRET
    } catch {
      // Ignore error if context is not available
    }
  }

  if (!secret) {
    throw new Error('JWT_SECRET not set')
  }
  return new TextEncoder().encode(secret)
}

export async function signJwt(payload: JwtPayload): Promise<string> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(await getJwtSecret())
  } catch (err) {
    // Fallback for environments where 'jose' fails (e.g., test runners): create a simple HMAC-based JWT
    const header = { alg: 'HS256', typ: 'JWT' }
    const iat = Math.floor(Date.now() / 1000)
    const exp = iat + 7 * 24 * 60 * 60
    const body = { ...payload, iat, exp }

    const base64url = (input: string) =>
      Buffer.from(input)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    const headerB = base64url(JSON.stringify(header))
    const payloadB = base64url(JSON.stringify(body))
    const signingInput = `${headerB}.${payloadB}`

    const secretBytes = await getJwtSecret()
    const secret = new TextDecoder().decode(secretBytes)
    const signature = crypto.createHmac('sha256', secret).update(signingInput).digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    return `${signingInput}.${signature}`
  }
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    try {
      const { payload } = await jwtVerify(token, await getJwtSecret())
      return payload as JwtPayload
    } catch {
      // Fallback verification for simple HMAC-based tokens
      const parts = token.split('.')
      if (parts.length !== 3) return null
      const [headerB, payloadB, signature] = parts

      const signingInput = `${headerB}.${payloadB}`
      const secretBytes = await getJwtSecret()
      const secret = new TextDecoder().decode(secretBytes)
      const expectedSig = crypto.createHmac('sha256', secret).update(signingInput).digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

      if (signature !== expectedSig) return null

      const payloadJson = Buffer.from(payloadB.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
      const parsed = JSON.parse(payloadJson) as JwtPayload & { exp?: number }
      if (parsed.exp && Date.now() / 1000 > parsed.exp) return null
      return parsed as JwtPayload
    }
  } catch {
    return null
  }
}
