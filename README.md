# ACITY CONNECT

ACITY CONNECT is a simple full-stack web application for Academic City students to trade second-hand items and exchange skills.

## Project Overview

The app has a React frontend, an Express backend, and a PostgreSQL database. Students can register with Academic City institutional emails, create profiles, post listings, express interest in listings, receive notifications, and manage their own activity. Admin users can review users, approve listings, edit or delete listings, flag inappropriate content, and view basic platform statistics.

## Features

- JWT registration and login
- Academic City email restriction for `@acity.edu.gh`
- Student profiles with phone number, skills offered, and skills needed
- Listings for items, skills offered, and skills requested
- Public listings feed with title, category, and status filters
- Interested button and trade request interactions
- Notifications for listing owners
- Admin dashboard with users, listings, approvals, flags, deletes, and stats

## Technologies Used

- Frontend: React, Vite, React Router, Lucide React
- Backend: Node.js, Express, JWT, bcrypt, PostgreSQL
- Database: PostgreSQL
- Deployment targets: Render for backend, GitHub Pages for frontend

## Project Structure

```text
ACITY_CONNECT/
  backend/
  frontend/
```

## Setup Instructions

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create a PostgreSQL database named `acity_connect`, then run the schema:

```bash
npm run db:init
```

3. Configure backend environment variables:

```bash
cp .env.example .env
```

4. Start the backend:

```bash
npm run dev
```

Optional: seed the database with demo users, listings, interactions, notifications, and an admin account:

```bash
npm run db:seed
```

5. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

6. Configure frontend environment variables:

```bash
cp .env.example .env
```

7. Start the frontend:

```bash
npm run dev
```

## Environment Variables

Backend:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`
- `ADMIN_EMAILS`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Frontend:

- `VITE_API_URL`
- `VITE_BASE_PATH`

## Deployment Links

- Render backend: `https://your-render-service.onrender.com`
- GitHub Pages frontend: `https://your-github-username.github.io/your-repo-name/`

Update these links after deployment.

## Deployment

### Backend on Render

This repo includes `render.yaml` for a Render Blueprint. It creates:

- A Node web service for `backend`
- A Render PostgreSQL database
- A generated `JWT_SECRET`
- A `DATABASE_URL` that points to the Render database

Steps:

1. Push this repo to GitHub.
2. In Render, create a new Blueprint from the GitHub repo.
3. During setup, enter `FRONTEND_URL` as your GitHub Pages origin, for example `https://your-github-username.github.io`.
4. Deploy the Blueprint.
5. Note the backend URL, for example `https://acity-connect-backend.onrender.com`.

The backend start command runs `npm run db:init && npm start`, so the database schema is applied automatically.

### Frontend on GitHub Pages

This repo includes `.github/workflows/deploy-frontend.yml`.

Steps:

1. In GitHub, open the repo settings.
2. Go to `Pages`.
3. Set the build and deployment source to `GitHub Actions`.
4. Go to `Settings` -> `Secrets and variables` -> `Actions` -> `Variables`.
5. Add `VITE_API_URL` with your Render API URL, for example `https://acity-connect-backend.onrender.com/api`.
6. Optionally add `VITE_BASE_PATH` with `/your-repo-name/`. If you skip it, the workflow uses `/<repo-name>/`.
7. Push to `main`, or run the workflow manually from the `Actions` tab.

After the frontend deploys, update Render's `FRONTEND_URL` to the real GitHub Pages origin if it changed. Use only the origin, for example `https://your-github-username.github.io`, not the `/repo-name` path.
