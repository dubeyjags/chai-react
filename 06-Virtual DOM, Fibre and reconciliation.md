# Virtual DOM, Fibre and Reconciliation

Reference: https://github.com/acdlite/react-fiber-architecture

---

## 1. The Real Browser DOM — The Problem

When you update something on a webpage, the browser has to:
1. Re-parse HTML
2. Rebuild the DOM tree
3. Recalculate styles (layout/paint)
4. Re-render pixels on screen

This is **slow and expensive** — especially when only 1 element out of 1000 changed.

```
Real DOM Update Flow:
─────────────────────────────────────────────
User action → JS changes DOM → Browser reflows
              (slow, entire tree re-renders)
─────────────────────────────────────────────
```

---

## 2. Virtual DOM — The Solution

Virtual DOM (vDOM) is a **lightweight JS object** that is a copy/mirror of the real DOM.

React keeps this copy in memory. When state changes, React first updates the vDOM, NOT the real DOM.

```
Virtual DOM = Plain JS Object

Real DOM node:          Virtual DOM node:
<div id="box">    →     { type: 'div', props: { id: 'box' }, children: [...] }
  <h1>Hello</h1>          { type: 'h1', props: {}, children: ['Hello'] }
</div>
```

### vDOM Flow
```
State/Props change
        │
        ▼
React creates NEW vDOM tree
        │
        ▼
Compare NEW vDOM  vs  OLD vDOM   ← this is Reconciliation
        │
        ▼
Find ONLY the changed parts (diff)
        │
        ▼
Update ONLY those parts in Real DOM  ← minimum DOM writes
```

---

## 3. Reconciliation — The Comparison Algorithm

Reconciliation is the process React uses to **compare the old vDOM with the new vDOM** and figure out what actually changed.

> "Reconciliation = diffing old tree vs new tree"

### Rules React uses during reconciliation:

| Situation | What React does |
|---|---|
| Same element type (e.g. `<div>` → `<div>`) | Update only changed attributes |
| Different element type (e.g. `<div>` → `<span>`) | Destroy old tree, build new tree |
| List items with `key` prop | Match items by key, reuse/move nodes |
| List items without `key` prop | Naively re-render entire list |

### Example — Why `key` matters
```jsx
// Without key — React re-renders all 3 items even if only 1 changed
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>

// With key — React reuses unchanged items
<ul>
  <li key="1">Apple</li>
  <li key="2">Banana</li>
  <li key="3">Cherry</li>
</ul>
```

---

## 4. React Fiber — The Algorithm

Fiber is the **reconciliation engine** introduced in React 16.

Before Fiber, React used a **stack-based** reconciler — it could not be interrupted once started.

> Fiber = a new internal data structure (a "fiber" = a unit of work for one component)

### What Fiber can do that old React couldn't:

| Feature | Old React (Stack) | React Fiber |
|---|---|---|
| Pause work mid-way | No | Yes |
| Come back to paused work | No | Yes |
| Assign priority to updates | No | Yes |
| Reuse completed work | No | Yes |
| Abort unnecessary work | No | Yes |

### 4.1 Pause and Resume
```
Old React:
─────────────────────────────────────────
Start rendering 1000 components...
Cannot stop. Browser freezes. UI hangs.
─────────────────────────────────────────

React Fiber:
─────────────────────────────────────────
Start rendering...
User clicks button? → PAUSE rendering
Handle click first (high priority)
RESUME rendering from where it stopped
─────────────────────────────────────────
```

### 4.2 Priority (Scheduling)
Fiber uses a **scheduler** to assign priority levels to different updates.

```
Priority levels (high → low):
──────────────────────────────────────────
ImmediatePriority   → e.g. input keystroke
UserBlockingPriority → e.g. button click
NormalPriority       → e.g. data fetch result
LowPriority          → e.g. analytics update
IdlePriority         → e.g. pre-rendering offscreen content
──────────────────────────────────────────
```

```jsx
// React 18+ — you can hint at lower priority with useTransition
import { useTransition } from 'react'

function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  function handleChange(e) {
    setQuery(e.target.value)                    // high priority — update input immediately

    startTransition(() => {
      setResults(filterData(e.target.value))    // low priority — can be deferred
    })
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending ? <p>Loading...</p> : <ResultsList data={results} />}
    </>
  )
}
```

### 4.3 Reuse
If Fiber pauses work on a component and later decides the output is still valid, it can **reuse** the computed result instead of re-running.

### 4.4 Abort
If a higher-priority update comes in while Fiber is working on a low-priority tree, Fiber can **discard** the in-progress work and restart with the new data.

```
Low priority render in progress:
A → B → C → D ...
         ↑
         High priority update arrives here
         Fiber throws away C, D work
         Restarts from A with new data
```

---

## 5. Two Phases of Fiber Work

```
Phase 1: RENDER phase (interruptible)
──────────────────────────────────────
- Build the new fiber tree
- Find what changed (diffing)
- Can be paused, resumed, aborted
- No side effects yet
- Runs in background / off-screen

Phase 2: COMMIT phase (not interruptible)
──────────────────────────────────────────
- Apply all changes to the real DOM
- Run useEffect, useLayoutEffect
- Must complete in one go
- Visible to the user
```

---

## 6. Full Picture — How It All Connects

```
Your Component
     │  setState() / props change
     ▼
React creates new Virtual DOM tree
     │
     ▼
Reconciliation (Fiber algorithm)
  ├── Diff old vDOM vs new vDOM
  ├── Build list of changes (work units)
  ├── Schedule by priority
  └── Pause/Resume/Abort as needed
     │
     ▼
Commit Phase
  └── Apply minimal changes → Real DOM
     │
     ▼
Browser paints updated UI
```

---

## 7. Quick Summary

| Concept | One-line definition |
|---|---|
| Virtual DOM | JS object copy of the real DOM kept in memory |
| Reconciliation | Comparing old vDOM vs new vDOM to find changes |
| Fiber | React's algorithm that makes reconciliation pausable, prioritized, and abortable |

---

## 8. Key Takeaway

> React never touches the real DOM directly for every change.
> It builds a vDOM, diffs it (reconciliation via Fiber), and only then writes the minimum necessary changes to the real DOM.
> Fiber makes this async and interruptible so the UI never freezes.
