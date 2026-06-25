# TaskFlow

A **Kanban-style project** and **task management app** — FastAPI backend, React + TypeScript frontend.

## Check the deployed website [Here](https://task-flow-gules-ten.vercel.app/login)

## Video Demo:

https://github.com/user-attachments/assets/8e5cc61a-6d56-4a45-951a-8ee7b7a53885

## Project Architecture Diagram:

![TaskFlow System Architecture](./taskflow-architecture.png)

## Features

- User registration and **JWT** authentication
- Project CRUD with a dashboard overview — each project card shows task count and creation date
- Kanban board per project (To Do / In Progress / Done columns)
- **Drag-and-drop task** reordering across columns — with an optimistic UI so cards land in the new column instantly, before the server confirms
- Task fields: name, description, priority (low / medium / high), deadline
- Notes on tasks — add, view, and delete notes via a modal opened from each task card (Enter to submit, Shift+Enter for newline); note count shown directly on the task card
- Customizable motivational quote on the dashboard — editable via a modal, persisted in localStorage
- Language toggle (English / Portuguese) — auto-detected from browser locale on first visit, persisted in localStorage, all UI text updates dynamically
- **Redis caching layer** with async integration and robust connection/error handling; `fakeredis` used in pytest fixtures for isolated test runs
- RedisInsight UI for Redis database visualization
- Responsive design via CSS media queries — layout adapts for mobile devices (stacked columns, touch-friendly spacing, condensed task cards)
- Form validation on all inputs
- Empty-state and loading indicators throughout the UI
- Animated hint buttons — the "New Project" button pulses when no projects exist and the "New Task" button pulses when a board has no tasks, guiding new users toward the next action

## Tech Stack

**Backend**

- FastAPI 0.136
- SQLAlchemy 2.0 (async) + asyncpg
- Alembic (migrations)
- Pydantic v2 + pydantic-settings
- python-jose / passlib (bcrypt) — JWT auth
- redis.asyncio — async Redis client with custom `RedisRepository` (get/set/hash/TTL operations)
- fakeredis — in-memory Redis substitute for pytest fixtures
- pytest + pytest-asyncio

**Frontend**

- React 19 + Vite
- **TypeScript** — the entire `src/` tree is now `.ts` / `.tsx`, with shared domain types in `src/types/`
- **TanStack Query (React Query v5)** — server-state management: data fetching, caching, and mutations
- React Router v7
- Axios
- @dnd-kit (drag-and-drop)
- **Vitest** + **@testing-library/react** + jsdom — unit / component tests
- **MSW (Mock Service Worker)** — API mocking for the test suite
- @vitest/coverage-v8 — test coverage reports

**Infrastructure**

- PostgreSQL 16
- Redis 7 (Alpine) — caching layer
- RedisInsight — Redis GUI at `http://localhost:5540`
- Docker Compose

## Frontend architecture

The frontend was refactored from plain JavaScript + manual `useState`/`useEffect` data handling into a typed, server-state-driven codebase. **Nothing changed for the user** — the same screens, same flows — but the code is more modern, type-safe, and predictable.

### TypeScript everywhere

- Every component, page, context, and Axios client is now `.tsx` / `.ts`.
- Shared domain models live in [`src/types/`](frontend/src/types/): `task_types.ts`, `project_types.ts`, `comment_types.ts`, `auth_types.ts` — including unions like `TaskStatus` (`todo` / `in_progress` / `done`) and `TaskPriority`, plus derived types (`TaskCreate`, `TaskUpdate`) via `Omit` / `Partial`.
- Props, mutation variables, and API payloads are typed end-to-end, catching mismatches (e.g. `number` vs `string` ids) at edit time instead of at runtime.

### Server state with React Query

