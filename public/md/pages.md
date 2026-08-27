# MindBoard — Main App Sidebar and Cursor-Paginated Learning Pages

Act as a senior UI/UX designer and frontend architect with 10+ years of experience building modern educational SaaS applications.

Design the **main authenticated application screen** for MindBoard.

The user has already completed either:

* Sign Up
* Login

After successful authentication, redirect the user directly to the **Main Learning Workspace**.

The main workspace should contain a **draggable/resizable sidebar** that displays the user's learning pages.

The sidebar is connected to a backend API using **cursor-based pagination**.

---

# 1. Main Application Layout

Create a desktop-first authenticated layout.

```text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  SIDEBAR                         MAIN WORKSPACE              │
│                                                              │
│  Learning Notebook               Cork Board                 │
│                                                              │
│  [ + New Page ]                 Knowledge Map              │
│                                                              │
│  React Mastery                                             │
│  Laravel Backend                                           │
│  Machine Learning                                          │
│                                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

The sidebar should be positioned on the left.

The main board should occupy the remaining screen space.

---

# 2. Sidebar Concept

The sidebar should feel like a **physical notebook drawer**, not a normal admin dashboard sidebar.

Visual metaphor:

* notebook index
* paper tabs
* subtle paper texture
* warm colors
* soft shadows
* slightly handcrafted appearance
* modern SaaS usability

The design must remain professional and premium.

Do not make it childish or overly decorative.

---

# 3. Sidebar Width

Default width:

**320px**

Minimum:

**240px**

Maximum:

**450px**

The user can resize the sidebar horizontally using a visible but subtle drag handle.

Example:

```text
┌───────────────┬───────────────────────────────┐
│               │                               │
│   Sidebar     │        Main Board             │
│               │                               │
│               │                               │
│              ║│                               │
└───────────────┴───────────────────────────────┘
                ↑
           drag handle
```

When hovering the resize handle:

* cursor changes to `col-resize`
* handle becomes slightly more visible
* smooth interaction

Persist the user's sidebar width locally.

---

# 4. Sidebar Header

Create a clean header inside the sidebar.

Display:

```text
📖 Learning Notebook
```

Under it show a small contextual subtitle:

```text
Your learning world
```

Add a small collapse button on the right.

Icon:

`PanelLeftClose`

When clicked, the sidebar collapses.

Collapsed state:

```text
┌───┐
│ 📖│
│   │
│ + │
│   │
│ 📌│
│ 📌│
│ 📌│
└───┘
```

When collapsed, only icons/mini page indicators should remain.

---

# 5. New Page Button

Immediately below the header place:

```text
+ New Learning Page
```

This should be the primary sidebar action.

Use a paper-like button.

Hover:

* slight lift
* subtle shadow
* small Motion animation

Clicking opens the **Create Learning Page** dialog.

---

# 6. Page List

Below the create button, display the user's learning pages.

Example:

```text
MY PAGES

┌────────────────────────────┐
│ 📌 React Mastery           │
│    24 concepts · 72%       │
└────────────────────────────┘

┌────────────────────────────┐
│ 📌 Laravel Backend         │
│    18 concepts · 43%       │
└────────────────────────────┘

┌────────────────────────────┐
│ 📌 Machine Learning        │
│    31 concepts · 12%       │
└────────────────────────────┘
```

Each page item should contain:

* page title
* concept count
* progress percentage
* status indicator
* optional last-updated information

---

# 7. Active Page

The selected page must have a clearly recognizable active state.

Use:

* slightly elevated paper card
* stronger shadow
* small red pin
* subtle paper rotation
* warm background difference

Example:

```text
┌────────────────────────────┐
│ 📌 React Mastery            │
│    24 concepts · 72%        │
│                             │
│    ACTIVE                   │
└────────────────────────────┘
```

Do not use a generic blue active background.

Stay consistent with the MindBoard visual identity.

---

# 8. Page Hover Interaction

On hover:

* paper lifts slightly
* shadow becomes stronger
* tiny rotation
* action buttons appear

Show:

```text
⋮
```

Actions:

```text
Rename
Duplicate
Archive
Delete
```

Use Motion for subtle transitions.

Avoid excessive animation.

---

# 9. Cursor Pagination

The backend returns pages using **cursor-based pagination**.

Assume API response conceptually looks like:

```json
{
  "data": [
    {
      "id": 1,
      "title": "React Mastery",
      "status": "active",
      "progress": 72
    }
  ],
  "meta": {
    "next_cursor": "eyJpZCI6MTB9",
    "prev_cursor": null,
    "has_more": true
  }
}
```

Do NOT design traditional numbered pagination.

Do NOT display:

```text
1 2 3 4 5
```

Instead, the sidebar should use **infinite scrolling**.

---

# 10. Infinite Scroll Behavior

The page list should automatically load more pages when the user reaches near the bottom.

Flow:

```text
User scrolls
      ↓
Near bottom
      ↓
Detect intersection
      ↓
Request next cursor
      ↓
Append new pages
      ↓
