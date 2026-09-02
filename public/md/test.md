Act as a senior frontend engineer and testing engineer with 10+ years of experience building production React + TypeScript applications.

I am building **Loom**, an AI-powered visual learning platform using:

* React
* TypeScript
* `@xyflow/react`
* TanStack Query
* Axios
* React Hook Form
* Zod
* Zustand
* Motion
* lucide-react

Your task is to **introduce a complete, maintainable frontend unit-testing setup** and create unit tests for the existing codebase.

The tests must be production-quality and follow the architecture of the project.

---

# Testing Stack

Use:

* **Vitest** as the test runner
* **React Testing Library** for React component testing
* `@testing-library/jest-dom` for DOM assertions
* `@testing-library/user-event` for realistic user interactions
* Use the existing backend API and its configured test or development environment for HTTP/API behavior. Do not introduce `msw` or mock backend requests unless a specific external dependency or isolated unit test requires it.

Do not introduce Jest.

Use TypeScript throughout the test code.

---

# Main Testing Philosophy

Test **behavior**, not implementation details.

Prefer:

```text
What does the user see?
What happens when the user clicks?
What happens when data succeeds?
What happens when data fails?
What does the hook return?
```

Avoid testing:

```text
Internal React implementation
Private functions that have no meaningful behavior
Exact component structure
Library internals
React Flow internals
```

Do not write fragile tests that break because HTML structure changes slightly.

---

# Test Folder Structure

Keep tests close to the feature they test.

