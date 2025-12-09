---
applyTo: 'Pesquisar estrutura de testes

Read [](file:///home/felipe/dev/ccp-c3)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api)

Read [](file:///home/felipe/dev/ccp-c3/src/lib/queries)

Read [](file:///home/felipe/dev/ccp-c3/vitest.config.ts)

Read [](file:///home/felipe/dev/ccp-c3/vitest.setup.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/middleware.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/hooks/use-auth.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/types/database.ts#1-1), lines 1 to 200

Searched for files matching `**/*.test.ts`, no matches

Searched for files matching `**/*.spec.ts`, no matches

Read [](file:///home/felipe/dev/ccp-c3/src/lib/auth)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/auth)

Read [](file:///home/felipe/dev/ccp-c3/src/types/database.ts#200-200), lines 200 to 400

Searched for regex `\.test\.|\.spec\.`, no results

Read [](file:///home/felipe/dev/ccp-c3/src/types/database.ts#400-400), lines 400 to 596

Read [](file:///home/felipe/dev/ccp-c3/src/lib/auth/session.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/lib/auth/jwt.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/lib/auth/password.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/auth/login)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/auth/me)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/members)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/events)

Read [](file:///home/felipe/dev/ccp-c3/src/components/chart.test.tsx#1-1), lines 1 to 50

Read [](file:///home/felipe/dev/ccp-c3/src/components/chart.test.tsx#50-50), lines 50 to 91

Read [](file:///home/felipe/dev/ccp-c3/src/lib/queries/members.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/auth/login/route.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/auth/me/route.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/app/api/members/route.ts)

Read [](file:///home/felipe/dev/ccp-c3/package.json#1-1), lines 1 to 50

Read [](file:///home/felipe/dev/ccp-c3/package.json#50-50), lines 50 to 101

Read [](file:///home/felipe/dev/ccp-c3/src/lib/db/client.ts)

Read [](file:///home/felipe/dev/ccp-c3/src/lib/db)

Agora vou elaborar o planejamento detalhado para implementar os testes automatizados.

## 📋 Plano de Implementação de Testes Automatizados

### Resumo
Implementar testes automatizados na pasta `./tests/` cobrindo: autenticação, proteção de rotas, CRUD de entidades, homepage pública, dashboard stats e restrições de roles. O projeto usa Vitest com jsdom, @testing-library/react e atualmente tem apenas 1 arquivo de teste.

---

### 1. Testes de Login/Logout

| Aspecto | Detalhes |
|---------|----------|
| **Tipo** | Unitário + Integração |
| **Arquivos** | `tests/auth/login.test.ts`, `tests/auth/logout.test.ts`, `tests/auth/session.test.ts` |
| **Dependências** | Mock de D1, mock de cookies |

**Casos principais:**
- Login com credenciais válidas retorna sucesso e seta cookie
- Login com email inexistente retorna 401
- Login com senha incorreta retorna 401
- Login com campos vazios retorna erro de validação
- Logout remove cookie de sessão
- `/api/auth/me` retorna usuário autenticado
- `/api/auth/me` retorna null sem sessão

**Critérios de sucesso:**
- Cookie JWT criado com `httpOnly`, `secure`, `sameSite: lax`
- Token expira em 7 dias
- Sessão destruída após logout

---

### 2. Proteção de Rotas `/panel/*`

| Aspecto | Detalhes |
|---------|----------|
| **Tipo** | Integração |
| **Arquivos** | `tests/middleware/auth-protection.test.ts` |
| **Dependências** | Mock de NextRequest/NextResponse |

**Casos principais:**
- Usuário não autenticado em `/panel/*` redireciona para `/login`
- Usuário autenticado em `/panel/*` passa normalmente
- Usuário autenticado em `/login` redireciona para `/panel`
- Token expirado redireciona para `/login`
- Token inválido redireciona para `/login`

**Critérios de sucesso:**
- Redirect 302 para `/login` quando não autenticado
- Redirect 302 para `/panel` quando já logado em `/login`
- `NextResponse.next()` para usuários válidos

---

### 3. CRUD de Entidades

| Aspecto | Detalhes |
|---------|----------|
| **Tipo** | Integração |
| **Arquivos** | `tests/api/donations.test.ts`, `tests/api/members.test.ts`, `tests/api/visitors.test.ts`, `tests/api/events.test.ts`, `tests/api/ministries.test.ts`, `tests/api/pastoral-visits.test.ts`, `tests/api/streams.test.ts` |
| **Dependências** | Mock de D1, mock de sessão |

**Casos principais (para cada entidade):**
- **GET** lista todos os registros
- **POST** cria novo registro com dados válidos
- **POST** rejeita dados inválidos/incompletos
- **GET /:id** retorna registro específico
- **PATCH /:id** atualiza registro existente
- **DELETE /:id** remove registro
- Operações sem autenticação retornam 401
- Operações sem permissão retornam 403

**Critérios de sucesso:**
- Status codes corretos (200, 201, 400, 401, 403, 404)
- Dados persistidos corretamente no D1
- Campos `created_at` e `updated_at` preenchidos
- IDs gerados com nanoid

---

### 4. Homepage Carrega Eventos e Streams Públicos

| Aspecto | Detalhes |
|---------|----------|
| **Tipo** | Integração + E2E (opcional) |
| **Arquivos** | `tests/public/homepage.test.ts`, `tests/components/home/EventsSection.test.tsx`, `tests/components/home/LiveStreamSection.test.tsx` |
| **Dependências** | Mock de D1, @testing-library/react |

**Casos principais:**
- API pública de eventos retorna eventos agendados
- API pública de streams retorna streams ao vivo/agendados
- Componente `EventsSection` renderiza lista de eventos
- Componente `LiveStreamSection` renderiza stream ativo
- Homepage renderiza sem erros quando não há dados
- Eventos passados não são exibidos
- Streams com status `ended` não são exibidos

**Critérios de sucesso:**
- Eventos ordenados por data
- Streams ao vivo têm destaque visual
- Componentes renderizam sem quebrar com dados vazios

---

### 5. Dashboard Stats

| Aspecto | Detalhes |
|---------|----------|
| **Tipo** | Unitário + Integração |
| **Arquivos** | `tests/api/dashboard.test.ts`, `tests/queries/dashboard.test.ts` |
| **Dependências** | Mock de D1 |

**Casos principais:**
- Contagem total de membros ativos
- Contagem total de visitantes
- Soma de doações do mês atual
- Contagem de eventos agendados
- Contagem de follow-ups pendentes
- Aniversariantes do mês

**Critérios de sucesso:**
- Números calculados corretamente
- Filtros de data aplicados (mês atual, próximos eventos)
- Performance aceitável (< 500ms)

---

### 6. Restrições de Roles

| Aspecto | Detalhes |
|---------|----------|
| **Tipo** | Integração |
| **Arquivos** | `tests/auth/roles.test.ts`, `tests/api/authorization.test.ts` |
| **Dependências** | Mock de sessão com diferentes roles |

**Casos principais por role:**
- **admin**: Acesso total a todas as operações CRUD
- **leader**: Acesso a leitura e criação, edição limitada
- **member**: Apenas leitura de dados públicos/próprios

**Cenários específicos:**
- Admin pode criar/editar/deletar doações
- Leader pode criar doações mas não deletar
- Member não pode acessar `/api/donations`
- Member pode ver próprios dados em `/api/auth/me`
- Tentativa de acesso não autorizado retorna 403

**Critérios de sucesso:**
- Cada role tem permissões corretas
- Roles verificados em todas as API routes
- Mensagens de erro claras para acesso negado

---

### 📁 Estrutura de Pastas Proposta

```
tests/
├── setup/
│   ├── mocks/
│   │   ├── d1.ts           # Mock do Cloudflare D1
│   │   ├── cookies.ts      # Mock de cookies
│   │   └── session.ts      # Mock de sessões com roles
│   └── fixtures/
│       ├── users.ts        # Dados de usuários de teste
│       ├── donations.ts    # Dados de doações de teste
│       └── ...             # Outras fixtures
├── auth/
│   ├── login.test.ts
│   ├── logout.test.ts
│   ├── session.test.ts
│   └── roles.test.ts
├── middleware/
│   └── auth-protection.test.ts
├── api/
│   ├── donations.test.ts
│   ├── members.test.ts
│   ├── visitors.test.ts
│   ├── events.test.ts
│   ├── ministries.test.ts
│   ├── pastoral-visits.test.ts
│   ├── streams.test.ts
│   ├── dashboard.test.ts
│   └── authorization.test.ts
├── public/
│   └── homepage.test.ts
└── components/
    └── home/
        ├── EventsSection.test.tsx
        └── LiveStreamSection.test.tsx
```

---

### 📦 Dependências Adicionais Necessárias

```bash
pnpm add -D msw @cloudflare/vitest-pool-workers miniflare
```

- **msw**: Mock Service Worker para interceptar requests
- **@cloudflare/vitest-pool-workers**: Pool de workers para testes
- **miniflare**: Simulador local do Cloudflare Workers

---

### 🔧 Atualização do vitest.config.ts

```typescript
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}"  // Adicionar pasta tests/
    ],
  },
  // ...
});
```

---

### ⏱️ Estimativa de Tempo

| Etapa | Duração |
|-------|---------|
| Setup de mocks e fixtures | 1 dia |
| Testes de auth (login/logout/session) | 1 dia |
| Testes de middleware (proteção) | 0.5 dia |
| Testes de CRUD (7 entidades) | 2-3 dias |
| Testes de homepage pública | 0.5 dia |
| Testes de dashboard | 0.5 dia |
| Testes de roles | 1 dia |
| **Total** | **6-7 dias** |

---

### Considerações Adicionais

1. **Prioridade sugerida**: Auth → Roles → CRUD → Proteção de rotas → Dashboard → Homepage
2. **CI/CD**: Configurar GitHub Actions para rodar testes em cada PR
3. **Cobertura**: Usar `vitest --coverage` para monitorar cobertura mínima (80%)
4. **Dados de teste**: Usar fixtures isoladas para evitar conflitos entre testes'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.