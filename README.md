# Autenticação (full stack)

Monorepo com API em Node/Express e interface em Next.js: cadastro, login, JWT de acesso curto, refresh em cookie `HttpOnly` com rotação no banco, validação com Zod no back e no front.

## Requisitos

- Node.js LTS
- Portas 4000 (API) e 3000 (front) livres

## Variáveis de ambiente

| Onde | Arquivo modelo |
|------|----------------|
| API | `backend/.env` (copiar de `backend/.env.example`) |
| Front | `frontend/.env.local` (copiar de `frontend/.env.local.example`) |

No backend: `JWT_ACCESS_SECRET` com pelo menos 32 caracteres; `FRONTEND_ORIGIN` deve ser a mesma origem que você usa no navegador para abrir o Next (ex. `http://localhost:3000`). No front: `NEXT_PUBLIC_API_URL` apontando para a API (ex. `http://localhost:4000`).

A API usa `dotenv` e lê o `.env` da pasta `backend`.

## Como rodar

**Backend**

```bash
cd backend
cp .env.example .env
# edite .env
npm install
npx prisma migrate dev --name init
npm run dev
```

**Frontend**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Endpoints

| Método | Rota | Auth |
|--------|------|------|
| GET | `/api/health` | — |
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/refresh` | cookie de refresh |
| POST | `/api/auth/logout` | cookie |
| GET | `/api/me` | `Authorization: Bearer` |

Resposta de sucesso: `{ "success": true, "data": ... }`. Erro: `{ "success": false, "error": { "code", "message", "details?" } }`.

## Notas rápidas

- Senhas com Argon2id; refresh guardado como hash no SQLite (dev).
- Em produção: PostgreSQL, HTTPS, cookie `Secure`, segredos por ambiente.

## Pastas

```
proj_login/
├── backend/    # Express, Prisma, rotas em src/
└── frontend/   # Next.js App Router, src/app e src/components
```
