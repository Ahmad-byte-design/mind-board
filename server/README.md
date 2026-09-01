# MindBoard — AI-Powered Visual Learning Platform

Act as a senior product designer, UX architect, and AI product strategist with 10+ years of experience designing educational SaaS products.

Design and define a product called **MindBoard**.

## Product Vision

MindBoard is an AI-powered learning platform that transforms a user's learning goal into a **visual, interactive knowledge map**.

Instead of giving users a traditional course, checklist, or long curriculum, MindBoard creates a personal learning board where concepts are represented as physical paper notes pinned to a cork board and connected with red strings.

The core emotional experience should be:

> **"I can see my learning journey and watch my knowledge grow."**

The product combines:

* AI-powered learning path generation
* Visual knowledge mapping
* Personal learning management
* Interactive concept relationships
* Practice and challenges
* AI tutoring
* Learning progress tracking

The product should feel like a combination of:

**Notion + Obsidian Canvas + Miro + a physical investigation board + an AI tutor**

but it must have its own distinctive identity.

---

# The Core Problem

Traditional learning platforms usually present knowledge as:

```text
Course
 ↓
Chapter
 ↓
Lesson
 ↓
Quiz
 ↓
Next lesson
```

This makes learning feel linear and sometimes overwhelming.

MindBoard should instead show:

```text
Learning Goal
      ↓
Knowledge Map
      ↓
Concepts
      ↓
Relationships
      ↓
Practice
      ↓
Progress
      ↓
Mastery
```

The user should understand not only:

> "What should I learn?"

but also:

> "Why do I need to learn this?"

> "What does this concept depend on?"

> "What should I learn next?"

> "How does this concept connect to everything else?"

---

# The 20-Hour Learning Philosophy

Use the principles of focused skill acquisition inspired by the **"first 20 hours"** approach.

Do NOT claim that every skill can literally be mastered in 20 hours.

Instead, use the idea as a framework for helping users reach a **useful target level of ability**.

When a user enters:

> "I want to learn React"

MindBoard should help define the target outcome.

For example:

> "Build a React application using reusable components, state management, forms, API requests, and routing."

The AI then breaks the goal into the most important concepts and creates a focused learning journey.

The AI should prioritize:

* Important fundamentals
* Prerequisites
* Critical concepts
* Practical skills
* Deliberate practice
* Real projects
* Feedback

Avoid generating huge, overwhelming curricula.

---

# User Journey

## Step 1 — User Creates a Learning Goal

The user clicks:

**+ New Learning Page**

They enter:

> "I want to learn React"

The AI may ask one or two useful questions:

```text
What is your goal?

○ Understand React
○ Build React applications
○ Become job-ready
○ Prepare for an interview
```

The user chooses the target.

---

# Step 2 — AI Builds the Knowledge Map

The AI analyzes the goal and generates a structured knowledge graph.

Example:

```text
                    React Goal
                       │
                    JavaScript
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
           JSX             Functions
             │                   │
             └─────────┬─────────┘
                       ↓
                    Components
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
           Props                State
                                 │
                               Hooks
                                 │
                           API Integration
                                 │
                            Final Project
```

The AI should generate:

* Concepts
* Prerequisites
* Relationships
* Difficulty
* Suggested practice
* Estimated effort
* Learning status

---

# Step 3 — Board Visualization

The generated knowledge graph appears on a realistic cork board.

Every concept is represented as a paper pinned to the board.

Example:

```text
          📌
   ┌────────────────┐
   │ Components     │
   │                │
   │ Reusable UI    │
   │ building block │
   │                │
   │ Difficulty ⭐⭐ │
   └────────────────┘
```

Concepts are connected using physical red strings.

The board should feel tactile, warm, and slightly imperfect.

---

# Knowledge Relationships

A string represents a relationship between two concepts.

Examples:

```text
JavaScript
     │
     │ prerequisite
     ↓
React
```

```text
State
     │
     │ required_for
     ↓
useEffect
```

Relationships should support semantic types such as:

* prerequisite
* depends_on
* related_to
* part_of

The visual connection should remain simple and beautiful.

