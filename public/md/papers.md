You are a senior React + TypeScript engineer with 10+ years of experience building interactive canvas applications with `@xyflow/react`.

I am building **MindBoard**, an AI-powered visual learning application.

The main workspace contains a large cork-board canvas. Learning concepts are represented as paper cards, and relationships between concepts are represented as red string edges.

The board must use **`@xyflow/react`**.

Your task is to implement the paper interaction and movement system described below.

---

# 1. Technology Requirements

Use:

* React
* TypeScript
* `@xyflow/react`
* Zustand for client/UI state
* TanStack Query for server state
* Axios for API requests
* Motion for UI animations

Do not introduce another canvas library.

React Flow must remain responsible for:

* Nodes
* Edges
* Dragging
* Selection
* Zoom
* Pan
* Viewport
* Connection handling

---

# 2. Important Interaction Rule

There is NO global "Edit Board" mode.

The board is always in the normal learning state.

Paper interaction works like this:

```text
Single click
    ↓
Select paper / open concept details

Double click
    ↓
Activate paper movement

Drag
    ↓
Move paper anywhere on the board

Release
    ↓
Stop movement and save position

Delete key / context menu
    ↓
Delete paper intentionally
```

Do NOT make double-click delete the paper.

---

# 3. React Flow Architecture

Create a custom node:

```text
PaperNode
```

and register it in:

```ts
nodeTypes
```

Example architecture:

```text
LearningBoard
    │
    └── ReactFlow
          │
          ├── PaperNode
          ├── RedStringEdge
          ├── Background
          └── Controls
```

Keep all board-specific logic inside:

```text
features/board/
```

---

# 4. PaperNode

Create a custom React Flow node:

```text
features/board/nodes/PaperNode.tsx
```

The node should render a physical paper card.

It must support:

* title
* content preview
* difficulty
* status
* pin
* source/target handles
* selected state
* dragging state
* activated/movable state

Use React Flow's node props rather than maintaining a second independent position system.

The React Flow node position is the source of truth for the visual board position.

---

# 5. Paper States

Create clear states:

```ts
type PaperInteractionState =
  | "idle"
  | "selected"
  | "movable"
  | "dragging";
```

### Idle

Normal paper.

```text
cursor: pointer
normal shadow
```

### Selected

After single click:

```text
subtle outline
slightly stronger shadow
context actions available
```

### Movable

After double click:

```text
elevated paper
slightly larger shadow
cursor: grab
```

### Dragging

While moving:

```text
cursor: grabbing
stronger shadow
slight scale
slight rotation
```

Use Motion for visual transitions.

---

# 6. Single Click

Single click on a paper should:

1. Select the node.
2. Store the selected paper ID in Zustand.
3. Open the concept details panel.
4. Do NOT start movement.

Example:

```ts
handlePaperClick(paperId);
```

Zustand state can contain:

```ts
selectedPaperId: string | null;
isDetailsPanelOpen: boolean;
```

Do not put the complete paper object into Zustand if it already exists in TanStack Query / React Flow state.

---

# 7. Double Click

Double-clicking a paper should activate its movable state.

Example:

```text
double click
      ↓
paper becomes movable
      ↓
cursor = grab
```

It should NOT:

* delete the paper
* navigate away
* open a second editor

Store the ID of the currently movable paper in Zustand:

```ts
movablePaperId: string | null;
```

Only the activated paper should enter the special movable state.

---

# 8. Dragging

Use React Flow's native node dragging behavior.

Do NOT manually calculate:

```text
mouseX - startX
mouseY - startY
```

Do not create a custom drag implementation when React Flow already provides it.

Use:

```ts
onNodeDragStart
onNodeDrag
onNodeDragStop
```

The position should remain inside React Flow's node state.

---

# 9. Restrict Dragging to Activated Paper

A normal selected paper should NOT accidentally move.

The desired behavior is:

```text
Single click
→ selected
→ cannot intentionally move

Double click
→ movable
→ can drag
```

