# Prompt: Laravel CRUD API for "Pages" (MindBoard learning pages)

Act as a senior Laravel backend engineer. Build CRUD for the **Page** resource. Auth is already in place: Sanctum cookie/session auth, `auth:sanctum` + `web` middleware, current user available via `$request->user()`.

## Data model

`pages` table:

```
id
user_id       foreign key -> users.id
title         string
created_at / updated_at
```

## Architecture — same pattern as the auth module, keep it consistent

- **Controller → Service → Repository**, plus a **Policy**.
- `PageController` stays thin: Form Request → `PageService` → JSON response.
- `PageService` owns business logic: creating/updating/deleting a page, authorizing via the policy before mutating.
- `PageRepositoryInterface` + `PageRepository` — only layer touching Eloquent for `Page`. Bind in the existing `RepositoryServiceProvider`.
- `PagePolicy`: a user may only view/update/delete their **own** pages. Check `$page->user_id === $request->user()->id`.
- Route-model binding for `{page}`.

## Endpoints

| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/pages` | List the authenticated user's pages only, newest first. **Pagination is scrollable (infinite scroll)** — use cursor pagination, not page-number pagination |
| POST | `/api/pages` | Create a page from `title` |
| GET | `/api/pages/{page}` | Show one page (must belong to the user) |
| PUT/PATCH | `/api/pages/{page}` | Update `title` |
| DELETE | `/api/pages/{page}` | Delete the page |

## Note on pagination

The frontend list is an infinite-scroll list, not numbered pages. Use Laravel's `cursorPaginate()` (e.g. 15 per load) instead of `paginate()` in the repository/service, and return `next_cursor` in the response meta so the frontend can request the next chunk by appending `?cursor={next_cursor}` — don't build page-number UI or an `offset`-based query.

## Request/response conventions (match the auth module)

- JSON responses with a `message` key on writes; list/show return the resource directly.
- 404 (via route-model binding) if the page doesn't exist; 403 if it exists but belongs to another user — use 403 rather than a 404 so the frontend can distinguish "not found" from "not yours."
- Validation errors: Laravel's default 422 shape.

### POST /api/pages
```json
// Request
{
  "title": "React Mastery"
}

// 201 Response
{
  "message": "Page created successfully.",
  "page": {
    "id": 12,
    "title": "React Mastery",
    "created_at": "2026-08-27T09:00:00.000000Z",
    "updated_at": "2026-08-27T09:00:00.000000Z"
  }
}
```

### GET /api/pages
```json
// GET /api/pages?cursor={next_cursor}  (cursor param omitted on the first request)
{
  "data": [
    {
      "id": 12,
      "title": "React Mastery",
      "created_at": "2026-08-27T09:00:00.000000Z",
      "updated_at": "2026-08-27T09:00:00.000000Z"
    }
  ],
  "meta": {
    "per_page": 15,
    "next_cursor": "eyJpZCI6MTIsIl9wb2ludHNUb05leHRJdGVtcyI6dHJ1ZX0",
    "prev_cursor": null
  }
}
```

### GET /api/pages/{page}
```json
{
  "page": {
    "id": 12,
    "title": "React Mastery",
    "created_at": "2026-08-27T09:00:00.000000Z",
    "updated_at": "2026-08-27T09:00:00.000000Z"
  }
}
```

### PUT /api/pages/{page}
```json
// Request
{ "title": "React Deep Dive" }

// 200 Response
{ "message": "Page updated successfully.", "page": { "...": "..." } }
```

### DELETE /api/pages/{page}
```json
{ "message": "Page deleted successfully." }
```

## Deliverables

1. Migration for `pages` (`id`, `foreignId('user_id')->constrained()->cascadeOnDelete()`, `title`, timestamps)
2. `Page` model — `belongsTo(User::class)`
3. `PageRepositoryInterface` + `PageRepository` (index-for-user using `cursorPaginate()`, create, update, delete, find)
4. `PageService` (create, update, delete, listForUser, find-with-ownership-check)
5. `PagePolicy` (view, update, delete — ownership check)
6. Form Requests: `StorePageRequest`, `UpdatePageRequest`
7. `PageResource` — exposes `id`, `title`, `created_at`, `updated_at`
8. `PageController` (index, store, show, update, destroy) under `App\Http\Controllers\Api`
9. Routes registered under `auth:sanctum` + `web` middleware, scoped with `apiResource('pages', PageController::class)`
10. Short README section with these 5 endpoints' request/response bodies

## Style

- Strict types, constructor property promotion, PHP 8 syntax
- Ownership checks live in the Policy, not scattered `if` statements in the controller
- No logic duplication between controllers — shared behavior belongs in the service