Use:

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── __tests__/
│   │
│   ├── pages/
│   │   └── __tests__/
│   │
│   ├── papers/
│   │   └── __tests__/
│   │
│   ├── strings/
│   │   └── __tests__/
│   │
│   ├── board/
│   │   └── __tests__/
│   │
│   ├── ai/
│   │   └── __tests__/
│   │
│   └── learning/
│       └── __tests__/
│
├── test/
│   ├── setup.ts
│   ├── test-utils.tsx
│   ├── mocks/
│   └── factories/
│
└── ...
```

If the existing architecture has a better established convention, preserve it rather than restructuring unrelated files.

---

# Vitest Configuration

Create the required Vitest configuration.

Configure:

* jsdom environment
* setup file
* TypeScript support
* path aliases if the application uses them
* coverage
* test file discovery

Make sure the setup works with the existing Vite configuration.

---

# Global Test Setup

Create:

```text
src/test/setup.ts
```

Configure:

* `@testing-library/jest-dom`
* cleanup after each test
* MSW server lifecycle
* any required browser API mocks

Do not pollute the global environment with unnecessary mocks.

---

# Test Utilities

Create reusable utilities for common providers.

For example:

```text
src/test/test-utils.tsx
```

Provide a custom render helper that can optionally include:

* QueryClientProvider
* React Router
* other required providers

Example conceptual usage:

```ts
renderWithProviders(<Component />);
```

Do not create a huge abstraction that hides what the test requires.

---

# Test Factories

Create reusable test factories for domain objects.

Examples:

```text
src/test/factories/
├── user.factory.ts
├── page.factory.ts
├── paper.factory.ts
└── string.factory.ts
```

Example:

```ts
createMockPaper({
  id: 1,
  title: "React",
});
```

Factories should provide sensible defaults while allowing overrides.

Avoid duplicating large mock objects across tests.

---

# API Tests

Test API functions in:

```text
features/*/api/
```

Test:

* correct HTTP method
* correct endpoint
* request payload
* query parameters
* response transformation if any
* error propagation

Use MSW rather than mocking Axios itself whenever practical.

Example:

```text
useCreatePaper
      ↓
papers.api.ts
      ↓
Axios
      ↓
MSW
      ↓
mock HTTP response
```

---

# TanStack Query Hooks

Test hooks such as:

```text
usePages
usePage
useCreatePage
useUpdatePage
useDeletePage

usePapers
usePaper
useCreatePaper
useUpdatePaper
useDeletePaper
useUpdatePaperPosition

useStrings
useCreateString
useDeleteString

useGenerateLearningPath
useAskAI
```

Verify behavior such as:

### Query

* correct data is returned
* loading state
* error state
* disabled query behavior when required

### Mutation

* mutation succeeds
* mutation error is handled
* correct API method is called
* correct query cache is invalidated or updated
* optimistic behavior works if implemented

Do not test TanStack Query itself.

Test how our hooks use it.

---

# Zustand Store Tests

Test every meaningful Zustand store.

Examples:

```text
board.store.ts
auth.store.ts
ai.store.ts
pages.store.ts
```

Test:

* initial state
* selecting a paper
* clearing selection
* opening/closing panels
* active tool changes
* movable paper state
* AI assistant state
* reset behavior
* other actual business/UI behavior

Example:

```text
selectedPaperId = null

setSelectedPaper("12")

→ selectedPaperId = "12"
```

Do not test Zustand library internals.

---

# Zod Schema Tests

Test validation schemas independently.

For example:

```text
auth.schema.ts
page.schema.ts
paper.schema.ts
string.schema.ts
ai.schema.ts
```

Test:

* valid input passes
* required fields reject invalid input
* incorrect types reject
* boundaries
* important business constraints

Include meaningful edge cases.

---

# React Hook Form Tests

For forms such as:

```text
LoginForm
RegisterForm
CreatePageDialog
CreatePaperDialog
EditPaperForm
AIPromptInput
```

Test behavior:

```text
User enters valid data
    ↓
Submit
    ↓
Mutation called with correct payload
```

and:

```text
User submits invalid data
    ↓
Validation errors appear
    ↓
Mutation is not called
```

Use `userEvent`.

Do not directly call internal submit handlers.

---

# UI Component Tests

Test important components according to user behavior.

Examples:

### PageCard

Verify:

* title appears
* progress appears
* selected state is visible
* clicking selects/navigates as expected
* menu actions work

### PageList

Verify:

* pages render
* empty state
* loading state
* error state
* pagination/infinite loading behavior

### PaperNode

Verify:

* title/content appear
* status appears
* selected state
* interaction behavior
* action menu

### Concept Detail Panel

Verify:

* selected concept is shown
* close works
* AI actions are triggered

### AIAssistant

Verify:

* input works
* submit works
* loading state
* response rendering
* error state

---

# React Flow Tests

Do NOT attempt to test every internal behavior of React Flow.

React Flow is an external library.

Test only the behavior that belongs to Loom.

Examples:

### PaperNode

Test:

* correct paper information rendered
* selected state
* our custom buttons
* our custom event handlers
* our custom handles if meaningful

### RedStringEdge

Test:

* custom relationship UI appears correctly
* labels/actions behave correctly
* delete interaction if implemented

### LearningBoard

Test:

* backend nodes are mapped to React Flow nodes
* backend strings are mapped to React Flow edges
* selecting a node updates Loom state
* deleting a node triggers expected behavior
* board persistence is triggered after drag completion if this behavior belongs to our code

Do NOT assert pixel coordinates generated internally by React Flow unless those coordinates are explicitly produced by our own logic.

---

# Critical Paper Dragging Tests

The board has an important interaction:

```text
Single click
→ inspect/select

Double click
→ activate movement

Drag
→ move paper

Release
→ save position
```

Create tests for the behavior implemented by Loom.

Test that:

1. Single click does not trigger deletion.
2. Double click activates the movable state.
3. Drag completion triggers the persistence logic.
4. Continuous dragging does not trigger repeated API calls if the implementation is designed that way.
5. Saving eventually sends the expected paper position.
6. Connected relationships remain represented correctly by our board state.

Do not attempt to reproduce actual browser-level pointer physics unless necessary.

Test our event logic around React Flow.

---

# Board Persistence Tests

For:

```text
useBoardPersistence
useSaveBoard
board.serializer.ts
```

test:

```text
Paper moved
    ↓
board becomes dirty
    ↓
save is scheduled
    ↓
correct payload generated
    ↓
API mutation called
```

Test debounce behavior with Vitest fake timers where appropriate.

Example:

```text
Move paper
→ API should not immediately be called

Advance timers
→ API should be called once
```

Also test:

* multiple changes are batched if implemented
* failed save
* successful save
* retry behavior

---

# Mapper and Utility Tests

Test pure functions thoroughly.

Examples:

```text
node.mapper.ts
edge.mapper.ts
board.serializer.ts
edge.utils.ts
board.utils.ts
```

These are ideal unit-test candidates.

Test:

```text
backend paper
     ↓
React Flow node
```

and:

```text
backend string
     ↓
React Flow edge
```

Verify:

* IDs
* positions
* data
* source
* target
* edge type
* custom metadata

These tests should be fast and independent of React.

---

# AI Tests

The AI feature is important to Loom.

Test:

```text
useGenerateLearningPath
```

with successful and failed responses.

Given:

```text
"React"
```

and mocked backend response:

```json
{
  "goal": "React",
  "target": "Build a React application",
  "nodes": [
    {
      "id": "n1",
      "content": "JavaScript Fundamentals"
    },
    {
      "id": "n2",
      "content": "React Components"
    }
  ],
  "edges": [
    {
      "from": "n1",
      "to": "n2"
    }
  ]
}
```

verify that the application correctly handles the response.

Also test malformed AI responses through Zod validation if schema validation exists.

---

# Authentication Tests

Test:

```text
LoginForm
RegisterForm
useLogin
useRegister
useLogout
useCurrentUser
AuthGuard
```

Verify:

```text
Successful login
→ authentication state updates
→ user can access protected application
```

```text
Invalid login
→ error is shown
→ user is not incorrectly authenticated
```

```text
Unauthenticated user
→ protected route redirects appropriately
```

Do not test backend authentication itself.

Test frontend behavior.

---

# Pagination Tests

The pages sidebar uses backend cursor pagination.

Test the infinite-query behavior.

Verify:

```text
Initial request
→ first page appears
```

Then:

```text
next cursor available
→ next page requested
→ new pages appended
```

Verify that:

* previous pages remain
* duplicate pages are not created by our logic
* loading-more state appears
* pagination error is handled
* no-more-pages works correctly

Do not test TanStack Query's internal pagination implementation.

---

# Coverage

Configure coverage reporting.

Use `v8` coverage.

Track:

* statements
* branches
* functions
* lines

Do not blindly require 100% coverage.

Prioritize high-value code:

1. domain logic
2. API hooks
3. stores
4. mappers
5. validation
6. important user interactions

A lower percentage with strong tests is better than a high percentage of meaningless tests.

---

# Test Naming

Use descriptive names.

Good:

```ts
it("opens the concept panel when a paper is clicked")
```

```ts
it("saves the paper position after dragging stops")
```

```ts
it("loads the next cursor page when more pages are available")
```

Bad:

```ts
it("works")
```

```ts
it("renders")
```

---

# Test Organization

Follow:

```text
describe("Feature / Component")
    describe("behavior")
        it("...")
```

Keep tests focused.

One test should verify one meaningful behavior.

Do not create enormous test files with unrelated behaviors.

---

# What NOT to Test

Do not waste time testing:

* React itself
* TanStack Query internals
* Zustand internals
* Axios internals
* React Flow internals
* lucide-react icons
* Motion internals
* trivial TypeScript type declarations
* static constants unless they contain meaningful business rules

---

# Integration vs Unit Tests

Do not force everything into unit tests.

Use unit tests for:

```text
pure functions
stores
schemas
API functions
hooks
isolated UI behavior
mappers
utilities
```

Use integration-style tests with providers/MSW for:

```text
form → mutation
component → TanStack Query
sidebar → infinite query
AI flow → API response
```

Do not create end-to-end tests unless the repository already has an E2E setup.

---

# Mocking Rules

Prefer realistic mocks.

Use:

```text
MSW
```

for network behavior.

Use Vitest mocks only where necessary, such as:

* browser APIs
* external modules that are impossible or expensive to execute
* time
* specific non-deterministic behavior

Do not mock every dependency.

Excessive mocking produces tests that pass while the real application is broken.

---

# Test Quality Requirements

Every test should be:

* deterministic
* isolated
* readable
* fast
* behavior-focused
* independent from test execution order

Do not use arbitrary `setTimeout`.

Use:

* `waitFor`
* `findBy...`
* fake timers where appropriate
* explicit async handling

---

# Accessibility in Tests

Prefer accessible selectors:

```text
getByRole
getByLabelText
getByText
getByPlaceholderText
```

Avoid:

```text
querySelector(".some-random-class")
```

unless there is genuinely no better selector.

The test suite should encourage accessible UI.

---

# Deliverables

Implement:

1. Vitest configuration.
2. Global test setup.
3. React test utilities.
4. MSW setup.
5. Test factories.
6. Unit tests for core utilities.
7. Unit tests for Zustand stores.
8. Unit tests for Zod schemas.
9. Tests for API functions.
10. Tests for TanStack Query hooks.
11. Tests for important React components.
12. Tests for board interaction logic.
13. Tests for AI behavior.
14. Tests for authentication behavior.
15. Tests for cursor pagination.
16. Coverage configuration.

Do not rewrite production code unless a small change is genuinely required to make behavior testable.

If production code must be changed, keep the change minimal and preserve existing behavior.

---

# Final Verification

After implementing the tests:

Run the complete test suite.

Fix:

* failing tests
* flaky tests
* TypeScript errors
* incorrect mocks
* invalid assumptions about the application

Then run coverage.

Report:

```text
Test files:
Tests:
Passed:
Failed:
Coverage:
```

Also identify any important application areas that remain insufficiently tested.

The final test suite should be maintainable as Loom grows and should protect the most important user behaviors rather than merely increasing the coverage percentage.