Implement this carefully without breaking React Flow's node interaction system.

Avoid hacks that cause the canvas to become difficult to pan or interact with.

Use the cleanest React Flow-compatible approach.

---

# 10. Connected Strings

Every paper can have multiple connected strings.

Example:

```text
JavaScript
      |
      |
    React
      |
      |
  Components
```

When a paper moves:

```text
Paper position changes
        ↓
React Flow recalculates edge paths
        ↓
RedStringEdge follows automatically
```

Do NOT store:

```text
string.startX
string.startY
string.endX
string.endY
```

The database only stores:

```ts
{
  id,
  page_id,
  source_paper_id,
  target_paper_id,
  relationship_type
}
```

React Flow should calculate the actual rendered string path.

---

# 11. Custom Red String Edge

Create:

```text
features/board/edges/RedStringEdge.tsx
```

Use React Flow's edge utilities to calculate the path.

The visual style should be:

```text
stroke: #C0392B
strokeWidth: 2
fill: none
```

The string should have:

* rounded caps
* subtle physical appearance
* curved path where appropriate
* smooth updates while nodes move

The string must remain attached to the nodes automatically.

---

# 12. Save Position

When dragging starts:

```text
do not call API
```

While dragging:

```text
do not call API continuously
```

When the user releases:

```text
onNodeDragStop
      ↓
update local position
      ↓
mark board dirty
      ↓
debounced mutation
      ↓
PATCH backend
```

Use TanStack Query for the mutation.

Example endpoint:

```http
PATCH /api/pages/{pageId}/board
```

Payload can contain the changed node:

```json
{
  "papers": [
    {
      "id": 12,
      "x": 480,
      "y": 240
    }
  ]
}
```

For multiple changed papers, support batching:

```json
{
  "papers": [
    {
      "id": 12,
      "x": 480,
      "y": 240
    },
    {
      "id": 15,
      "x": 700,
      "y": 320
    }
  ]
}
```

---

# 13. Save Status

Create a small unobtrusive board status:

```text
Saved ✓
```

During mutation:

```text
Saving...
```

After success:

```text
Saved ✓
```

If the request fails:

```text
Couldn't save changes
[Retry]
```

Do not use blocking toast notifications for normal saves.

---

# 14. Delete Paper

Deletion must be intentional.

Support:

### Delete / Backspace

When a paper is selected:

```text
Delete
   ↓
confirmation
   ↓
DELETE /api/papers/{id}
```

Also support a context menu:

```text
⋮

View
Edit
Duplicate
Delete
```

When deleting a paper, its connected strings should also be removed.

The UI should update optimistically where appropriate.

---

# 15. Context Menu

Create a small contextual menu for the selected paper.

Actions:

```text
View concept
Edit concept
Duplicate
Delete
```

Do not make the menu permanently visible on every paper.

Only show it for the selected paper or on hover when appropriate.

---

# 16. Prevent Double-Click Problems

Be careful with the difference between:

```text
click
click
```

and:

```text
double click
```

A single click should open the concept panel.

A double-click should activate movement.

Avoid opening/closing the panel in an awkward way when the second click arrives.

Use a clean event-handling strategy rather than arbitrary delays scattered across components.

---

# 17. Motion

Use Motion only for visual feedback.

### Double click

Paper:

```text
scale: 1 → 1.03
shadow: increase
```

### Dragging

Paper appears slightly elevated.

### Drop

Small spring-like settle.

### Delete

Paper can shrink/fade before removal.

Do not animate React Flow's actual coordinates with a separate animation system that conflicts with node dragging.

React Flow controls the position.

Motion controls the visual presentation.

---

# 18. Board Store

Use:

```text
features/board/store/board.store.ts
```

The store should contain UI/client state such as:

```ts
type BoardState = {
  selectedPaperId: string | null;
  movablePaperId: string | null;
  isDetailsPanelOpen: boolean;
  selectedStringId: string | null;

  setSelectedPaper: (id: string | null) => void;
  setMovablePaper: (id: string | null) => void;
  setSelectedString: (id: string | null) => void;
};
```

