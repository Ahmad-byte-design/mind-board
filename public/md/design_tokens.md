# MindBoard Design Tokens

## Fonts

| Role | Font | Weights / usage |
| --- | --- | --- |
| Interface / body | **DM Sans** | 400, 500, 600, 700 — navigation, buttons, descriptions, controls, and general UI text. |
| Handwritten display | **Caveat** | 500, 600, 700 — concept titles, notebook headings, and emotionally expressive headings. |
| Metadata / labels | **DM Mono** | 400, 500 — status labels, map metadata, small caps-style labels, and progress data. |

### Font loading

```css
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
```

---

## Colors

### Core ground

| Token | Hex | Purpose |
| --- | --- | --- |
| `ink-deep` | `#171510` | Deepest application and loading-screen background. |
| `ink` | `#181713` | Landing-page background. |
| `workspace` | `#272119` | Main board workspace surround. |
| `surface-dark` | `#29231F` | AI assistant and dark floating surfaces. |
| `paper` | `#FFF8E7` | Primary paper, notes, panels, and light text. |
| `paper-muted` | `#F5E8CF` | Secondary paper surfaces and practice cards. |
| `notebook` | `#E8DAC0` | Notebook sidebar background. |

### Material palette

| Token | Hex | Purpose |
| --- | --- | --- |
| `cork` | `#94613A` | Core corkboard field. |
| `cork-light` | `#B87C42` | Cork highlights and inner board edge. |
| `wood-dark` | `#422411` | Dark wood frame shading. |
| `wood` | `#5B351C` | Main wooden board frame. |
| `wood-light` | `#A36C3C` | Wood frame highlight. |
| `ink-paper` | `#302923` | Primary text on paper surfaces. |
| `ink-muted` | `#61574C` | Supporting text on paper. |

### Semantic accents

| Token | Hex | Purpose |
| --- | --- | --- |
| `red` | `#D04535` | Primary CTA, selected board state, and warm emphasis. |
| `red-deep` | `#B8312B` | Connection strings and stronger red detail. |
| `string` | `#AA2F2A` | Physical red thread connections. |
| `purple` | `#795BD1` | AI assistant floating action button. |
| `purple-deep` | `#6E4ECA` | AI tutor call-to-action. |
| `gold` | `#E4AD64` | Handwritten emphasis, active edit affordances, warm highlights. |
| `green` | `#3B9A60` | Completed / mastered concept pins. |
| `yellow` | `#E3B22F` | In-progress concept pins. |
| `pin-white` | `#E2DFD4` | Not-started concept pins. |

### Neutral / border colors

| Token | Hex | Purpose |
| --- | --- | --- |
| `line-paper` | `#CFC1A9` | Rules inside concept papers. |
| `border-paper` | `#C8B18E` | Paper control borders. |
| `border-dark` | `rgba(255, 248, 231, 0.18)` | Borders on dark surfaces. |
| `text-dark-muted` | `#C4BBAE` | Supporting text on dark surfaces. |

---

## Usage notes

- Use **paper and cork** as the dominant tactile materials; the saturated accents should stay selective.
- Use **Caveat** for human, exploratory, and handwritten moments—not dense utility text.
- Use **DM Mono** at small sizes for structural labels only.
- Keep red strings and green/yellow/white pins meaningful: they communicate concept relationships and learning status.
