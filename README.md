# Plano de Migração: Supabase → Cloudflare D1 + Workers

## 📋 Resumo Executivo

Migrar a aplicação Next.js de **Supabase Auth + PostgreSQL** para **Cloudflare D1 + Workers** com autenticação própria usando JWT.

### Stack Atual
- **Auth**: Supabase Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- **Database**: PostgreSQL via Supabase (9 tabelas + RLS policies)
- **Deploy**: Cloudflare Workers via `opennextjs-cloudflare`

### Stack Destino
- **Auth**: JWT + bcrypt (self-hosted no Worker)
- **Database**: Cloudflare D1 (SQLite)
- **Session**: Cookies HTTP-only com JWT
- **Deploy**: Cloudflare Workers (mantém `opennextjs-cloudflare`)

---

## 📊 Análise do Sistema Atual

### Arquivos que Usam Supabase

| Arquivo | Uso | Criticidade |
|---------|-----|-------------|
| `src/middleware.ts` | Auth check, proteção de rotas | 🔴 Alta |
| `src/lib/supabase/client.ts` | Cliente browser | 🔴 Alta |
| `src/lib/supabase/server.ts` | Cliente server | 🔴 Alta |
| `src/hooks/use-auth.ts` | Hook de autenticação | 🔴 Alta |
| `src/app/(public)/login/page.tsx` | Página de login | 🔴 Alta |
| `src/app/(public)/page.tsx` | Homepage (SSR queries) | 🟡 Média |
| `src/lib/queries/*.ts` | Queries de dados (8 arquivos) | 🟡 Média |

### Esquema do Banco de Dados (9 tabelas)

```
profiles (auth-linked)    → users (nova tabela auth)
members                   → members (migrar direto)
visitors                  → visitors (migrar direto)
events                    → events (migrar direto)
ministries                → ministries (migrar direto)
ministry_members          → ministry_members (migrar direto)
donations                 → donations (migrar direto)
pastoral_visits           → pastoral_visits (migrar direto)
streams                   → streams (migrar direto)
```

---

## 🚀 Fases da Migração

### Fase 1: Preparação do Ambiente (1-2 dias)

#### 1.1 Instalar Dependências
```bash
pnpm add hono jose bcryptjs nanoid
pnpm add -D @cloudflare/workers-types wrangler drizzle-kit drizzle-orm better-sqlite3
pnpm add -D @types/bcryptjs
```

#### 1.2 Configurar D1 no `wrangler.jsonc`
```jsonc
{
  // ... configuração existente
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "ccp-c3-db",
      "database_id": "YOUR_DATABASE_ID"
    }
  ],
  "vars": {
    "JWT_SECRET": "your-jwt-secret-here"
  }
}
```

#### 1.3 Criar Database D1
```bash
# Criar o database
pnpm wrangler d1 create ccp-c3-db

# Atualizar wrangler.jsonc com o database_id retornado
```

---

### Fase 2: Criar Esquema D1 (1 dia)

#### 2.1 Criar arquivo de migração D1

**Arquivo:** `migrations/0001_initial_schema.sql`

