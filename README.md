# SideQuest

SideQuest is a gamified productivity platform where users join communities, complete tasks, maintain streaks, and earn EXP.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Django 6, Django REST Framework, Djoser + JWT
- **Storage/Services:** PostgreSQL (via `DATABASE_URL`), Cloudinary media storage, Google OAuth

## Repository Structure

```text
sidequest/
├── frontend/   # Next.js client app
└── backend/    # Django API
```

## Prerequisites

- Python 3.12+
- Node.js 20+ (with Corepack / pnpm)

## Local Setup

### 1) Backend (Django API)

```bash
cd /home/runner/work/sidequest/sidequest/backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Create a `.env` file in `/home/runner/work/sidequest/sidequest/backend`:

```env
SECRET_KEY=change-me
DATABASE_URL=sqlite:///db.sqlite3
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=noreply@sidequest.com
NEXT_PUBLIC_APP_URL=localhost:3000
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run migrations and start the API:

```bash
python manage.py migrate
python manage.py runserver
```

API base URL (local): `http://127.0.0.1:8000/api/`

### 2) Frontend (Next.js)

```bash
cd /home/runner/work/sidequest/sidequest/frontend
corepack enable
pnpm install
```

Create `.env.local` in `/home/runner/work/sidequest/sidequest/frontend`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_STORAGE_KEY=sidequest_auth
```

Start the frontend:

```bash
pnpm dev
```

App URL (local): `http://localhost:3000`

## Useful Commands

### Frontend

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```

### Backend

```bash
python manage.py runserver
python manage.py migrate
python manage.py test
```
