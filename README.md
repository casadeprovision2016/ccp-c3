# 📑 Índice de Documentação

- [Visão Geral](#visão-geral)
- [Arquitetura Atual e Destino](#arquitetura-atual-e-destino)
- [Fases da Migração](#fases-da-migração)
- [Decisões Técnicas](#decisões-técnicas)
- [Scripts de Migração](#scripts-de-migração)
- [APIs e Endpoints](#apis-e-endpoints)
- [Testes e Validação](#testes-e-validação)
- [Segurança](#segurança)
- [Pontos Críticos e Recomendações](#pontos-críticos-e-recomendações)

# Visão Geral
Breve descrição do objetivo da migração, contexto do projeto e motivação para a mudança de stack.

**Exemplo:**
> Migrar de Supabase/PostgreSQL para Cloudflare D1 + Workers para reduzir custos, aumentar performance e ter maior controle sobre autenticação e dados.

**Diagrama:**
```
Supabase/Auth/PostgreSQL
	↓
Cloudflare D1 + Workers (JWT, SQLite)
```

# Arquitetura Atual e Destino

# Arquitetura Atual

A aplicação utiliza Next.js rodando em Cloudflare Workers, com banco de dados Cloudflare D1 (SQLite) e autenticação própria baseada em JWT e bcrypt. Todas as regras de autorização são implementadas manualmente nas rotas de API. IDs são gerados com nanoid e atualizações de campos de data são feitas manualmente.

**Diagrama:**
```
Usuário → Next.js → Cloudflare Worker → D1 (SQLite)
```

| Componente         | Tecnologia/Abordagem         |
|--------------------|------------------------------|
| Auth               | JWT + bcrypt (self-hosted)   |
| Database           | Cloudflare D1 (SQLite)       |
| Sessão             | Cookies HTTP-only com JWT    |
| Deploy             | Cloudflare Workers           |
| IDs                | nanoid                       |
| Atualização datas  | Manual (sem triggers)        |
| Autorização        | Manual nas API routes        |

# Fases da Migração

**Checklist:**
- [x] Preparação do ambiente
- [x] Criação do esquema D1
- [x] Implementação da camada de Auth
- [x] Criação das API Routes
- [x] Atualização do Middleware
- [x] Atualização dos Hooks/Queries
- [x] Migração de dados
- [x] Testes e validação
- [x] Deploy e cleanup

# Decisões Técnicas

**Exemplos:**
- Uso de JWT para autenticação e sessões.
- nanoid para geração de IDs únicos, pois D1 não suporta UUID nativamente.
- Atualização manual dos campos `updated_at` devido à ausência de triggers.

# Scripts de Migração

**Exemplo de exportação:**
```bash
pg_dump --data-only --format=plain -h db.YOUR_PROJECT.supabase.co -U postgres -d postgres > supabase_data.sql
```

**Exemplo de conversão/importação:**
```typescript
import { readFileSync } from 'fs'
import { execSync } from 'child_process'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
// ... lógica de conversão e inserção
```

# APIs e Endpoints

**Exemplo de endpoint:**
```http
POST /api/auth/login
{
	"email": "user@exemplo.com",
	"password": "senha"
}
```

**Checklist de endpoints:**
- [x] /api/auth/login
- [x] /api/auth/logout
- [x] /api/auth/me
- [x] /api/donations
- [x] /api/members
- [x] /api/visitors
- [x] /api/events
- [x] /api/ministries
- [x] /api/pastoral-visits
- [x] /api/streams

# Testes e Validação

**Checklist:**
- [ ] Login/logout funciona
- [ ] Proteção de rotas `/panel/*` funciona
- [ ] CRUD de cada entidade funciona
- [ ] Homepage carrega eventos e streams públicos
- [ ] Dashboard stats funcionam
- [ ] Roles (admin, leader, member) são respeitados

**Exemplo de resultado esperado:**
> Usuário admin consegue criar, editar e deletar doações; usuário member só visualiza.

# Segurança

**Exemplo:**
- JWT com expiração de 7 dias
- Cookies `httpOnly`, `secure`, `sameSite: lax`
- Passwords com bcrypt (cost factor 12)
- Validação de roles em cada API route

# Pontos Críticos e Recomendações

**Checklist de pontos críticos:**
- [x] D1 é SQLite: arrays como JSON string
- [x] Sem RLS: autorização manual
- [x] UUIDs → nanoid
- [x] Sem triggers: atualizar `updated_at` manualmente
- [x] Timestamps: usar strings ISO

**Recomendação:**
> Validar todos os fluxos críticos após migração e documentar limitações encontradas.
# 📚 Plano de Documentação Completa

Este plano detalha como criar uma documentação clara e abrangente para todo o processo de migração Supabase → Cloudflare D1 + Workers, cobrindo arquitetura, decisões técnicas, scripts, APIs, testes e pontos críticos.

## Etapas
1. Estruturar documento principal em seções: visão geral, fases, decisões, scripts, APIs, testes, segurança.
2. Documentar arquitetura atual e destino, incluindo diagramas e tabelas comparativas.
3. Explicar cada fase do plano de migração, destacando comandos, arquivos, e mudanças relevantes.
4. Detalhar scripts de migração, exemplos de uso, e instruções para troubleshooting.
5. Listar e descrever todas as APIs, endpoints, payloads, e regras de autorização.
6. Incluir checklist de testes, cenários de validação, e exemplos de resultados esperados.
7. Documentar pontos críticos: limitações do D1, segurança, roles, e recomendações pós-migração.

## Considerações Adicionais
1. Preferir Markdown, diagramas simples e exemplos práticos.
2. Recomenda-se criar um índice navegável e links entre seções.
3. Validar clareza com usuários finais e desenvolvedores antes de finalizar.