```sql
-- Tabela de usuários (substitui profiles + auth.users)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'leader', 'member')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de sessões
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de membros
CREATE TABLE members (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  birth_date TEXT,
  baptism_date TEXT,
  membership_date TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'transferred')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de visitantes
CREATE TABLE visitors (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  visit_date TEXT NOT NULL,
  source TEXT,
  interested_in TEXT, -- JSON array as string
  notes TEXT,
  followed_up INTEGER DEFAULT 0,
  follow_up_needed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de eventos
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,
  end_date TEXT,
  location TEXT,
  event_type TEXT CHECK (event_type IN ('service', 'conference', 'outreach', 'meeting', 'other')),
  image_url TEXT,
  status TEXT CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')) DEFAULT 'scheduled',
  follow_up_needed INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de ministerios
CREATE TABLE ministries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id TEXT REFERENCES members(id),
  meeting_schedule TEXT,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de miembros de ministerios
CREATE TABLE ministry_members (
  ministry_id TEXT REFERENCES ministries(id) ON DELETE CASCADE,
  member_id TEXT REFERENCES members(id) ON DELETE CASCADE,
  joined_date TEXT DEFAULT (date('now')),
  role TEXT,
  PRIMARY KEY (ministry_id, member_id)
);

-- Tabela de donaciones
CREATE TABLE donations (
  id TEXT PRIMARY KEY,
  donor_name TEXT,
  amount REAL NOT NULL,
  donation_type TEXT CHECK (donation_type IN ('tithe', 'offering', 'mission', 'building', 'other')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'transfer', 'pix', 'card', 'other')),
  donation_date TEXT NOT NULL,
  notes TEXT,
  receipt_number TEXT UNIQUE,
  follow_up_needed INTEGER DEFAULT 0,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de visitas pastorales
CREATE TABLE pastoral_visits (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id),
  visitor_id TEXT REFERENCES visitors(id),
  visit_date TEXT NOT NULL,
  visit_type TEXT CHECK (visit_type IN ('home', 'hospital', 'counseling', 'other')),
  pastor_id TEXT REFERENCES users(id),
  notes TEXT,
  follow_up_needed INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de transmisiones
CREATE TABLE streams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stream_url TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('youtube', 'facebook', 'vimeo', 'other')),
  scheduled_date TEXT NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'live', 'ended')) DEFAULT 'scheduled',
  thumbnail_url TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Índices
CREATE INDEX idx_members_birth_date ON members(birth_date);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_pastoral_visits_date ON pastoral_visits(visit_date);
CREATE INDEX idx_streams_scheduled_date ON streams(scheduled_date);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

#### 2.2 Aplicar migração
```bash
# Local
pnpm wrangler d1 execute ccp-c3-db --local --file=./migrations/0001_initial_schema.sql

# Produção
pnpm wrangler d1 execute ccp-c3-db --file=./migrations/0001_initial_schema.sql
```

---

### Fase 3: Criar Camada de Auth (2-3 dias)

#### 3.1 Estrutura de arquivos

```
src/
├── lib/
│   ├── d1/
│   │   ├── client.ts       # Cliente D1 para browser (via API routes)
│   │   └── server.ts       # Cliente D1 para server components
│   ├── auth/
│   │   ├── jwt.ts          # Funções JWT (sign, verify)
│   │   ├── password.ts     # Hash/verify de senhas
│   │   └── session.ts      # Gestão de sessões
│   └── db/
│       └── schema.ts       # Tipos TypeScript do schema
```

#### 3.2 Implementar `src/lib/auth/jwt.ts`
```typescript
import { SignJWT, jwtVerify } from 'jose'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(secret)
}

export interface JwtPayload {
  userId: string
  email: string
  role: 'admin' | 'leader' | 'member'
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
    return payload as unknown as JwtPayload
  } catch {
    return null
  }
}
```

#### 3.3 Implementar `src/lib/auth/password.ts`
```typescript
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
```

#### 3.4 Implementar `src/lib/auth/session.ts`
```typescript
import { cookies } from 'next/headers'
import { signJwt, verifyJwt, type JwtPayload } from './jwt'

const SESSION_COOKIE = 'session'

export async function createSession(payload: JwtPayload) {
  const token = await signJwt(payload)
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })
}

