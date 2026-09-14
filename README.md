# MindBoard — Visual AI Learning Companion

> Turn anything you want to learn into a visual knowledge map.

MindBoard transforms a learning goal into a **living knowledge board**: concepts are paper notes pinned to a cork board and connected with red strings. Instead of a linear course, you see your journey grow visually.

**Flow:** Goal → AI Knowledge Map → Concepts → Relationships → Practice → Progress → Mastery

## The Idea

Traditional platforms present learning as `Course → Chapter → Lesson → Quiz`. That feels linear and overwhelming.

MindBoard instead answers:

* What should I learn?
* Why do I need this concept?
* What does it depend on?
* What should I learn next?
* How does everything connect?

It uses a focused-learning philosophy (inspired by the "first 20 hours" approach): break a goal like `"I want to learn React"` into 12–20 essential concepts with prerequisites, difficulty, practice, and relationships — not a giant curriculum.

Positioning: **Notion + Obsidian Canvas + Miro + physical investigation board + AI tutor**, with its own identity:

> "A visual AI learning companion that turns your goals into a living knowledge map."

Key experiences: AI board generation, draggable/zoomable board, concept detail panel + AI tutor, practice/challenges with `Not started → Learning → Completed` status, and progress visible directly on the board (🟢 🟡 ⚪).

Full product vision and API spec: see [`server/README.md`](server/README.md).

## Project Structure

```text
mind-board/
├── public/                 # Frontend (React + TypeScript + Vite SPA)
│   └── src/
│       ├── app/            # App.tsx, router.tsx, layouts/, providers/
│       ├── pages/          # LandingPage, LearningPage, LoginPage, RegisterPage
│       ├── features/       # Domain modules (each: api/, hooks/, store/, types/)
│       │   ├── auth/       # Login/register, session, validation schemas
│       │   ├── pages/      # Learning pages / notebooks
│       │   └── board/      # Canvas: nodes/, edges/, components/, store/, utils/
│       ├── components/ui/  # Shared UI primitives
│       ├── hooks/          # Shared React hooks
│       ├── lib/            # axios.ts, query-client.ts, api-errors.ts, utils.ts
│       ├── i18n/           # i18next setup (en/ar)
│       ├── constants/ types/ styles/ assets/
│       └── main.tsx
├── server/                 # Backend (Laravel 13 REST API, /api/v1 + Sanctum)
│   ├── app/
│   │   ├── Http/           # Controllers/, Requests/, Resources/
│   │   ├── Models/         # User, Page, Paper, PaperString, Session
│   │   ├── Services/       # PageService, PaperService, StringService
│   │   │   ├── Ai/         # KnowledgeGraphGenerator (Google Gemini)
│   │   │   ├── Board/      # TreeLayoutCalculator (board positioning)
│   │   │   └── Auth/
│   │   ├── Repositories/ Policies/ Providers/
│   ├── routes/api/v1/      # auth.php, pages.php, papers.php, strings.php, board.php
│   ├── database/ config/ tests/
│   └── README.md           # Full vision + API docs
└── docker-compose.yml      # Production: Laravel app (SQLite volume)
```

Core domain model:

* **Page** = one learning goal / board
* **Paper** = one knowledge node (concept note with `x, y` position)
* **String** = relationship between two papers (`paper1_id`, `paper2_id`)

## Tech Stack

### Frontend (`public/`)

| Purpose | Library |
|---|---|
| UI / Language | React 19, React DOM, TypeScript |
| Build | Vite |
| Interactive board canvas | `@xyflow/react` |
| Server state / caching | `@tanstack/react-query` |
| HTTP client | `axios` |
| Forms + validation | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Client/UI state | `zustand` |
| Routing | `react-router` |
| Animations | `motion` |
| Icons | `lucide-react` |
| i18n | `i18next` + `react-i18next` |
| Styling | `tailwindcss` + `@tailwindcss/vite` |
| Utils | `clsx`, `date-fns`, `sonner` (toasts) |
| Testing | `vitest`, `testing-library`, `msw`, `jsdom` |

### Backend (`server/`)

| Purpose | Library / Tool |
|---|---|
| Language | PHP 8.3 |
| Framework | Laravel 13 (`laravel/framework`) |
| Auth | Laravel Sanctum 4 (cookie/session, all `/api/v1` routes) |
| AI generation | Google Gemini Flash-Lite (`GEMINI_API_KEY`, `GEMINI_MODEL`) |
| API docs | `darkaonline/l5-swagger` |
| Database (Docker) | SQLite via volume (`DB_CONNECTION=sqlite`) |
| Dev console | `laravel/tinker` |
| Testing | `pestphp/pest` + `pest-plugin-laravel`, `phpunit` |
| Code style | `laravel/pint` |

### Infra

* `docker-compose.yml` — single `app` service (Laravel image, port `8000:80`, SQLite + storage volumes).
* Frontend dev proxy (`public/vite.config.ts`) forwards `/api` and `/sanctum` to the backend.

## How Frontend ↔ Backend Connect

* Auth via Sanctum session/cookie, then REST under `/api/v1`.
* Board render: `GET pages/{page}/board` → `{ papers[], strings[] }`.
* Board save: `PATCH pages/{page}/board` (batched paper positions + new strings).
* AI build: `POST pages/{page}/generate` → AI breaks page title into concepts, saves papers + strings in one DB transaction, returns full board.