---

# Interactive Board

The board should support:

* Dragging papers
* Connecting papers
* Deleting papers
* Editing papers
* Zooming
* Panning
* Selecting papers
* Selecting strings
* Multi-select
* Undo/redo
* Auto-save

When a paper moves, connected strings automatically follow it.

The UI should remain responsive and save board changes efficiently rather than making API requests on every pixel movement.

---

# Concept Details

Clicking a paper opens a detailed learning panel.

Example:

```text
useState

What is it?

A React Hook used to
manage changing state.

Example:

const [count, setCount] = useState(0)

Prerequisites:
• Components
• Functions

Practice:

Build a counter.

AI Tutor:

[ Ask AI ]

[ Generate Challenge ]
```

The panel should make the concept useful for actual learning, not just display information.

---

# AI Tutor

Each concept should have an AI assistant.

The user can ask:

> "Explain useState simply."

> "Why do I need to learn this?"

> "Give me an example."

> "Quiz me."

> "I don't understand this."

The AI should adapt explanations to the user's level.

The tone should be helpful, conversational, and educational.

---

# Practice System

Every important concept should lead to action.

For example:

```text
Concept:
React Components

Practice:

Build a ProfileCard component.

Difficulty:
⭐⭐

Estimated time:
30 minutes
```

The user can mark it:

```text
Not started
↓
Learning
↓
Completed
```

Progress should visibly change on the board.

---

# Learning Progress

The board should communicate progress visually.

Example:

```text
🟢 Completed
🟡 Learning
⚪ Not Started
```

The user should be able to understand their progress immediately without opening a statistics dashboard.

Provide additional learning metrics such as:

* Concepts completed
* Current learning streak
* Estimated progress
* Practice completed
* Goal completion

---

# AI Should Adapt the Board

MindBoard should not be a static AI-generated roadmap.

The AI should continuously learn from the user's progress.

Example:

```text
User struggles with:
JavaScript Functions

        ↓

AI detects difficulty

        ↓

Suggests additional practice

        ↓

Creates supporting concept

        ↓

Adds it to the board

        ↓

Connects it to existing concepts
```

This is a key product differentiator.

The board should evolve with the learner.

---

# Product Positioning

Do not position MindBoard as:

> "An AI mind map."

Position it as:

> **"A visual AI learning companion that turns your goals into a living knowledge map."**

The key distinction from traditional note-taking applications is:

### Notion

Stores knowledge.

### MindBoard

Shows the structure, relationships, progress, and journey of knowledge.

The user should feel that the board represents their evolving understanding.

---

# Visual Identity

## Atmosphere

Warm study room.

Cork board.

Paper cards.

Wood.

Pins.

Red thread.

Subtle shadows.

Handwritten details.

Modern AI elements.

The physical metaphor should be combined with modern SaaS usability.

Avoid making it look like a children's education product.

It should feel:

* Premium
* Intelligent
* Creative
* Academic
* Personal
* Modern

---

# Core Screens

Design the product around these experiences:

### 1. Landing Page

Explain the concept immediately.

Hero message:

> **Turn anything you want to learn into a visual knowledge map.**

CTA:

**Start Learning**

---

### 2. Dashboard

Display the user's learning pages as notebook-like cards.

Example:

```text
Learning Notebook

+ New Learning Page

React Mastery
24 concepts
72% complete

Laravel
18 concepts
43% complete

Machine Learning
31 concepts
12% complete
```

---

### 3. Create Learning Page

Paper-style creation experience.

User enters their learning goal.

---

### 4. AI Generation Experience

Show the AI actively constructing the board.

Steps:

```text
Analyzing goal       ✓
Finding fundamentals ✓
Building structure   ✓
Connecting concepts  ✓
Preparing practice   ✓
```

Then transition into the generated board.

---

### 5. Learning Board

The main product experience.

Cork board + paper nodes + red strings.

---

### 6. Concept Detail

Paper expands or opens a side panel with explanation, examples, prerequisites, practice, and AI interaction.

---

### 7. Learning Progress

Show overall progress and completed concepts while keeping the board as the main visual metaphor.

