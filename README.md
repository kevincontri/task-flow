# TaskFlow

> A Kanban-style project and task management app — FastAPI backend, React frontend.

---

## Demo

<!-- Upload your demo video here -->

---

## Features

- User registration and JWT authentication
- Project CRUD with a dashboard overview
- Kanban board per project (To Do / In Progress / Done columns)
- Drag-and-drop task reordering across columns
- Task fields: name, description, priority (low / medium / high), deadline
- Comments on tasks
- Form validation on all inputs
- Empty-state and loading indicators throughout the UI

## Tech Stack

**Backend**
- FastAPI 0.136
- SQLAlchemy 2.0 (async) + asyncpg
- Alembic (migrations)
- Pydantic v2 + pydantic-settings
- python-jose / passlib (bcrypt) — JWT auth
- pytest + pytest-asyncio

**Frontend**
- React 19 + Vite
- React Router v7
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
│   │   │   ├── core/           # config, database session, security, deps, enums
│   │   │   ├── models/         # SQLAlchemy models: User, Project, Task, Comment
│   │   │   ├── schemas/        # Pydantic request/response schemas
│   │   │   ├── repositories/   # data-access layer
│   │   │   ├── services/       # business logic
│   │   │   ├── routes/         # auth, projects, tasks, comments
│   │   │   ├── exceptions/     # custom exception classes + handlers
│   │   │   ├── tests/          # pytest suites: auth, projects, tasks, comments
│   │   │   └── main.py
│   │   ├── migrations/         # Alembic migration scripts
│   │   └── requirements.txt
│   ├── .env                    # environment variables (see below)
│   └── docker-compose.yml
└── frontend/
    └── src/
        ├── api/                # Axios clients (projects, tasks, auth)
        ├── components/         # ProjectCard, ProjectModal, TaskCard, TaskModal, KanbanColumn
        ├── contexts/           # AuthContext (JWT storage + refresh)
        ├── pages/              # Login, Register, Dashboard, Board
        ├── App.jsx
        └── main.jsx
```

## Getting Started

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

API: `http://localhost:8000` — PostgreSQL exposed on port `5433`.

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

Covers auth, projects, tasks, and comments via fixtures in `conftest.py` with a dedicated test database session.

## API Overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/health` | DB liveness probe |
| GET/POST | `/projects` | List / create projects |
| GET/PUT/DELETE | `/projects/{id}` | Read / update / delete project |
| GET/POST | `/projects/{id}/tasks` | List / create tasks |
| GET/PUT/DELETE | `/projects/{id}/tasks/{task_id}` | Read / update / delete task |
| PATCH | `/projects/{id}/tasks/{task_id}/move` | Move task to new status column |
| GET/POST | `/projects/{id}/tasks/{task_id}/comments` | List / add comments |
| PUT/DELETE | `/projects/{id}/tasks/{task_id}/comments/{comment_id}` | Update / delete comment |
