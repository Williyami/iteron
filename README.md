# Iteron AI

Iteron AI is an autonomous personalization engine that acts as agentic middleware for e-commerce sites — it continuously analyzes user behavior, generates UI hypotheses, runs A/B experiments, and scales winning variants without human intervention.

## Project Structure

```
iteron-ai/
├── dashboard/        Next.js 14 control panel (TypeScript, Tailwind)
├── agents/           Python FastAPI backend (analyst + optimizer agents)
├── supabase/         Database schema and seed data
└── demo/             Demo e-book store (Lovable repo, added later)
```

## Setup

1. **Clone and configure environment**
   ```bash
   git clone <repo-url>
   cd iteron-ai
   cp .env.example .env   # already done — just fill in values
   ```

2. **Fill in `.env`** (see [Environment Variables](#environment-variables) below)

3. **Run Supabase SQL files** (in Supabase dashboard → SQL editor, in this order):
   ```
   1. supabase/schema.sql   ← creates all tables
   2. supabase/seed.sql     ← inserts demo click data
   ```

4. **Install dependencies and start**
   ```bash
   npm run setup    # installs root + dashboard dependencies
   npm run dev      # starts both dashboard (port 3000) and agents (port 8000)
   ```

## Environment Variables

| Variable | Where to get it |
|----------|----------------|
| `SUPABASE_URL` | Supabase dashboard → Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard → Project Settings → API → service_role key |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `LANGSMITH_API_KEY` | [smith.langchain.com](https://smith.langchain.com) → Settings → API Keys |
| `LANGSMITH_PROJECT` | Set to `iteron-ai` (default already in `.env.example`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as `SUPABASE_ANON_KEY` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` for local dev (default already set) |

## What's Ready vs What Needs the Demo Repo

**Ready to run now:**
- Supabase schema + seed data
- FastAPI backend stubs (health, run-loop, stream-logs, reset endpoints)
- Next.js dashboard skeleton (redirects to `/dashboard`, placeholder UI, Run Loop button)

**Needs the Lovable demo repo (drop into `demo/`):**
- Actual e-commerce storefront that reads `ui_config` from Supabase
- End-to-end personalization loop with real user traffic