export async function getSession(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  
  if (!token) return null
  return verifyJwt(token)
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
```

---

### Fase 4: Criar API Routes (2 dias)

#### 4.1 API de Autenticação

**Arquivo:** `src/app/api/auth/login/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { verifyPassword } from '@/lib/auth/password'
import { createSession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  const { env } = await getCloudflareContext()
  const db = env.DB
  
  const user = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first()
  
  if (!user || !(await verifyPassword(password, user.password_hash as string))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  
  await createSession({
    userId: user.id as string,
    email: user.email as string,
    role: user.role as 'admin' | 'leader' | 'member',
  })
  
  return NextResponse.json({ success: true })
}
```

**Arquivo:** `src/app/api/auth/logout/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth/session'

export async function POST() {
  await destroySession()
  return NextResponse.json({ success: true })
}
```

**Arquivo:** `src/app/api/auth/me/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function GET() {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ user: null })
  }
  
  const { env } = await getCloudflareContext()
  const db = env.DB
  
  const user = await db
    .prepare('SELECT id, email, name, role FROM users WHERE id = ?')
    .bind(session.userId)
    .first()
  
  return NextResponse.json({ user })
}
```

#### 4.2 APIs CRUD (exemplo para donations)

**Arquivo:** `src/app/api/donations/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getSession } from '@/lib/auth/session'
import { nanoid } from 'nanoid'

