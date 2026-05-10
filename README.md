# TaskFlow

A Kanban-style project and task management application with a FastAPI backend and a React frontend.

## Features

- User registration and authentication (JWT)
- Project creation and management
- Tasks organized in a Kanban board with drag-and-drop
- Comments on tasks
- PostgreSQL persistence with Alembic migrations
- Async SQLAlchemy + Pydantic v2 schemas

## Tech Stack

**Backend**
- FastAPI
- SQLAlchemy 2.0 (async) + asyncpg
- Alembic
- Pydantic v2
- python-jose / passlib (bcrypt) for auth
- Pytest + pytest-asyncio

**Frontend**
- React 19 + Vite
- React Router
- Axios
- @dnd-kit (drag-and-drop)

**Infrastructure**
- PostgreSQL 16
- Docker Compose

## Project Structure

```
TaskFlow/
├── taskflow/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── core/           # config, security, db session
│   │   │   ├── models/         # SQLAlchemy models (user, project, task, comment)
│   │   │   ├── schemas/        # Pydantic schemas
│   │   │   ├── repositories/   # data access layer
│   │   │   ├── services/       # business logic
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── exceptions/     # custom exception handlers
│   │   │   ├── tests/          # pytest unit tests
│   │   │   └── main.py
│   │   ├── migrations/         # Alembic migrations
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── docker-compose.yml
└── frontend/
    └── src/
        ├── api/                # Axios clients
        ├── components/         # ProjectCard, ProjectModal, KanbanColumn, TaskCard, TaskModal
        ├── contexts/           # auth context
        ├── pages/              # Login, Register, Dashboard, Board
        ├── App.jsx
        └── main.jsx
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose (recommended)

### Run with Docker

From `taskflow/`:

```bash
docker compose up --build
```

The API will be available at `http://localhost:8000` and PostgreSQL exposed on port `5433`.

Create a `.env` file in `taskflow/` with the database URL and JWT secret expected by the backend config.

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

The Vite dev server runs on `http://localhost:5173`. CORS is configured in the backend to allow any `localhost` port.

## Tests

```bash
cd taskflow/backend
pytest
```

Tests use a dedicated test database session provided via fixtures in `conftest.py`, covering auth, projects, tasks, and comments.

## API Overview

- `POST /auth/register`, `POST /auth/login` — account creation and JWT login
- `GET /health` — liveness probe
- `/projects` — CRUD for projects
- `/tasks` — CRUD for tasks (with status for Kanban columns)
- `/comments` — CRUD for task comments