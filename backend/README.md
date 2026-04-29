# ACITY CONNECT Backend

## Project Overview

This folder contains the Node.js, Express, and PostgreSQL API for ACITY CONNECT.

## Features

- JWT authentication with hashed passwords
- Registration restricted to `@acity.edu.gh` emails
- Profile create and update support
- Listing creation, search, update, and delete routes
- Interaction routes for expressing interest
- Notification routes for trade request alerts
- Admin routes for users, listings, approvals, flags, deletes, and statistics

## Technologies Used

- Node.js
- Express
- PostgreSQL with `pg`
- JSON Web Tokens
- bcryptjs
- Helmet, CORS, Morgan, and rate limiting

## Setup Instructions

Install dependencies:

```bash
npm install
```

Create the database and run the schema:

```bash
createdb acity_connect
npm run db:init
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The API runs at `http://localhost:5000` by default.

Seed demo data:

```bash
npm run db:seed
```

## Environment Variables

- `PORT`: API port, for example `5000`
- `NODE_ENV`: `development` or `production`
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: long random secret used to sign JWTs
- `JWT_EXPIRES_IN`: token lifetime, for example `7d`
- `FRONTEND_URL`: deployed or local frontend URL allowed by CORS
- `ADMIN_EMAILS`: comma-separated Academic City emails that should receive the admin role on registration
- `SEED_ADMIN_EMAIL`: admin email used by the seed script
- `SEED_ADMIN_PASSWORD`: admin password used by the seed script

## Render Deployment

The root `render.yaml` can deploy the backend and a PostgreSQL database as a Render Blueprint.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Enter `FRONTEND_URL` when prompted.
4. Deploy the Blueprint.

The Blueprint uses:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm run db:init && npm start`
- Database connection: `DATABASE_URL` from the Render PostgreSQL service

## Deployment Link

- Render backend: `https://your-render-service.onrender.com`
