# Quiz — Full‑Stack Quiz Application

A fast, accessible, and extensible Quiz application for creating, taking, and reviewing quizzes. Built as a full‑stack project with a React frontend and a Node.js backend. This README contains the exact, ready‑to‑run instructions and reference information. Add screenshots to /docs/screenshots.

## Features
- Create, edit, publish, and delete quizzes and questions
- Multiple question types: multiple‑choice, single‑choice, true/false, short answer
- Timed quizzes, per‑question time limits, randomized order
- Immediate feedback and detailed results per attempt
- User authentication (email/password) with JWT
- Admin dashboard for content and user management
- Quiz attempt history and CSV export of results
- Test coverage for backend and frontend

## Tech stack
- Frontend: React + TypeScript, Vite, Tailwind CSS
- Backend: Node.js + TypeScript, Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT
- Testing: Jest, React Testing Library, Supertest
- CI: GitHub Actions
- Containerization: Docker, Docker Compose

## Repository layout
- /frontend — React application (Vite)
- /backend — Express API (TypeScript)
- /docker-compose.yml — development services (Postgres)
- /docs/screenshots — add your screenshots here

## Prerequisites
- Node.js 18+
- pnpm or npm
- Docker & Docker Compose
- Git

## Environment variables

Create `.env` in the backend folder with the following exact variables (do not commit secrets):

```env
# backend/.env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@db:5432/quiz_db
JWT_SECRET=replace_with_a_secure_jwt_secret
NODE_ENV=development
```

Create `.env` in the frontend folder:

```env
# frontend/.env
VITE_API_URL=http://localhost:4000
```

## Local setup and run

1. Clone the repository and enter the project root:
```bash
git clone git@github.com:SkanderTN/quiz.git
cd quiz
```

2. Start development services (Postgres) with Docker Compose:
```bash
docker compose up -d
```

3. Backend: install, migrate, and run
```bash
cd backend
# install dependencies
pnpm install
# generate prisma client
pnpm prisma generate
# run database migrations
pnpm prisma migrate deploy
# run seed script (if provided)
pnpm run seed
# start in development mode
pnpm run dev
```

4. Frontend: install and run
```bash
cd ../frontend
pnpm install
pnpm run dev
```

Frontend will be available at the port printed by Vite (commonly http://localhost:5173). Backend API base URL is http://localhost:4000.

## Scripts (examples)

Backend (in /backend):
- pnpm dev — start development server with ts-node or nodemon
- pnpm build — compile TypeScript to /dist
- pnpm start — run production build
- pnpm test — run Jest tests
- pnpm prisma:migrate — run Prisma migrations
- pnpm prisma:seed — apply seed data

Frontend (in /frontend):
- pnpm dev — start Vite dev server
- pnpm build — create production build
- pnpm preview — preview production build
- pnpm test — run frontend tests

Adjust these commands to match the package.json scripts if they differ.

## API reference (core endpoints)

Auth
- POST /api/auth/signup — { name, email, password } → create user
- POST /api/auth/login — { email, password } → { token }
- GET /api/auth/me — bearer token → current user profile

Quizzes
- GET /api/quizzes — list published quizzes
- GET /api/quizzes/:id — quiz details (questions withheld until attempt)
- POST /api/quizzes — create quiz (admin)
- PATCH /api/quizzes/:id — update quiz (admin)
- DELETE /api/quizzes/:id — delete quiz (admin)

Questions
- POST /api/quizzes/:id/questions — add question (admin)
- PATCH /api/questions/:questionId — update question (admin)
- DELETE /api/questions/:questionId — delete question (admin)

Attempts / Results
- POST /api/quizzes/:id/attempts — start attempt → returns attemptId and questions
- POST /api/attempts/:attemptId/submit — submit answers → score, feedback
- GET /api/attempts/:attemptId — retrieve attempt results

Admin / Reports
- GET /api/admin/results?quizId=... — CSV export and analytics (admin)

Authentication: send Authorization: Bearer <token> header for protected routes.

## Data model (summary)
- User: id, name, email, hashedPassword, role
- Quiz: id, title, description, isPublished, timeLimit, authorId
- Question: id, quizId, type, text, options[], correctAnswer, points
- Attempt: id, userId, quizId, startedAt, finishedAt, score, details
- Option/Choice: id, text, isCorrect (backend only)

## Testing
Backend:
```bash
cd backend
pnpm install
pnpm test
pnpm test:coverage
```

Frontend:
```bash
cd frontend
pnpm install
pnpm test
```

E2E tests (if present) run with Cypress or Playwright:
```bash
pnpm run e2e
```

## Build and production deployment

Backend: build and run in Docker
```bash
cd backend
pnpm install --production
pnpm build
docker build -t quiz-backend:latest .
```

Frontend: build static assets and serve with any static host
```bash
cd frontend
pnpm install
pnpm build
# deploy the contents of frontend/dist to your static host (Vercel, Netlify, S3)
```

## Screenshots
<img width="1862" height="918" alt="Quiz2" src="https://github.com/user-attachments/assets/efbb5878-a023-4b21-bfef-e9ae346ffdc3" />
<img width="1862" height="925" alt="Quiz1" src="https://github.com/user-attachments/assets/1303814f-b996-459a-a80b-79d65037bba9" />
![WebQuiz2](https://github.com/user-attachments/assets/21f0be4e-558f-4fb1-9e0a-a51e8247172f)
<img width="1862" height="922" alt="WebQuiz4" src="https://github.com/user-attachments/assets/af1972a9-a9c8-4a05-aea8-32312afdee1a" />
<img width="1862" height="911" alt="WebQuiz5" src="https://github.com/user-attachments/assets/5f84143d-5742-4ba7-8184-bbcebac319b7" />
<img width="1862" height="917" alt="Quiz3" src="https://github.com/user-attachments/assets/7253ed95-7492-4766-ad6a-1f79b573cbb4" />

## License
This project is released under the MIT License. See the LICENSE file.
