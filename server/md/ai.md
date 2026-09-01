# Prompt: AI board generation (papers + strings, tree layout) for MindBoard

Act as a senior Laravel backend engineer. Add an **AI board generation** feature on top of the existing Board API (Pages, Papers, Strings CRUD + the `GET/PATCH /api/v1/pages/{page}/board` endpoints already exist — reuse their repositories/services, don't duplicate persistence logic).

## Goal

`POST /api/v1/pages/{page}/generate` takes the page's `title` (e.g. "React Mastery"), asks an LLM to break it into a focused set of concepts with prerequisite relationships, persists them as `Paper` + `String` rows, computes **tree-shaped `x`/`y` positions** (not random/zero), and returns the full board — same response shape as `GET /api/v1/pages/{page}/board`.

Scope: only allow generation on an **empty** page (no existing papers). If the page already has papers, return `409 Conflict` with `{ "message": "This page already has a board." }` — regeneration/merging is out of scope for this prompt.

## Architecture

Keep the existing Controller → Service → Repository pattern. New pieces:

- `App\Services\Ai\KnowledgeGraphGenerator` — builds and sends the Claude API request, validates and parses the JSON response into a plain array of `{ nodes, edges }`. All Anthropic API specifics (auth header, model, endpoint) live here only.
- `App\Services\Board\TreeLayoutCalculator` — pure function, no I/O. Input: nodes + edges (by temp id). Output: `[temp_id => ['x' => int, 'y' => int]]`. Fully unit-testable in isolation from the AI call and the database.
- `App\Services\Board\BoardGenerationService` — orchestrates: call the generator → open a DB transaction → bulk-create papers via the existing `PaperRepository` → map temp ids to real ids → bulk-create strings via the existing `StringRepository` (reuse its "must belong to page / must differ / no duplicate" validation) → run `TreeLayoutCalculator` → persist positions via the existing board-update path → commit → return papers + strings for the response.
- `BoardController@generate` (or a new `AiBoardController`) — thin: authorize the page belongs to the user, check it's empty, call the service, return JSON.

## The AI call

- Config: add `ANTHROPIC_API_KEY` to `.env` and a `services.php` entry.
- Call the Anthropic Messages API (`POST https://api.anthropic.com/v1/messages`) with a system prompt that:
  - States the "first 20 hours" philosophy: prioritize fundamentals, prerequisites, and practical skills; **avoid huge lists** — target roughly 12–20 concepts for a typical goal, never open-ended.
  - Requires **JSON-only output, no prose, no markdown fences** — a single object:
    ```json
    {
      "nodes": [
        { "id": "n1", "content": "JavaScript Fundamentals" },
        { "id": "n2", "content": "JSX" }
      ],
      "edges": [
        { "from": "n1", "to": "n2" }
      ]
    }
    ```
    `from`/`to` are temp node ids; an edge means `from` is a prerequisite of `to`.
  - The user message is just the page title (e.g. `"I want to learn React"` or the title text — pass through as-is).
- Parse defensively: strip any accidental code fences, `json_decode`, validate every edge references a declared node id, throw a typed exception (`AiGenerationException`) on malformed output so the controller can return a clean `502`/`422` instead of a raw crash.

## Tree layout algorithm (in `TreeLayoutCalculator`)

Treat `edges` as a DAG (prerequisite → dependent):

1. **Depth** of a node = the length of the *longest* prerequisite chain leading into it (not shortest — a node should sit below *everything* it depends on, not just the nearest one). Nodes with no incoming edges are depth `0`. Compute via topological order + longest-path relaxation.
2. **Group** nodes by depth into levels.
3. **Order within a level:** for depth `0`, keep generation order. For depth `> 0`, sort each level's nodes by the mean x-position of their direct parents (barycenter heuristic) — this is what keeps children roughly centered under their parents and cuts down on crossing strings. Ties broken by generation order.
4. **Assign coordinates:**
   - `y = depth * LEVEL_HEIGHT` (constant, e.g. `180`)
   - Within a level, space nodes evenly: `x = index * NODE_SPACING` (constant, e.g. `240`), then shift the whole level so it's horizontally centered on the overall board width.
5. Return `[node_id => ['x' => ..., 'y' => ...]]` keyed by the **temp** node id — the calling service maps temp id → real paper id before saving.

Keep `LEVEL_HEIGHT` and `NODE_SPACING` as class constants (or config values) so the frontend node width/spacing can be kept in sync.

## Endpoint

### POST /api/v1/pages/{page}/generate

**Body:** none

**Response `201`**
```json
{
  "message": "Board generated successfully.",
  "papers": [
    { "id": 45, "page_id": 12, "content": "JavaScript Fundamentals", "x": 0, "y": 0, "created_at": "...", "updated_at": "..." },
    { "id": 46, "page_id": 12, "content": "JSX", "x": 240, "y": 180, "created_at": "...", "updated_at": "..." }
  ],
  "strings": [
    { "id": 17, "paper1_id": 45, "paper2_id": 46 }
  ]
}
```

**Error responses**
- `409` — page already has papers
- `422` — AI returned malformed/empty output after retry
- `401` / `403` — standard auth/ownership errors, same as the rest of the Board API

## Deliverables

1. `App\Services\Ai\KnowledgeGraphGenerator` + `AiGenerationException`
2. `App\Services\Board\TreeLayoutCalculator` (pure, unit-testable — include at least one test with a diamond-shaped dependency graph, i.e. two parents sharing a child, to prove the barycenter centering works)
3. `App\Services\Board\BoardGenerationService`
4. Controller action + route: `POST /api/v1/pages/{page}/generate`, under the same `auth:sanctum` + ownership middleware as the rest of the Board API
5. `services.php` / `.env.example` entries for the Anthropic key
6. Short README section documenting the endpoint, the 409/422 cases, and the layout constants

## Style

- The AI call, the layout math, and the persistence are three separate, independently testable units — don't inline any of them into the controller or into each other.
- Wrap all writes (papers + strings + positions) in a single DB transaction — a partial board on failure is worse than a clean error.
- No magic numbers for layout spacing outside the two named constants.
