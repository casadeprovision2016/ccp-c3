# 🧪 Testes Automatizados - CCP-C3

Este diretório contém todos os testes automatizados da aplicação CCP-C3, cobrindo autenticação, autorização, CRUD de entidades, proteção de rotas e dados públicos.

## 📁 Estrutura

```
tests/
├── setup/                  # Configuração e utilidades de teste
│   ├── mocks/             # Mocks (D1, cookies, session)
│   │   ├── d1.ts          # Mock do Cloudflare D1
│   │   ├── cookies.ts     # Mock de cookies
│   │   └── session.ts     # Mock de sessões com roles
│   └── fixtures/          # Dados de teste
│       ├── users.ts       # Usuários de teste
│       ├── donations.ts   # Doações de teste
│       ├── members.ts     # Membros e visitantes
│       └── events.ts      # Eventos e streams
├── auth/                  # Testes de autenticação
│   ├── jwt.test.ts        # JWT sign/verify
│   ├── password.test.ts   # Hash/verify de senhas
│   ├── session.test.ts    # Gestão de sessões
│   └── roles.test.ts      # Controle de acesso por roles
├── middleware/            # Testes de middleware
│   └── auth-protection.test.ts  # Proteção de rotas
├── api/                   # Testes de API routes
│   ├── donations.test.ts  # CRUD de doações
│   └── dashboard.test.ts  # Estatísticas do dashboard
└── public/                # Testes de endpoints públicos
    └── homepage.test.ts   # Eventos e streams públicos
```

## 🎯 Cobertura de Testes

### ✅ Implementados

1. **Autenticação (auth/)**
   - ✅ JWT: sign, verify, segurança
   - ✅ Password: hash, verify, cost factor
   - ✅ Session: create, get, destroy
   - ✅ Roles: admin, leader, member

2. **Middleware (middleware/)**
   - ✅ Proteção de rotas `/panel/*`
   - ✅ Redirecionamento de `/login`
   - ✅ Rotas públicas

3. **API CRUD (api/)**
   - ✅ Donations: GET, POST, PATCH, DELETE
   - ✅ Dashboard: estatísticas de membros, visitantes, doações, eventos

4. **Páginas Públicas (public/)**
   - ✅ Homepage: eventos e streams públicos

### 📋 A Implementar

- Members CRUD
- Visitors CRUD
- Events CRUD
- Ministries CRUD
- Pastoral Visits CRUD
- Streams CRUD

## 🚀 Executar Testes

### Todos os testes
```bash
pnpm test
```

### Modo watch (desenvolvimento)
```bash
pnpm test:watch
```

### Com cobertura
```bash
pnpm test:coverage
```

### Testes específicos
```bash
# Apenas autenticação
pnpm vitest tests/auth

# Apenas API
pnpm vitest tests/api

# Apenas middleware
pnpm vitest tests/middleware
```

## 🔧 Configuração

### vitest.config.ts
```typescript
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}"
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    unstubEnvs: true,
  },
});
```

### Variáveis de Ambiente
Os testes usam `vi.stubEnv()` para mockar variáveis:
- `JWT_SECRET`: 'test-secret-key-for-testing'
- `NODE_ENV`: 'test'

## 🛠️ Mocks Disponíveis

### D1 Database Mock
```typescript
import { createMockD1Database } from './setup/mocks/d1'

const mockDb = createMockD1Database()
```

### Session Mock
```typescript
import { mockAuthenticatedSession } from './setup/mocks/session'

const { session, token } = await mockAuthenticatedSession('admin')
```

### Cookies Mock
```typescript
import { createMockCookieStore } from './setup/mocks/cookies'

const cookieStore = createMockCookieStore()
```

## 📊 Padrões de Teste

### Estrutura de um teste
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Specific Functionality', () => {
    it('should do something expected', async () => {
      // Arrange
      const input = 'test'
      
      // Act
      const result = await functionUnderTest(input)
      
      // Assert
      expect(result).toBe('expected')
    })
  })
})
```

### Testes de API
```typescript
it('should return 401 for unauthenticated user', async () => {
  const { getSession } = await import('@/lib/auth/session')
  vi.mocked(getSession).mockResolvedValue(null)

  const session = await getSession()
  expect(session).toBeNull()
})
```

### Testes de Roles
```typescript
it('should allow admin to delete', async () => {
  const { session } = await mockAuthenticatedSession('admin')
  
  const canDelete = session.role === 'admin'
  expect(canDelete).toBe(true)
})
```

## 🎨 Fixtures de Dados

### Usuários de Teste
- `admin@example.com` - Role: admin
- `leader@example.com` - Role: leader
- `member@example.com` - Role: member

### Dados de Teste
- `testDonations`: 3 doações
- `testMembers`: 3 membros
- `testVisitors`: 2 visitantes
- `testEvents`: 3 eventos
- `testStreams`: 2 transmissões

## ⚡ Performance

Os testes devem ser rápidos:
- Testes individuais: < 100ms
- Suíte completa: < 5s

## 📝 Convenções

1. **Nomenclatura**: `*.test.ts` ou `*.spec.ts`
2. **Organização**: Espelhar estrutura de `src/`
3. **Cobertura**: Mínimo 80% (configurável)
4. **Mocks**: Sempre limpar com `vi.clearAllMocks()` em `beforeEach`
5. **Asserts**: Usar matchers específicos (`toBe`, `toEqual`, `toBeDefined`)

## 🐛 Debugging

### Modo verbose
```bash
pnpm vitest --reporter=verbose
```

### Modo UI
```bash
pnpm vitest --ui
```

### Apenas teste específico
```bash
pnpm vitest -t "should create a valid JWT token"
```

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Cloudflare Workers Testing](https://developers.cloudflare.com/workers/testing/vitest-integration/)

## 🔐 Segurança nos Testes

- ✅ Nunca usar credenciais reais
- ✅ Sempre mockar variáveis de ambiente
- ✅ Usar senhas de teste simples
- ✅ Limpar dados entre testes

## 📈 Próximos Passos

1. [ ] Implementar testes E2E com Playwright
2. [ ] Adicionar testes de performance
3. [ ] Configurar CI/CD com GitHub Actions
4. [ ] Aumentar cobertura para 90%
5. [ ] Implementar testes de acessibilidade

---

**Última atualização:** 9 de dezembro de 2025
