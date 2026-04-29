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
