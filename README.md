# Dashboard Landing Node

A full-stack SaaS dashboard demo with a modern Next.js frontend and a simple
Express backend.

The frontend includes a dark premium landing page, internal dashboard pages,
reusable dashboard UI components, and CRUD modules for Clients and Leads. The
backend provides JSON API routes using in-memory data, with routes, data, and
validators split into beginner-friendly folders.

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

### Backend

- Express
- CORS
- Nodemon
- In-memory data stores

## Folder Structure

```text
dashboard-landing-node/
  client/
    src/app/
      page.tsx
      dashboard/
        components/
        analytics/
        clients/
        leads/
        reports/
        settings/

  server/
    index.js
    data/
    routes/
    validators/
```

- `client/` contains the real Next.js frontend.
- `client/src/app/page.tsx` is the SaaS landing page.
- `client/src/app/dashboard/` contains the internal dashboard routes.
- `client/src/app/dashboard/components/` contains reusable dashboard UI pieces.
- `server/` contains the Express backend.
- `server/routes/` contains API route handlers.
- `server/data/` contains in-memory dashboard, clients, and leads data.
- `server/validators/` contains simple request validation helpers.

## Run the Frontend

```bash
cd client
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

If dependencies are already installed, you can skip `npm.cmd install`.

## Run the Backend

```bash
cd server
npm.cmd install
npm.cmd run dev
```

The backend runs at:

```text
http://localhost:5000
```

If dependencies are already installed, you can skip `npm.cmd install`.

## Frontend Routes

- `/` - SaaS landing page
- `/dashboard` - dashboard overview
- `/dashboard/analytics` - analytics page
- `/dashboard/clients` - clients CRUD module
- `/dashboard/leads` - leads CRUD module
- `/dashboard/reports` - reports page
- `/dashboard/settings` - settings page

## Backend API Endpoints

### Health

- `GET /`

### Dashboard

- `GET /api/dashboard/overview`
- `GET /api/dashboard/analytics`
- `GET /api/dashboard/reports`

### Clients

- `GET /api/clients`
- `POST /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

### Leads

- `GET /api/leads`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

## Validation

Frontend lint:

```bash
cd client
npm.cmd run lint
```

Backend syntax check:

```bash
cd server
node --check index.js
```

## Current Limitations

- Data is stored in memory only.
- Data resets when the backend restarts.
- There is no authentication yet.
- There is no database yet.
- API URLs are currently hardcoded to `localhost`.
- The project is optimized for local development, not production deployment.

## Future Roadmap

- Add persistent database storage.
- Add authentication and protected dashboard routes.
- Move API URLs into environment variables.
- Add shared frontend API utilities when more modules need them.
- Add server-side filtering or pagination for larger datasets.
- Add backend route tests and frontend component tests.
- Add deployment configuration for frontend and backend hosting.
