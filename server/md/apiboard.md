# API — Board

All routes are under the `/api/v1` prefix and require authentication (sanctum). Path params use real ids: `{page}`, `{paper}`, `{string}`.

Errors:
- `401` — unauthenticated
- `403` — not the owner of the page/paper/string
- `404` — resource doesn't exist
- `422` — validation failed (see per-request rules)

---

## Board endpoints

### GET `/api/v1/pages/{page}/board`

Load the whole board — all papers **and** strings of a page. Use this when the board opens.

**Body:** none

**Response `200`**

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

---

### PATCH `/api/v1/pages/{page}/board`

Batched save: update paper positions **and** create new string connections. Papers/strings not listed are left untouched. Existing string connections are skipped idempotently (either direction).

**Body** (both `papers` and `strings` are optional but at least one is required)

```json
{
  "papers": [
    { "id": 45, "x": 520, "y": 300 },
    { "id": 46, "x": 780, "y": 260 }
  ],
  "strings": [
    { "paper1_id": 45, "paper2_id": 55 }
  ]
}
```

**Validation**
- `papers.*.id` — required integer, must exist
- `papers.*.x` / `papers.*.y` — required integers
- `strings.*.paper1_id` / `strings.*.paper2_id` — required integers, must exist
- all papers referenced must belong to `{page}`; string endpoints must differ and belong to `{page}`

**Response `200`**

```json
{
  "message": "Board updated successfully.",
  "created_strings": [
    { "id": 17, "paper1_id": 45, "paper2_id": 55 }
  ]
}
```

`created_strings` only lists connections the server actually created — use those ids to replace temporary frontend edge ids.

---

## Paper endpoints

### POST `/api/v1/pages/{page}/papers`

Create a new paper (node) on the board.

**Body**

```json
{ "content": "useState is a React Hook used to manage changing state." }
```

**Validation:** `content` — required string

**Response `201`**

```json
{
  "message": "Paper created successfully.",
  "paper": {
    "id": 47,
    "page_id": 12,
    "content": "useState is a React Hook used to manage changing state.",
    "x": 0,
    "y": 0,
    "created_at": "2026-08-29T10:00:00.000000Z",
    "updated_at": "2026-08-29T10:00:00.000000Z"
  }
}
```

New papers start at `x: 0, y: 0` — place the node at the wanted position and save it with the next board PATCH.

---

### GET `/api/v1/papers/{paper}`

Show a single paper.

**Body:** none

**Response `200`**

```json
{
  "paper": {
    "id": 47,
    "page_id": 12,
    "content": "useState is a React Hook used to manage changing state.",
    "x": 520,
    "y": 300,
    "created_at": "2026-08-29T10:00:00.000000Z",
    "updated_at": "2026-08-29T10:00:00.000000Z"
  }
}
```

---

### PUT/PATCH `/api/v1/papers/{paper}`

Edit a paper's content.

**Body**

```json
{ "content": "useState is a React Hook for managing local component state." }
```

**Validation:** `content` — required string

**Response `200`**

```json
{
  "message": "Paper updated successfully.",
  "paper": {
    "id": 47,
    "page_id": 12,
    "content": "useState is a React Hook for managing local component state.",
    "x": 520,
    "y": 300,
    "created_at": "2026-08-29T10:00:00.000000Z",
    "updated_at": "2026-08-29T10:05:00.000000Z"
  }
}
```

---

### DELETE `/api/v1/papers/{paper}`

Delete a paper. Its connected strings are **deleted automatically** (cascade).

**Body:** none

**Response `200`**

```json
{ "message": "Paper deleted successfully." }
```

---

## String endpoints

### POST `/api/v1/pages/{page}/strings`

Create a string between two papers (draw a connection). Returns the authoritative string id directly — use it for the new edge.

**Body**

```json
{ "paper1_id": 45, "paper2_id": 55 }
```

**Validation**
- `paper1_id` / `paper2_id` — required integers, must exist
- both papers must belong to `{page}`
- must differ
- must not already be connected (either direction)

**Response `201`**

```json
{
  "message": "String created successfully.",
  "string": { "id": 17, "paper1_id": 45, "paper2_id": 55 }
}
```

---

### DELETE `/api/v1/strings/{string}`

Delete one string (a connection you removed on canvas).

**Body:** none

**Response `200`**

```json
{ "message": "String deleted successfully." }
```

---

## Quick reference — which call for which action

| Action | Call |
|---|---|
| Load board | `GET /api/v1/pages/{page}/board` |
| Add a paper node | `POST /api/v1/pages/{page}/papers` |
| Edit paper text | `PUT/PATCH /api/v1/papers/{paper}` |
| Show one paper | `GET /api/v1/papers/{paper}` |
| Connect two papers | `POST /api/v1/pages/{page}/strings` |
| Move papers / bulk save | `PATCH /api/v1/pages/{page}/board` |
| Delete a string | `DELETE /api/v1/strings/{string}` |
| Delete a paper (+ its strings) | `DELETE /api/v1/papers/{paper}` |