Manual `useEffect` fetching and local `useState` lists were replaced by [TanStack Query](https://tanstack.com/query). A single `QueryClient` is provided at the app root in [`main.tsx`](frontend/src/main.tsx).

- **`useQuery`** — fetches projects, a project's tasks, and a task's comments. Each query has a stable `queryKey` (e.g. `["tasks", projectId]`) and a `staleTime`, so already-fetched data is served from cache instead of re-hitting the API on every mount.
- **`useMutation`** — handles create / update / delete / move for tasks and comments, with `onSuccess` / `onError` / `onSettled` callbacks for feedback and reconciliation.
- **Cache invalidation** — after a mutation, `queryClient.invalidateQueries({ queryKey })` marks the affected data stale so it refetches automatically. This is why the dashboard task count and the board stay in sync without a manual page reload.
- **Optimistic updates** — dragging a task across columns writes the new status straight into the cache (`setQueryData`) in the same render flush as the drop, so the card moves instantly; `onSettled` then refetches to reconcile with the server (and rolls back on error).

### Testing (Vitest + Testing Library + MSW)

- Tests run on **Vitest** in a `jsdom` environment (configured in [`vite.config.js`](frontend/vite.config.js), globals enabled, `setupFiles: ./src/setupTests.ts`).
- **MSW** intercepts HTTP calls so components are tested against realistic, typed mock responses instead of the real backend. A Node `server` powers the suite (started/reset/closed in [`setupTests.ts`](frontend/src/setupTests.ts)); request handlers live in [`src/mocks/handlers.ts`](frontend/src/mocks/handlers.ts). A browser worker is also scaffolded for optional in-app mocking.
- Component tests live in `src/tests/` and alongside components (e.g. `TaskCard.test.tsx`), using `@testing-library/react` + `@testing-library/jest-dom`.
- Coverage is available via `@vitest/coverage-v8`.

## Project Structure

```
TaskFlow/
├── taskflow/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── redis/      # async Redis client, connection options, RedisRepository
│   │   │   │   └── ...         # config, database session, security, deps, enums
│   │   │   ├── models/         # SQLAlchemy models: User, Project, Task, Comment
│   │   │   ├── schemas/        # Pydantic request/response schemas
│   │   │   ├── repositories/   # data-access layer
│   │   │   ├── services/       # business logic
│   │   │   ├── routes/         # auth, projects, tasks, comments
│   │   │   ├── exceptions/     # custom exception classes + handlers
│   │   │   ├── tests/          # pytest suites: auth, projects, tasks, comments (fakeredis fixtures)
│   │   │   └── main.py
│   │   ├── migrations/         # Alembic migration scripts
│   │   └── requirements.txt
│   ├── .env                    # environment variables (see below)
│   └── docker-compose.yml      # PostgreSQL, backend, Redis, RedisInsight
└── frontend/
    └── src/
        ├── api/                # Axios clients (projects, tasks, comments) + configured instance
        ├── components/         # ProjectCard, ProjectModal, TaskCard, TaskModal, KanbanColumn, CommentModal, QuoteModal, PrivateRoute
        ├── contexts/           # AuthContext (JWT storage + refresh), LanguageContext (EN/PT toggle)
        ├── pages/              # Login, Register, Dashboard, Board
        ├── types/              # shared domain types (task, project, comment, auth)
        ├── mocks/              # MSW handlers + node/browser servers
        ├── tests/              # Vitest component tests
        ├── setupTests.ts       # test bootstrap (MSW lifecycle, jest-dom matchers)
        ├── App.tsx
        └── main.tsx            # app root + React Query QueryClientProvider
```

## How to run it

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (recommended for the database)

### Environment Variables

Create `taskflow/.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/taskflow
SECRET_KEY=your-secret-key-at-least-32-characters-long
```

### Run with Docker

```bash
cd taskflow
docker compose up --build
```

- API: `http://localhost:8000`
- PostgreSQL: port `5433`
- Redis: port `6379`
- RedisInsight: `http://localhost:5540`

### Backend (local)

```bash
cd taskflow/backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Interactive docs: `http://localhost:8000/docs`

### Frontend (local)

```bash
cd frontend
npm install
npm run dev
```

Vite dev server: `http://localhost:5173`. CORS is configured to allow any `localhost` port.

## Tests

### Backend

```bash
cd taskflow/backend
pytest
```

Covers auth, projects, tasks, and comments via fixtures in `conftest.py` with a dedicated test database session and a `fakeredis` integration for a dedicated redis session.

### Frontend

```bash
cd frontend
npm test          # run Vitest with coverage
npm run test:run  # single run, no watch
npm run test:ui   # Vitest UI
```

Component tests run in jsdom with MSW-mocked API responses (see [Frontend architecture › Testing](#testing-vitest--testing-library--msw)).

## API Overview

| Method         | Route                                                  | Description                    |
| -------------- | ------------------------------------------------------ | ------------------------------ |
| POST           | `/auth/register`                                       | Create account                 |
| POST           | `/auth/login`                                          | Login, returns JWT             |
| GET            | `/health`                                              | DB liveness probe              |
| GET/POST       | `/projects`                                            | List / create projects         |
| GET/PUT/DELETE | `/projects/{id}`                                       | Read / update / delete project |
| GET/POST       | `/projects/{id}/tasks`                                 | List / create tasks            |
| GET/PUT/DELETE | `/projects/{id}/tasks/{task_id}`                       | Read / update / delete task    |
| PATCH          | `/projects/{id}/tasks/{task_id}/move`                  | Move task to new status column |
| GET/POST       | `/projects/{id}/tasks/{task_id}/comments`              | List / add comments            |
| PUT/DELETE     | `/projects/{id}/tasks/{task_id}/comments/{comment_id}` | Update / delete comment        |
</content>
</invoke>