Keep existing pages visible
```

The user should not feel like the entire sidebar reloads.

Existing pages should remain in place while new pages are added.

---

# 11. Loading State

While loading the next cursor page:

Display 1–3 compact paper skeletons.

Example:

```text
┌────────────────────────────┐
│ ███████████████            │
│ ████████                   │
└────────────────────────────┘

┌────────────────────────────┐
│ █████████████              │
│ █████████                  │
└────────────────────────────┘
```

Use subtle Motion shimmer.

Do not show a large global loading screen for pagination.

---

# 12. End of Pagination

When there are no more pages:

Do not display a large pagination control.

Instead, optionally show a subtle message:

```text
You've reached the end of your notebook.
```

Or simply stop loading without any message.

---

# 13. Empty State

When a new user has no pages:

Display a beautiful notebook empty state.

Example:

```text
        📖

Your notebook is empty.

Start with something
you want to learn.

[ + Create Your First Page ]
```

The empty state should visually connect to the cork-board metaphor.

Do not show a generic SaaS empty state.

---

# 14. Main Workspace

The main workspace should remain visible while the sidebar is used.

The center area is the **MindBoard Cork Board**.

Example:

```text
┌───────────────┬──────────────────────────────────────────┐
│               │                                          │
│ Learning      │             React Mastery                │
│ Notebook      │                                          │
│               │      📌                                   │
│ + New Page    │    ┌──────────┐                           │
│               │    │ JSX      │                           │
│ React         │    └────┬─────┘                           │
│ Laravel       │         │                                 │
│ AI            │      ~~~~~~~~ red string                 │
│               │         │                                 │
│               │    ┌────▼─────┐                           │
│               │    │Components│                           │
│               │    └──────────┘                           │
│               │                                          │
└───────────────┴──────────────────────────────────────────┘
```

The sidebar should never visually overpower the board.

The board is the main product.

---

# 15. Sidebar Navigation Behavior

When the user clicks a page:

```text
Page selected
      ↓
Update active page
      ↓
Load selected page
      ↓
Load its papers
      ↓
Load its strings
      ↓
Display board
```

The page switching animation should be subtle.

Use Motion for:

* active page transition
* board transition
* loading indicator

---

# 16. Mobile Behavior

On mobile, the sidebar should become an overlay/bottom drawer.

Default:

```text
┌──────────────────────────────┐
│                              │
│         Cork Board           │
│                              │
│                              │
│                              │
│                         📖   │
└──────────────────────────────┘
```

Clicking the notebook icon opens:

```text
┌──────────────────────────────┐
│ Learning Notebook        ✕   │
│                              │
│ + New Learning Page          │
│                              │
│ 📌 React                     │
│ 📌 Laravel                   │
│ 📌 Machine Learning          │
│                              │
└──────────────────────────────┘
```

The mobile sidebar should support vertical scrolling and cursor/infinite pagination behavior exactly like desktop.

---

# 17. UX States to Design

Create all important states:

### Normal

Pages loaded.

### Loading initial pages

Skeletons.

### Loading next cursor page

Small bottom loading indicator.

### Empty

No pages.

### Error

API pagination failed.

Display:

```text
Couldn't load more pages.

[ Try Again ]
```

### Offline / reconnecting

Use a subtle status indicator rather than blocking the entire board.

---

# 18. Technical Interaction Model

The frontend should be designed assuming:

```text
TanStack Query
        ↓
usePages()
        ↓
useInfiniteQuery()
        ↓
cursor pagination
```

The sidebar should use the backend's cursor rather than page numbers.

Conceptually:

```text
GET /api/pages

        ↓
cursor = null

        ↓

GET /api/pages?cursor=ABC123

        ↓

GET /api/pages?cursor=XYZ789
```

New results are appended to the existing list.

---

# 19. Draggable / Resizable Sidebar

Important:

Interpret "draggable sidebar" primarily as a **resizable sidebar**, not a sidebar that can freely float around the screen.

The sidebar should stay attached to the left edge.

The user changes its width by dragging its right edge.

This preserves a stable workspace while giving the user control over how much room the notebook occupies.

---

# 20. Visual Language

Use the MindBoard design system:

### Cork

`#8B5A2B`

### Paper

`#FFF8E7`

### Ink

`#292524`

### Red String

`#C0392B`

### AI Accent

`#8B5CF6`

### Success

`#22C55E`

### Learning

`#EAB308`

Avoid excessive blue.

---

# 21. Typography

Use:

### Interface

Inter / Geist

### Notebook and paper titles

Caveat / Patrick Hand

Handwritten fonts should be used sparingly.

The product must remain highly readable.

---

# 22. Overall UX Goal

The moment a user logs in, they should immediately understand:

> "This is my personal learning notebook."

The flow should feel like:

```text
Login / Sign Up
       ↓
Main Workspace
       ↓
Learning Notebook sidebar
       ↓
Select or create learning page
       ↓
Open visual knowledge board
```

The sidebar is the user's **navigation through their learning worlds**.

The cork board is the user's **current learning world**.

The page list should feel personal, visual, tactile, and effortless to navigate.

Build the UI as a polished production-ready SaaS interface, not as a generic dashboard.