export async function GET() {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { env } = await getCloudflareContext()
  const { results } = await env.DB
    .prepare('SELECT * FROM donations ORDER BY donation_date DESC')
    .all()
  
  return NextResponse.json(results)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || !['admin', 'leader'].includes(session.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const data = await request.json()
  const { env } = await getCloudflareContext()
  
  const id = nanoid()
  await env.DB
    .prepare(`
      INSERT INTO donations (id, donor_name, amount, donation_type, payment_method, donation_date, notes, receipt_number, follow_up_needed, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(id, data.donor_name, data.amount, data.donation_type, data.payment_method, data.donation_date, data.notes, data.receipt_number, data.follow_up_needed ? 1 : 0, session.userId)
    .run()
  
  return NextResponse.json({ id })
}
```

---

### Fase 5: Atualizar Middleware (1 dia)

**Arquivo:** `src/middleware.ts`
```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value
  
  let user = null
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, getJwtSecret())
      user = payload
    } catch {
      // Token inválido ou expirado
    }
  }
  
  // Proteger rotas do painel
  if (!user && request.nextUrl.pathname.startsWith('/panel')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Redirecionar usuários logados da página de login
  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/panel', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/panel/:path*', '/login'],
}
```

---

### Fase 6: Atualizar Hooks e Queries (2-3 dias)

#### 6.1 Novo `src/hooks/use-auth.ts`
```typescript
'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'leader' | 'member'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const signIn = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!res.ok) {
      return { error: 'Invalid credentials' }
    }
    
    await loadUser()
    return { error: null }
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    profile: user, // compatibilidade
    loading,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLeader: user?.role === 'leader',
  }
}
```

#### 6.2 Atualizar queries (exemplo donations)

**Arquivo:** `src/lib/queries/donations.ts`
```typescript
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export type Donation = {
  id: string
  donor_name: string | null
  amount: number
  donation_type: string | null
  payment_method: string | null
  donation_date: string
  notes: string | null
  receipt_number: string | null
  follow_up_needed: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export type DonationInsert = Omit<Donation, 'id' | 'created_at' | 'updated_at'>
export type DonationUpdate = Partial<DonationInsert>

export function useDonations() {
  return useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const res = await fetch('/api/donations')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<Donation[]>
    },
  })
}

export function useCreateDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (donation: DonationInsert) => {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation),
      })
      if (!res.ok) throw new Error('Failed to create')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}

export function useUpdateDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DonationUpdate }) => {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}

export function useDeleteDonation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] })
    },
  })
}
```

---

### Fase 7: Migração de Dados (1 dia)

#### 7.1 Script de exportação do Supabase

```bash
# Exportar dados do Supabase
pg_dump --data-only --format=plain \
  -h db.YOUR_PROJECT.supabase.co \
  -U postgres \
  -d postgres \
  > supabase_data.sql
```

#### 7.2 Script de importação para D1

Criar script Node.js para converter e importar:

**Arquivo:** `scripts/migrate-data.ts`
```typescript
// Script para migrar dados do PostgreSQL para D1
// Executar com: npx tsx scripts/migrate-data.ts

import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

// Mapear UUIDs antigos para nanoids novos
const idMap = new Map<string, string>()

function mapId(oldId: string): string {
  if (!idMap.has(oldId)) {
    idMap.set(oldId, nanoid())
  }
  return idMap.get(oldId)!
}

// ... lógica de conversão e inserção
```

---

### Fase 8: Testes e Validação (2-3 dias)

#### 8.1 Checklist de testes

- [ ] Login/logout funciona
- [ ] Proteção de rotas `/panel/*` funciona
- [ ] CRUD de cada entidade funciona
- [ ] Homepage carrega eventos e streams públicos
- [ ] Dashboard stats funcionam
- [ ] Roles (admin, leader, member) são respeitados

#### 8.2 Testes locais
```bash
# Iniciar dev com D1 local
pnpm wrangler d1 execute ccp-c3-db --local --file=./migrations/0001_initial_schema.sql
pnpm dev
```

---

### Fase 9: Deploy e Cleanup (1 dia)

#### 9.1 Deploy
```bash
# Aplicar migrations em produção
pnpm wrangler d1 execute ccp-c3-db --file=./migrations/0001_initial_schema.sql

# Deploy
pnpm deploy
```

#### 9.2 Cleanup
```bash
# Remover dependências do Supabase
pnpm remove @supabase/ssr @supabase/supabase-js

# Remover arquivos antigos
rm -rf src/lib/supabase/
rm -rf old.supabase/
```

#### 9.3 Atualizar variáveis de ambiente
- Remover `NEXT_PUBLIC_SUPABASE_URL`
- Remover `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Adicionar `JWT_SECRET` (usar `wrangler secret put JWT_SECRET`)

---

## 📁 Estrutura Final

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   └── me/route.ts
│   │   ├── donations/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── members/
│   │   ├── visitors/
│   │   ├── events/
│   │   ├── ministries/
│   │   ├── pastoral-visits/
│   │   └── streams/
│   └── ...
├── lib/
│   ├── auth/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── session.ts
│   ├── db/
│   │   └── helpers.ts
│   └── queries/
│       └── *.ts (atualizados para usar fetch)
├── hooks/
│   └── use-auth.ts (atualizado)
└── middleware.ts (atualizado)

migrations/
└── 0001_initial_schema.sql
```

---

## ⏱️ Timeline Estimada

| Fase | Descrição | Duração |
|------|-----------|---------|
| 1 | Preparação do Ambiente | 1-2 dias |
| 2 | Criar Esquema D1 | 1 dia |
| 3 | Camada de Auth | 2-3 dias |
| 4 | API Routes | 2 dias |
| 5 | Atualizar Middleware | 1 dia |
| 6 | Atualizar Hooks/Queries | 2-3 dias |
| 7 | Migração de Dados | 1 dia |
| 8 | Testes e Validação | 2-3 dias |
| 9 | Deploy e Cleanup | 1 dia |
| **Total** | | **13-17 dias** |

---

## ⚠️ Pontos de Atenção

1. **D1 é SQLite**: Não suporta arrays nativos (usar JSON strings), tipos são mais limitados
2. **Sem RLS nativo**: Implementar autorização manualmente nas API routes
3. **UUIDs → nanoid**: D1 não tem `uuid-ossp`, usar `nanoid` para IDs
4. **Triggers**: D1 não suporta triggers, atualizar `updated_at` manualmente
5. **Timestamps**: Usar strings ISO ao invés de `TIMESTAMP WITH TIME ZONE`

---

## 🔒 Segurança

- JWT com expiração de 7 dias
- Cookies `httpOnly`, `secure`, `sameSite: lax`
- Passwords com bcrypt (cost factor 12)
- Validação de roles em cada API route
- CORS configurado corretamente

---

## 📚 Referências

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [OpenNext Cloudflare Adapter](https://opennext.js.org/cloudflare)
- [Jose JWT Library](https://github.com/panva/jose)
- [Wrangler D1 Commands](https://developers.cloudflare.com/workers/wrangler/commands/#d1)