---

### 8. Mobile Experience

On mobile:

* Full-screen board
* Pinch to zoom
* Drag to move around
* Bottom navigation
* Concept details as a bottom sheet

---

# Technical Concept

Use React and TypeScript for the frontend.

Use:

* `@xyflow/react` for the interactive knowledge canvas
* TanStack Query for server state
* Axios for API communication
* React Hook Form + Zod for forms and validation
* Zustand for client/UI state
* Motion for animations
* lucide-react for icons

The backend can provide:

```text
Users
Pages
Papers
Strings
```

A paper represents a **knowledge node**.

A string represents a **relationship between two knowledge nodes**.

Example:

```text
Paper:
id
page_id
title
content
x
y
status
difficulty
```

```text
String:
id
page_id
source_paper_id
target_paper_id
relationship_type
```

The database stores relationships, while React Flow handles their visual rendering.

---

# Core Product Principle

The product should never feel like:

> "AI generated another giant list of things I need to study."

Instead it should feel like:

> **"AI helped me understand what matters, why it matters, what connects to it, and what I should do next."**

The board is not merely decoration.

The board is the user's **visual model of their knowledge**.

---

# Final Product Goal

Create a product that makes learning feel:

**visual + focused + connected + interactive + personal + achievable.**

The ultimate experience should be:

```text
I have a goal
      ↓
AI understands my goal
      ↓
AI breaks it into important skills
      ↓
My knowledge board appears
      ↓
I learn one concept
      ↓
I practice
      ↓
My progress changes
      ↓
The board evolves
      ↓
I can visually see how far I've come
```

The final emotional response should be:

> **"This is my learning world."**

---

# API — Papers

A paper is a single note/concept pinned to a Page's board. Ownership is derived through the parent page. All endpoints require Sanctum cookie/session auth (`/api/v1` prefix). List uses cursor pagination for infinite scroll.

### POST /api/v1/pages/{page}/papers

```json
// Request
{
  "content": "useState is a React Hook used to manage changing state."
}

// 201 Response
{
  "message": "Paper created successfully.",
  "paper": {
    "id": 45,
    "page_id": 12,
    "content": "useState is a React Hook used to manage changing state.",
    "created_at": "2026-08-29T09:00:00.000000Z",
    "updated_at": "2026-08-29T09:00:00.000000Z"
  }
}
```

### GET /api/v1/pages/{page}/papers

```json
// ?cursor={next_cursor} to load the next chunk (omit on first request)
{
  "data": [
    {
      "id": 45,
      "page_id": 12,
      "content": "useState is a React Hook used to manage changing state.",
      "created_at": "2026-08-29T09:00:00.000000Z",
      "updated_at": "2026-08-29T09:00:00.000000Z"
    }
  ],
  "meta": {
    "per_page": 15,
    "next_cursor": "eyJpZCI6NDUsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0",
    "prev_cursor": null
  }
}
```

### GET /api/v1/papers/{paper}

```json
{
  "paper": {
    "id": 45,
    "page_id": 12,
    "content": "useState is a React Hook used to manage changing state.",
    "created_at": "2026-08-29T09:00:00.000000Z",
    "updated_at": "2026-08-29T09:00:00.000000Z"
  }
}
```

### PUT/PATCH /api/v1/papers/{paper}

```json
// Request
{ "content": "useState is a React Hook for managing local component state." }

// 200 Response
{
  "message": "Paper updated successfully.",
  "paper": {
    "id": 45,
    "page_id": 12,
    "content": "useState is a React Hook for managing local component state.",
    "created_at": "2026-08-29T09:00:00.000000Z",
    "updated_at": "2026-08-29T09:00:00.000000Z"
  }
}
```

### DELETE /api/v1/papers/{paper}

```json
{ "message": "Paper deleted successfully." }
```

Errors: 404 via route-model binding when the page/paper doesn't exist; 403 when it exists but isn't owned by the authenticated user; 422 for validation failures.

---

# API — Board & Strings

A **string** is a relationship between two papers on the same page (`paper1_id`, `paper2_id`). The board endpoint returns everything a page needs to render its canvas in one request.

