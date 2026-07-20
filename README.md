# Sprintline — Task & Sprint Tracker

A lightweight project management app: kanban boards, sprint planning, and team
velocity charts. Django REST Framework backend, React (Vite) frontend, PostgreSQL.

## Stack

- **Backend:** Django 5 + Django REST Framework, JWT auth (simplejwt), PostgreSQL
- **Frontend:** React 18 + Vite + Tailwind CSS + Recharts
- **Infra:** Docker Compose (db, backend, frontend)

## Features

- Projects with membership roles (owner / admin / member)
- Kanban board per project with configurable columns and drag-and-drop
- Tasks with priority, story points, assignee, and sprint linkage
- Sprints with planned / active / completed status
- Velocity chart: committed vs. completed story points per sprint

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

- Backend: http://localhost:8000/api/
- Frontend: http://localhost:5173
- Django admin: http://localhost:8000/admin/ (create a superuser first, see below)

Create a superuser (optional, for the Django admin):

```bash
docker compose exec backend python manage.py createsuperuser
```

## Quick start (without Docker)

**Backend**

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # edit POSTGRES_HOST=localhost, etc.
python manage.py migrate
python manage.py runserver
```

Requires a local PostgreSQL instance matching the `.env` credentials.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## API overview

| Endpoint | Description |
|---|---|
| `POST /api/auth/register/` | Create an account |
| `POST /api/auth/login/` | Get JWT access/refresh tokens |
| `POST /api/auth/token/refresh/` | Refresh an access token |
| `GET/POST /api/projects/` | List / create projects |
| `POST /api/projects/{id}/members/add/` | Add a member by username |
| `GET/POST /api/boards/` | List / create boards (`?project=<id>`) |
| `GET/POST /api/columns/` | List / create columns (`?board=<id>`) |
| `GET/POST /api/tasks/` | List / create tasks (`?project=`, `?sprint=`) |
| `POST /api/tasks/{id}/move/` | Move a task to a column/position (drag-and-drop) |
| `GET/POST /api/sprints/` | List / create sprints (`?project=<id>`) |
| `GET /api/sprints/velocity/` | Velocity data (`?project=<id>&limit=8`) |

## Pushing to your own GitHub repo

This project was generated locally, so it isn't connected to a GitHub repo yet.
From the project root:

```bash
git init
git add .
git commit -m "Initial commit: Sprintline task & sprint tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Project structure

```
task-sprint-tracker/
├── backend/
│   ├── apps/
│   │   ├── accounts/   # auth: register, login, /me
│   │   ├── projects/   # Project, Membership, permissions
│   │   ├── boards/     # Board, Column, Task, drag-and-drop move endpoint
│   │   └── sprints/    # Sprint, velocity aggregation
│   ├── config/         # settings, urls, wsgi/asgi
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api/         # axios client + resource calls
│       ├── context/     # auth context (JWT session)
│       ├── components/  # Shell, TaskCard, TaskModal, VelocityChart
│       └── pages/       # Login, Register, Dashboard, Board, Sprints
├── docker-compose.yml
└── .env.example
```

## Notes / next steps

- Add WebSocket-based live updates for multi-user board editing
- Add task comments and activity history
- Add sprint burndown charts alongside velocity
- Swap the custom HTML5 drag-and-drop for `@hello-pangea/dnd` if you want smoother animations
