# ACITY CONNECT Frontend

## Project Overview

This folder contains the React and Vite frontend for ACITY CONNECT. It connects to the Express API and provides student-facing pages plus admin management screens.

## Features

- Register and login pages
- Dashboard
- Profile editing
- Create Listing page
- Listings Feed with search and filters
- My Interactions page
- Notifications page
- Admin Dashboard
- Admin Listings Management
- Protected routes and admin-only routes

## Technologies Used

- React
- Vite
- React Router
- Lucide React
- GitHub Pages deployment support

## Setup Instructions

Install dependencies:

```bash
npm install
```

Create `.env` from the example:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

## Environment Variables

- `VITE_API_URL`: backend API URL, for example `http://localhost:5000/api`
- `VITE_BASE_PATH`: GitHub Pages base path, usually `/repo-name/` for project pages or `/` for a custom domain

## GitHub Pages Deployment

1. Deploy the backend to Render first.
2. Set `VITE_API_URL` to the Render API URL ending in `/api`.
3. Set `VITE_BASE_PATH` to your repository path, for example `/acity-connect/`.
4. In GitHub repo settings, set Pages source to `GitHub Actions`.
5. Add `VITE_API_URL` as a repository Actions variable.
6. Push to `main` and the included workflow deploys the frontend.

Manual local build check:

```bash
npm run build
```

The app uses `HashRouter`, which keeps routes working on GitHub Pages refreshes.

## Deployment Link

- GitHub Pages frontend: `https://your-github-username.github.io/your-repo-name/`