Do NOT use Zustand as the source of truth for server-fetched papers.

Do NOT duplicate all paper data in Zustand.

---

# 19. React Flow State

Keep React Flow state local to the board or in a dedicated board state hook.

Use the React Flow APIs for:

```text
nodes
edges
setNodes
setEdges
onNodesChange
onEdgesChange
onConnect
```

Map backend models into React Flow models through:

```text
node.mapper.ts
edge.mapper.ts
```

Example:

```ts
backend paper
      ↓
paperToNode()
      ↓
React Flow Node
```

and:

```ts
backend string
      ↓
stringToEdge()
      ↓
React Flow Edge
```

---

# 20. Important Separation

Use this architecture:

```text
Laravel
   ↓
Axios
   ↓
TanStack Query
   ↓
Backend models
   ↓
Mapper
   ↓
React Flow nodes / edges
```

And:

```text
Zustand
   ↓
UI state only
```

Do not mix these responsibilities.

---

# 21. Infinite Canvas

The board must support:

* pan
* zoom
* fit view
* large spatial area

The sidebar and details panel should not break React Flow's viewport behavior.

The paper positions must continue working correctly at any zoom level.

---

# 22. Touch / Mobile

Desktop:

```text
single click
→ inspect

double click
→ activate movement

drag
→ move
```

Mobile:

```text
tap
→ inspect

long press
→ activate movement

drag
→ move
```

Do not rely exclusively on double-click for touch devices.

---

# 23. File Structure

Implement using this structure:

```text
features/board/
├── components/
│   ├── LearningBoard.tsx
│   ├── BoardToolbar.tsx
│   └── BoardStatus.tsx
│
├── nodes/
│   ├── PaperNode.tsx
│   ├── PaperNodePin.tsx
│   └── PaperNodeHandles.tsx
│
├── edges/
│   ├── RedStringEdge.tsx
│   └── edge.utils.ts
│
├── hooks/
│   ├── api/
│   │   └── useSaveBoard.ts
│   │
│   └── ui/
│       ├── useBoard.ts
│       ├── useBoardPersistence.ts
│       └── useBoardInteractions.ts
│
├── store/
│   └── board.store.ts
│
├── utils/
│   ├── node.mapper.ts
│   ├── edge.mapper.ts
│   └── board.serializer.ts
│
└── types/
    └── board.types.ts
```

---

# 24. Acceptance Criteria

The implementation is correct only when all of these work:

### Paper interaction

* Single click selects paper.
* Single click opens concept panel.
* Single click does not move paper.
* Double click activates paper movement.
* Activated paper can be dragged.
* Paper can be moved anywhere on the board.
* Paper follows cursor smoothly.
* Connected strings follow automatically.
* Releasing the paper ends dragging correctly.

### Persistence

* No API requests during continuous dragging.
* Position is saved after drag completion.
* Save is debounced/batched.
* Saving state is visible.
* Failed saves can be retried.

### Deletion

* Delete requires an intentional action.
* Double click never deletes.
* Deleting a paper removes its connected relationships.

### Board

* Pan works.
* Zoom works.
* Paper movement works at different zoom levels.
* Strings remain correctly attached.
* Sidebar/details panel do not break the canvas.

---

# 25. Code Quality Requirements

Use:

* TypeScript types instead of `any`
* Small focused components
* Reusable hooks
* Clear naming
* No duplicated API logic
* No duplicated board state
* No manual edge-coordinate calculations
* No second canvas library
* No unnecessary Zustand state
* No API calls directly from presentational components

Before finalizing, verify that the implementation does not fight React Flow's native node-dragging, selection, viewport, or edge systems.

The resulting experience should feel like the user is **picking up a real paper from a cork board and placing it somewhere else**, while React Flow handles the underlying spatial and graph mechanics.
