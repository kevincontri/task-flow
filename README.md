# TaskFlow

A **Kanban-style project** and **task management app** — FastAPI backend, React frontend.

## Check the deployed website [Here](https://task-flow-1-vuz1.onrender.com/login): 

## Video Demo:

> Soon project video demo

## Project Architecture Diagram:

![TaskFlow System Architecture](./taskflow-architecture.png)

## Features

- User registration and JWT authentication (creator name shown on login/register pages)
- Project CRUD with a dashboard overview — each project card shows task count and creation date
- Kanban board per project (To Do / In Progress / Done columns)
- Drag-and-drop task reordering across columns
- Task fields: name, description, priority (low / medium / high), deadline
- Notes on tasks — add, view, and delete notes via a modal opened from each task card (Enter to submit, Shift+Enter for newline); note count shown directly on the task card
- Customizable motivational quote on the dashboard — editable via a modal, persisted in localStorage
- Language toggle (English / Portuguese) — auto-detected from browser locale on first visit, persisted in localStorage, all UI text updates dynamically
- Redis caching layer with async integration and robust connection/error handling; `fakeredis` used in pytest fixtures for isolated test runs
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
- React Router v7
- Axios
- @dnd-kit (drag-and-drop)

**Infrastructure**

- PostgreSQL 16
- Redis 7 (Alpine) — caching layer
- RedisInsight — Redis GUI at `http://localhost:5540`
- Docker Compose

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
        ├── api/                # Axios clients (projects, tasks, auth, comments)
        ├── components/         # ProjectCard, ProjectModal, TaskCard, TaskModal, KanbanColumn, CommentModal, QuoteModal
        ├── contexts/           # AuthContext (JWT storage + refresh), LanguageContext (EN/PT toggle)
        ├── pages/              # Login, Register, Dashboard, Board
        ├── App.jsx
        └── main.jsx
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

```bash
cd taskflow/backend
pytest
```

Covers auth, projects, tasks, and comments via fixtures in `conftest.py` with a dedicated test database session and a `fakeredis` integration for a dedicated redis session.

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
