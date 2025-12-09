#!/usr/bin/env tsx
/**
 * Script to create the initial admin user in D1
 * Usage: npx tsx scripts/create-admin.ts
 */

import { hashPassword } from '../src/lib/auth/password'
import { nanoid } from 'nanoid'

const WRANGLER_D1_COMMAND = 'pnpm wrangler d1 execute ccp-c3-db'

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@casadeprovision.es'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const name = process.env.ADMIN_NAME || 'Administrator'

  console.log('🔐 Creating admin user...')
  console.log(`Email: ${email}`)
  console.log(`Name: ${name}`)

  const id = nanoid()
  const passwordHash = await hashPassword(password)
  const now = new Date().toISOString()

  const sql = `INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
VALUES ('${id}', '${email}', '${passwordHash}', '${name}', 'admin', '${now}', '${now}');`

  console.log('\n📝 SQL to execute:')
  console.log(sql)

  console.log('\n📋 To create this user, run:')
  console.log(`\nLocal:`)
  console.log(`${WRANGLER_D1_COMMAND} --local --command="${sql}"`)
  console.log(`\nProduction:`)
  console.log(`${WRANGLER_D1_COMMAND} --remote --command="${sql}"`)

  console.log('\n✅ Admin user details:')
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
  console.log(`\n⚠️  Remember to change the password after first login!`)
}

createAdmin().catch(console.error)
