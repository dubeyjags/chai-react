# useEffect, useRef, and useCallback

---

## 1. useEffect

### Description

`useEffect` lets you run **side effects** after a component renders. Side effects are anything outside React's render cycle: data fetching, subscriptions, DOM manipulation, timers, etc.

It replaces lifecycle methods `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount` from class components.

**Signature:**
```js
useEffect(setup, dependencies?)
```

- `setup` — function that runs the effect; can return a **cleanup** function
- `dependencies` — array of values React watches; effect re-runs when any of them change

### Dependency Array Rules

| dependencies         | When effect runs                          |
|----------------------|-------------------------------------------|
| omitted              | After every render                        |
| `[]`                 | Once after the first render (mount)       |
| `[a, b]`             | After mount, and whenever `a` or `b` change |

### Diagram

```
Component Renders
      |
      v
  DOM Updated
      |
      v
  useEffect runs
      |
      +---> cleanup() from previous effect (if any)
      |
      +---> setup() runs
                |
                v
           (async work, subscriptions, timers...)
                |
                v
         Component unmounts / deps change
                |
                v
          cleanup() runs  <--- returned from setup
```

### Examples

**Fetch data on mount:**
```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setUser(data);
      });

    return () => {
      cancelled = true; // cleanup: ignore stale response
    };
  }, [userId]); // re-runs whenever userId changes

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
```

**Subscribe / unsubscribe:**
```jsx
useEffect(() => {
  const handler = () => console.log('resized');
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []); // mount once, clean up on unmount
```

---

## 2. useRef

### Description

`useRef` gives you a **mutable container** that persists across renders without causing re-renders when changed.

Two primary uses:
1. **Accessing DOM elements** directly (like `document.getElementById`)
2. **Storing mutable values** that should not trigger re-renders (previous state, timers, etc.)

**Signature:**
```js
const ref = useRef(initialValue)
```

- `ref.current` — the stored value; read and write it freely
- Changing `ref.current` does **not** re-render the component

### Diagram

```
const ref = useRef(0)
                |
                v
         { current: 0 }   <--- same object every render
                |
   ref.current = 5  (mutation, no re-render triggered)
                |
                v
         { current: 5 }
```

```
DOM Ref:
  <input ref={inputRef} />
         |
         v
   inputRef.current --> <input> DOM node
         |
         v
   inputRef.current.focus()  // direct DOM access
```

### Examples

**Focus an input on mount:**
```jsx
import { useRef, useEffect } from 'react';

function SearchBox() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
```

**Store a timer ID (no re-render needed):**
```jsx
import { useRef } from 'react';

function Stopwatch() {
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setInterval(() => {
      console.log('tick');
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

**Track previous value:**
```jsx
import { useRef, useEffect } from 'react';

function Counter({ count }) {
  const prevCount = useRef(count);

  useEffect(() => {
    prevCount.current = count;
  });

  return (
    <p>Now: {count}, Before: {prevCount.current}</p>
  );
}
```

---

## 3. useCallback

### Description

`useCallback` **memoizes a function** — it returns the same function reference between renders unless its dependencies change.

Without `useCallback`, a new function is created on every render. This matters when passing callbacks to:
- Child components wrapped in `React.memo` (prevents unnecessary re-renders)
- `useEffect` dependency arrays (prevents infinite effect loops)

**Signature:**
```js
const memoizedFn = useCallback(fn, dependencies)
```

- Returns the same `fn` reference as long as `dependencies` haven't changed
- Only creates a new function when a dependency changes

### Diagram

```
Render 1:  useCallback(() => doThing(a), [a])
                |
                v
           fn_v1  (created, cached)

Render 2:  a unchanged
                |
                v
           fn_v1  (same reference returned, no new fn)

Render 3:  a changed
                |
                v
           fn_v2  (new function created)
```

```
Without useCallback:               With useCallback:
  Parent renders                     Parent renders
       |                                  |
  new fn created  -->  Child        same fn ref  --> Child
  Child sees new prop                Child sees same prop
  Child re-renders                   Child skips re-render
```

### Examples

**Prevent child re-renders with React.memo:**
```jsx
import { useState, useCallback, memo } from 'react';

const Button = memo(({ onClick, label }) => {
  console.log('Button rendered:', label);
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // Without useCallback, Button re-renders every time text changes
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []); // no deps — function never changes

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <Button onClick={increment} label="Increment" />
      <p>Count: {count}</p>
    </>
  );
}
```

**Stable callback in useEffect:**
```jsx
import { useState, useCallback, useEffect } from 'react';

function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  const fetchResults = useCallback(async () => {
    const res = await fetch(`/api/search?q=${query}`);
    setResults(await res.json());
  }, [query]); // new function only when query changes

  useEffect(() => {
    fetchResults();
  }, [fetchResults]); // safe — fetchResults is stable

  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}
```

---

## Comparison Summary

| Hook            | Purpose                              | Causes re-render? | Returns            |
|-----------------|--------------------------------------|-------------------|--------------------|
| `useEffect`     | Run side effects after render        | No                | cleanup function   |
| `useRef`        | Persist mutable value / DOM ref      | No                | `{ current: val }` |
| `useCallback`   | Memoize a function reference         | No                | memoized function  |

---

## When to Use Each

```
Need to fetch data, set up a subscription, or run code after render?
  --> useEffect

Need to read/write a DOM node directly, or store a value that should
    persist across renders without triggering re-renders?
  --> useRef

Need to pass a callback to a memoized child component or include a
    function in a useEffect dependency array?
  --> useCallback
```