### GET /api/v1/pages/{page}/board

```json
{
  "papers": [
    {
      "id": 45,
      "page_id": 12,
      "content": "useState is a React Hook used to manage changing state.",
      "x": 480,
      "y": 240,
      "created_at": "2026-08-29T09:00:00.000000Z",
      "updated_at": "2026-08-29T09:00:00.000000Z"
    }
  ],
  "strings": [
    { "id": 11, "paper1_id": 45, "paper2_id": 46 }
  ]
}
```

### PATCH /api/v1/pages/{page}/board

Batched save for the board. Updates the position of the listed papers and creates any listed string connections that don't already exist. Papers/strings not listed are left untouched.

```json
// Request
{
  "papers": [
    { "id": 45, "x": 520, "y": 300 },
    { "id": 46, "x": 780, "y": 260 }
  ],
  "strings": [
    { "paper1_id": 45, "paper2_id": 55 }
  ]
}

// 200 Response
{
  "message": "Board updated successfully.",
  "created_strings": [
    { "id": 17, "paper1_id": 45, "paper2_id": 55 }
  ]
}
```

`created_strings` only lists strings the server actually created — a connection that already exists is skipped idempotently, so the frontend can safely remap temporary edge ids to real string ids after every save. Rejected with 422 when any paper id doesn't belong to the page or when x/y are missing.

### POST /api/v1/pages/{page}/strings

```json
// Request
{ "paper1_id": 45, "paper2_id": 46 }

// 201 Response
{
  "message": "String created successfully.",
  "string": { "id": 11, "paper1_id": 45, "paper2_id": 46 }
}
```

Rejected with 422 when either paper doesn't belong to the page, when both ids are equal, or when a string already connects the two papers (in either direction).

### DELETE /api/v1/strings/{string}

```json
{ "message": "String deleted successfully." }
```

Deleting a paper cascades to its strings automatically. Errors: 404 when the page/string doesn't exist; 403 when it isn't owned by the authenticated user.

# API — AI Board Generation

`POST /api/v1/pages/{page}/generate` asks the AI to break the page's **title** into a focused concept graph (about 12–20 concepts), persists everything as papers + strings, computes tree-shaped positions, and returns the full board — the same response shape as `GET /api/v1/pages/{page}/board`.

## POST /api/v1/pages/{page}/generate

**Body:** none

**201 Response**

```json
{
  "message": "Board generated successfully.",
  "papers": [
    { "id": 45, "page_id": 12, "content": "JavaScript Fundamentals", "x": 0, "y": 0 },
    { "id": 46, "page_id": 12, "content": "JSX", "x": 240, "y": 180 }
  ],
  "strings": [
    { "id": 17, "paper1_id": 45, "paper2_id": 46 }
  ]
}
```

**Errors**

- `409` — `{ "message": "This page already has a board." }` (generation only works on an empty page)
- `422` — AI returned malformed/empty output after a retry
- `502` — the AI provider returned an error
- `401` / `403` — standard auth/ownership errors, same as the rest of the Board API

All writes (papers, strings, positions) run in a single DB transaction — a failed AI call or a failed write leaves the page untouched.

## Configuration and layout constants

- The provider is **Google Gemini** (Flash-Lite by default). Set `GEMINI_API_KEY` in your `.env`; override `GEMINI_MODEL` (default `gemini-flash-lite-latest` — an alias that always points at the current Flash-Lite release, so it won't break when older model names are retired) and `GEMINI_MAX_OUTPUT_TOKENS` (leave empty to use the model's default, effectively unlimited output).
- The AI request/parse lives only in `App\Services\Ai\KnowledgeGraphGenerator`.
- Layout constants used for the tree shape (`App\Services\Board\TreeLayoutCalculator`):
  - `LEVEL_HEIGHT = 180` — vertical gap between concept levels
  - `NODE_SPACING = 240` — horizontal gap between concepts on the same level

  Keep the frontend node height/width in sync with these values. Edge `from` is a prerequisite of `to`; each node's depth is the length of its longest prerequisite chain and each level is horizontally centered.
