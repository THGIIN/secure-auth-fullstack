# Secure Auth — Full Stack

Monorepo de referência para **autenticação com JWT de curta duração**, **refresh token em cookie `HttpOnly`** com **rotação persistida no banco**, **hash de senhas com Argon2id** e **validação compartilhada (Zod)** no backend e no frontend. A API é **Express + Prisma**; a interface é **Next.js (App Router)** com formulários tipados.

---

## Sumário

- [O que este projeto faz](#o-que-este-projeto-faz)
- [Arquitetura em alto nível](#arquitetura-em-alto-nível)
- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Configuração (variáveis de ambiente)](#configuração-variáveis-de-ambiente)
- [Como executar em desenvolvimento](#como-executar-em-desenvolvimento)
- [Scripts úteis](#scripts-úteis)
- [API HTTP](#api-http)
- [Contrato de respostas](#contrato-de-respostas)
- [Segurança e produção](#segurança-e-produção)

---

## O que este projeto faz

| Área | Comportamento |
|------|----------------|
| **Cadastro e login** | Email e senha; senha nunca armazenada em texto puro. |
| **Acesso à API** | Token JWT de acesso (curto) enviado pelo cliente, tipicamente no header `Authorization: Bearer`. |
| **Sessão prolongada** | Refresh token emitido em cookie `HttpOnly` (não acessível ao JavaScript da página), com rotação e revogação no banco. |
| **Dados** | Desenvolvimento com **SQLite** via Prisma; o modelo permite evoluir para **PostgreSQL** em produção. |

Fluxo resumido: o usuário faz login → recebe access token (resposta) + refresh (cookie) → o front usa o access token nas requisições → antes de expirar, ou após 401, o cliente pode chamar refresh para obter novo par sem expor o refresh no `localStorage`.

---

## Arquitetura em alto nível

```
┌─────────────────┐     HTTPS / HTTP (dev)      ┌─────────────────┐
│  Next.js        │  JWT (Bearer) + cookies     │  Express API    │
│  (porta 3000)   │ ──────────────────────────► │  (porta 4000)   │
│  Zod + RHF      │     credenciais: true       │  Helmet, CORS   │
└─────────────────┘                             └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │  Prisma + DB    │
                                                │  (SQLite dev)   │
                                                └─────────────────┘
```

- **CORS** está configurado com `credentials: true` e origem definida por `FRONTEND_ORIGIN`, alinhada ao URL do Next no navegador.
- **Helmet** reforça cabeçalhos HTTP; o payload JSON tem limite explícito (`100kb`).

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| **API** | Node.js, Express, TypeScript (`tsx` em dev), Prisma, Argon2, `jsonwebtoken`, Zod, `cookie-parser`, Helmet, CORS |
| **Web** | Next.js 15, React 19, TypeScript, Tailwind CSS, React Hook Form, Zod, Radix UI (slots), Sonner (toasts) |
| **Banco (dev)** | SQLite (`file:./dev.db` no exemplo) |

---

## Pré-requisitos

- **Node.js** na versão **LTS** (recomendado)
- Portas **3000** (frontend) e **4000** (API) livres, ou ajuste `PORT` / URL no `.env`

---

## Estrutura do repositório

```
secure-auth-fullstack/
├── backend/                 # API REST
│   ├── prisma/              # schema e migrações
│   └── src/                 # app Express, rotas, middleware
└── frontend/                # Next.js (App Router)
    └── src/
        ├── app/             # páginas e layouts
        └── components/      # UI reutilizável
```

---

## Configuração (variáveis de ambiente)

| Onde | Arquivo | Modelo |
|------|---------|--------|
| API | `backend/.env` | `backend/.env.example` |
| Front | `frontend/.env.local` | `frontend/.env.local.example` |

### Backend (`backend/.env`)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL do banco Prisma (ex.: SQLite `file:./dev.db`). |
| `NODE_ENV` | Ambiente (`development` / `production`). |
| `PORT` | Porta da API (padrão de exemplo: `4000`). |
| `FRONTEND_ORIGIN` | Origem exata do Next no navegador (ex.: `http://localhost:3000`). Deve coincidir com a origem das requisições do browser por causa do CORS com credenciais. |
| `JWT_ACCESS_SECRET` | Segredo para assinar o JWT de acesso — **mínimo 32 caracteres** em cenários reais; use valor aleatório forte. |
| `ACCESS_TOKEN_EXPIRES_IN` | TTL do access token (ex.: `15m`). |
| `REFRESH_TOKEN_EXPIRES_DAYS` | Validade do refresh (ex.: `7`). |
| `REFRESH_COOKIE_NAME` | Nome do cookie HttpOnly do refresh (ex.: `refresh_token`). |

A API carrega variáveis com **`dotenv`** a partir da pasta `backend`.

### Frontend (`frontend/.env.local`)

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API acessível no browser (ex.: `http://localhost:4000`). Prefixo `NEXT_PUBLIC_` expõe o valor ao código client-side do Next. |

---

## Como executar em desenvolvimento

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edite .env (JWT_ACCESS_SECRET, FRONTEND_ORIGIN, etc.)
npm install
npx prisma migrate dev --name init
npm run dev
```

A API sobe em `http://localhost:4000` (ou na porta definida em `PORT`).

### 2. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.local.example .env.local
# Confirme NEXT_PUBLIC_API_URL
npm install
npm run dev
```

Abra `http://localhost:3000` no navegador.

**Ordem recomendada:** subir o backend antes de testar login/refresh no front, para evitar erros de rede e CORS difíceis de interpretar.

---

## Scripts úteis

**Backend** (`backend/package.json`):

| Script | Função |
|--------|--------|
| `npm run dev` | Servidor com reload (`tsx watch`). |
| `npm run build` | Compila TypeScript para `dist/`. |
| `npm start` | Executa `node dist/server.js` (após `build`). |
| `npm run db:generate` | `prisma generate`. |
| `npm run db:migrate` | `prisma migrate dev`. |
| `npm run db:push` | `prisma db push` (útil em prototipagem). |

**Frontend** (`frontend/package.json`):

| Script | Função |
|--------|--------|
| `npm run dev` | Next.js em modo desenvolvimento. |
| `npm run build` | Build de produção. |
| `npm start` | Serve o build de produção. |
| `npm run lint` | ESLint (Next). |

---

## API HTTP

| Método | Rota | Autenticação |
|--------|------|----------------|
| `GET` | `/api/health` | Não requer |
| `POST` | `/api/auth/register` | Não requer |
| `POST` | `/api/auth/login` | Não requer |
| `POST` | `/api/auth/refresh` | Cookie de refresh |
| `POST` | `/api/auth/logout` | Cookie de refresh |
| `GET` | `/api/me` | Header `Authorization: Bearer <access_token>` |

Rotas sob `/api/auth` e `/api/me` implementam o fluxo descrito na [seção “O que este projeto faz”](#o-que-este-projeto-faz).

---

## Contrato de respostas

Respostas JSON seguem um envelope consistente:

- **Sucesso:** `{ "success": true, "data": ... }`
- **Erro:** `{ "success": false, "error": { "code": string, "message": string, "details?": unknown } }`

Isso facilita tratamento uniforme no cliente (toasts, redirecionamento, etc.).

---

## Segurança e produção

Este repositório é adequado para **desenvolvimento e estudo**. Para **produção**, considere pelo menos:

- **HTTPS** em toda a comunicação; cookies de refresh com flag **`Secure`**.
- **Banco gerenciado** (ex.: PostgreSQL) e segredos (`JWT_ACCESS_SECRET`, URL do banco) injetados por **variáveis de ambiente** ou secret manager — nunca commitados.
- Revisão de tempos de expiração do access e refresh, política de **logout** e **revogação** de tokens.
- Monitoramento, limitação de taxa (rate limiting) e endurecimento adicional conforme seu threat model.

---

## Licença

Este projeto não inclui um arquivo de licença na raiz; defina uma se for distribuir ou reutilizar o código.
