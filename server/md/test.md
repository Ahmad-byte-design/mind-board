# Prompt: Test suite for the MindBoard auth + board API

Act as a senior Laravel backend engineer. Write the full automated test suite for everything built so far: Auth, Pages CRUD, Papers CRUD, Board (GET/PATCH), Strings, and AI board generation. Use **Pest** (Laravel's current default) with `RefreshDatabase`. Prefer Feature tests for anything that hits an HTTP endpoint, Unit tests only for pure/isolated logic (`TreeLayoutCalculator`).

## Setup

- Factories needed: `UserFactory` (default), `PageFactory`, `PaperFactory` (with a `page_id` relation, `x`/`y` nullable), `StringFactory` (with `paper1_id`/`paper2_id`).
- A shared test helper/trait for "acting as an authenticated user via Sanctum" — since auth is cookie/session-based, use `actingAs($user)` (Sanctum's session guard works with this directly; no token bootstrapping needed).
- Mock `KnowledgeGraphGenerator` (bind a fake/mock implementation in the container) for every AI-generation test — **never call the real Gemini API in tests.** The fake should be controllable per-test to return specific `{nodes, edges}` shapes, including malformed ones for error-path tests.
- Use Laravel's `Http::fake()` as a backstop even with the mock in place, so an accidental real network call fails loudly instead of silently hitting the internet.

## 1. Auth

- **Register:** valid data creates a user and starts a session (`/api/auth/me` succeeds right after); duplicate email → 422; weak password → 422; missing fields → 422.
- **Login:** correct credentials → session starts, `user` returned, no `token` key in the response; wrong password → 422 with generic message (doesn't reveal whether the email exists); after 5 failed attempts within the window → throttled response, and a 6th correct-password attempt still gets throttled until the window clears (use `Carbon::setTestNow` or `RateLimiter::clear` to control timing).
- **Me:** unauthenticated → 401; authenticated → returns the correct user's data only.
- **Logout:** authenticated request invalidates the session — a follow-up `/me` call in the same "browser" fails with 401.
- **Logout-all:** creates a second session for the same user (simulate a second login), calls logout-all, asserts the *other* session's `sessions` table row is gone while the response is still successful for the caller.
- **Forgot password:** valid email → success message, a `PasswordReset` notification/mail is queued (`Notification::fake()` / `Mail::fake()`); unknown email → still returns success message (no user enumeration) if that's the app's chosen behavior — confirm against the actual controller and assert whichever it does, consistently.
- **Reset password:** valid token → password changes, old sessions are invalidated; invalid/expired token → 422.
- **Change password:** wrong current password → 422, password unchanged; correct current password → password changes, other sessions invalidated, **current session stays authenticated** (assert `/me` still works right after).

## 2. Pages CRUD

- **Index:** returns only the authenticated user's pages, not other users'; cursor pagination — assert `meta.next_cursor` is present when there are more than one page's worth of results and absent on the last page; results ordered newest-first.
- **Store:** valid `title` → 201 with the created page; missing `title` → 422.
- **Show:** owner can view; a *different* authenticated user gets 403 (not 404) for someone else's page id; unauthenticated → 401; nonexistent id → 404.
- **Update:** owner can update `title`; non-owner → 403.
- **Delete:** owner can delete; non-owner → 403; deleting a page cascades to its papers and strings (assert child rows are gone, not just the page).

## 3. Papers CRUD

- **Index (nested under page):** returns only papers on that page; requesting `pages/{other_users_page}/papers` → 403; cursor pagination behaves like Pages' index.
- **Store:** valid `content` on an owned page → 201; on a page owned by someone else → 403; missing `content` → 422.
- **Show:** owner (via the paper's parent page) can view; non-owner → 403; nonexistent → 404.
- **Update:** owner can update `content`; non-owner → 403.
- **Delete:** owner can delete; non-owner → 403; deleting a paper cascades its connected strings (create two strings touching the paper, delete it, assert both strings are gone).

## 4. Board endpoints

- **GET board:** returns all papers and all strings for the page in one payload; empty page returns empty arrays, not an error; non-owner → 403.
- **PATCH board — positions:** updates `x`/`y` for listed papers, leaves unlisted papers' positions untouched; a paper id that doesn't belong to `{page}` → 422 (not silently ignored — the batch must reject cross-page contamination).
- **PATCH board — strings:** creates new strings from the `strings` array; a pair already connected (either direction: `{a,b}` and `{b,a}` are the same connection) is skipped idempotently, not duplicated or errored; response's `created_strings` contains only the connections actually created, not the skipped ones.
- **PATCH board — validation:** request with neither `papers` nor `strings` → 422; a `paper1_id`/`paper2_id` pair referencing a paper from a different page → 422; `paper1_id === paper2_id` (self-connection) → 422.

## 5. String endpoints

- **Create:** valid pair on the same page → 201 with the string; papers from different pages → 422; same paper twice → 422; already-connected pair (either direction) → 422; non-owner of the page → 403.
- **Delete:** owner can delete; non-owner → 403; deleting a string does **not** delete its papers.

## 6. AI board generation

Feature tests (with `KnowledgeGraphGenerator` mocked):

- Empty page + mocked generator returning valid `{nodes, edges}` → 201, correct count of papers and strings created, every paper has non-null integer `x`/`y` (the regression test for the earlier null-position bug), a root concept (no incoming edges) has the minimum `y` value in the set.
- Page that already has papers → 409, and asserts **nothing** was created (no orphan papers/strings from a rejected request).
- Mocked generator returns malformed JSON / an edge referencing a nonexistent node id → the request fails cleanly (whatever status the controller maps `AiGenerationException` to — assert that, and assert no papers/strings were partially created; the transaction must roll back).
- Non-owner of the page → 403, generator is never called (assert the mock had zero invocations).

Unit tests for `TreeLayoutCalculator` (no DB, no HTTP — pure input/output):

- Single root, single child → child's `y` > root's `y`.
- Linear chain of 4 nodes → depths are strictly increasing 0,1,2,3.
- Diamond shape (two parents share one child) → the shared child's `x` sits between its two parents' `x` values (proves the barycenter centering).
- Multiple independent root nodes (a forest, not a single tree) → all at `y = 0`, spread apart in `x` rather than overlapping.
- A cycle in the input (shouldn't happen given the system prompt, but defend anyway) → either throws or handles gracefully without an infinite loop — assert whichever behavior the implementation chose, and that it terminates.

## 7. Cross-cutting authorization

- One parameterized/shared test (or a small set) hitting every owner-scoped endpoint (`pages/{page}`, `pages/{page}/papers`, `papers/{paper}`, `pages/{page}/board`, `pages/{page}/strings`, `strings/{string}`) as a second, unrelated authenticated user, asserting **403 everywhere**, not a mix of 403/404 that would leak existence.

## Deliverables

1. Pest test files organized under `tests/Feature/Auth`, `tests/Feature/Pages`, `tests/Feature/Papers`, `tests/Feature/Board`, `tests/Feature/Strings`, `tests/Feature/AiGeneration`, and `tests/Unit/TreeLayoutCalculatorTest.php`
2. Missing factories (`PageFactory`, `PaperFactory`, `StringFactory`)
3. A fake `KnowledgeGraphGenerator` test double, reusable across the AI generation tests
4. `phpunit.xml` / `pest.php` config confirmed to use an in-memory or dedicated test database — never run tests against the real dev database

## Style

- One assertion focus per test (a test named for "wrong password returns 422" shouldn't also assert throttling behavior — split them).
- Use factories + `->for()`/relationships instead of manually inserting rows.
- No sleeping/real time delays for throttle tests — control time explicitly.
- Every 403 test must confirm the resource still exists afterward (i.e., that the rejected request didn't accidentally mutate anything).
