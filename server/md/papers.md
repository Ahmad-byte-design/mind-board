# Prompt: Laravel CRUD API for "Papers" (MindBoard concept notes)

Act as a senior Laravel backend engineer. Build CRUD for the **Paper** resource — a single note/concept pinned to a Page's board. Auth is already in place: Sanctum cookie/session auth, `auth:sanctum` + `web` middleware, current user available via `$request->user()`. The `Page` resource (with its own CRUD, policy, ownership pattern) already exists.

## Data model

`papers` table:

```
id
page_id       foreign key -> pages.id
content       text
created_at / updated_at
```

A paper has no direct `user_id` — ownership is derived through its parent page (`paper.page.user_id`).

## Architecture — same pattern as Pages/Auth, keep it consistent

- **Controller → Service → Repository**, plus a **Policy**.
- `PaperController` stays thin: Form Request → `PaperService` → JSON response.
- `PaperService` owns business logic: creating/updating/deleting a paper, authorizing via the policy before mutating.
- `PaperRepositoryInterface` + `PaperRepository` — only layer touching Eloquent for `Paper`. Bind in the existing `RepositoryServiceProvider`.
- `PaperPolicy`: a user may only view/create/update/delete papers that belong to **their own** page. Check ownership via `$paper->page->user_id === $request->user()->id` (for show/update/delete) and via the route-bound `Page`'s ownership (for index/store).
- Route-model binding for `{page}` and `{paper}`.

## Endpoints

Papers are nested under pages for listing/creating (since a paper always belongs to a page), flat for the rest:

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/pages/{page}/papers` | List papers on this page, newest first. Requires the page to belong to the authenticated user (403 otherwise). **Pagination is scrollable (infinite scroll)** — use cursor pagination, not page-number pagination |
| POST | `/api/pages/{page}/papers` | Create a paper on this page from `content` |
| GET | `/api/papers/{paper}` | Show one paper (must belong to a page owned by the user) |
| PUT/PATCH | `/api/papers/{paper}` | Update `content` |
| DELETE | `/api/papers/{paper}` | Delete the paper |

## Note on pagination

Same as the Pages list: use `cursorPaginate()` (e.g. 15 per load) in the repository/service, returning `next_cursor` in the response meta so the frontend can load more by appending `?cursor={next_cursor}`. No page-number UI, no `offset` queries.

## Request/response conventions (match the auth/pages modules)

- JSON responses with a `message` key on writes; list/show return the resource directly.
- 404 (via route-model binding) if the page or paper doesn't exist; 403 if it exists but the page isn't owned by the user — use 403 rather than a 404 so the frontend can tell "not found" from "not yours."
- Validation errors: Laravel's default 422 shape.

### POST /api/pages/{page}/papers
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

### GET /api/pages/{page}/papers
```json
// GET /api/pages/12/papers?cursor={next_cursor}  (cursor param omitted on the first request)
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

### GET /api/papers/{paper}
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

### PUT /api/papers/{paper}
```json
// Request
{ "content": "useState is a React Hook for managing local component state." }

// 200 Response
{ "message": "Paper updated successfully.", "paper": { "...": "..." } }
```

### DELETE /api/papers/{paper}
```json
{ "message": "Paper deleted successfully." }
```

## Deliverables

1. Migration for `papers` (`id`, `foreignId('page_id')->constrained()->cascadeOnDelete()`, `content` as `text`, timestamps)
2. `Paper` model — `belongsTo(Page::class)`
3. `PaperRepositoryInterface` + `PaperRepository` (index-for-page using `cursorPaginate()`, create, update, delete, find)
4. `PaperService` (create, update, delete, listForPage, find-with-ownership-check)
5. `PaperPolicy` (view, create, update, delete — ownership resolved through the parent page)
6. Form Requests: `StorePaperRequest`, `UpdatePaperRequest`
7. `PaperResource` — exposes `id`, `page_id`, `content`, `created_at`, `updated_at`
8. `PaperController` (index, store, show, update, destroy) under `App\Http\Controllers\Api`
9. Routes: nested `apiResource` for index/store (`pages/{page}/papers`), flat routes for show/update/destroy (`papers/{paper}`), all under `auth:sanctum` + `web` middleware
10. Short README section with these 5 endpoints' request/response bodies

## Style

- Strict types, constructor property promotion, PHP 8 syntax
- Ownership checks live in the Policy, not scattered `if` statements in the controller
- No logic duplication between controllers — shared behavior belongs in the service
