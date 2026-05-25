# Redux Toolkit Crash Course

## Why Redux Toolkit?

Plain Redux required too much boilerplate (action types, action creators, switch-case reducers). Redux Toolkit (RTK) is the official, opinionated, batteries-included way to write Redux — less code, same power.

---

## Installation

```bash
npm install @reduxjs/toolkit react-redux
```

---

## Core Concepts

| Concept | What it is |
|---|---|
| **Store** | Single source of truth — holds all app state |
| **Slice** | A piece of state + its reducers + action creators, bundled together |
| **Action** | Plain object describing what happened `{ type, payload }` |
| **Reducer** | Pure function: `(state, action) => newState` |
| **Selector** | Function that reads a piece of state from the store |

---

## Folder Structure (convention)

```
src/
  app/
    store.js          ← configure the store
  features/
    counter/
      counterSlice.js ← slice for one feature
```

---

## 1. Create a Slice

```js
// src/features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: 0 }

const counterSlice = createSlice({
  name: 'counter',          // prefix for generated action types
  initialState,
  reducers: {
    increment: (state) => { state.value += 1 },   // Immer lets you mutate directly
    decrement: (state) => { state.value -= 1 },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

// RTK auto-generates action creators from reducer names
export const { increment, decrement, incrementByAmount } = counterSlice.actions

// Selector — reads state.counter.value from the store
export const selectCount = (state) => state.counter.value

export default counterSlice.reducer
```

**Key point:** RTK uses [Immer](https://immerjs.github.io/immer/) under the hood, so you can write "mutating" code inside reducers — it produces a new immutable state safely.

---

## 2. Configure the Store

```js
// src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,   // key = slice name used in selectors
  },
})
```

---

## 3. Provide the Store to React

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

The `Provider` makes the store available to every component in the tree.

---

## 4. Use Redux in a Component

```jsx
// src/features/counter/Counter.jsx
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount, selectCount } from './counterSlice'

export default function Counter() {
  const count = useSelector(selectCount)   // reads from store, re-renders on change
  const dispatch = useDispatch()           // lets you fire actions

  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  )
}
```

- `useSelector(selector)` — subscribes to a slice of state
- `useDispatch()` — returns the dispatch function
- Dispatching an action creator call `increment()` produces `{ type: 'counter/increment' }`

---

## 5. Async Logic — createAsyncThunk

For API calls or any async work, use `createAsyncThunk`.

```js
// src/features/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// 1. Define the thunk
export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  return res.json()   // returned value becomes action.payload
})

const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  // 2. Handle the three lifecycle actions RTK generates
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (state) => { state.status = 'loading' })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected,  (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export default usersSlice.reducer
```

```jsx
// In a component
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchUsers } from './usersSlice'

export default function UsersList() {
  const dispatch = useDispatch()
  const { list, status, error } = useSelector((state) => state.users)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchUsers())
  }, [status, dispatch])

  if (status === 'loading') return <p>Loading...</p>
  if (status === 'failed')  return <p>Error: {error}</p>

  return <ul>{list.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}
```

`createAsyncThunk` automatically dispatches:
- `users/fetchAll/pending`
- `users/fetchAll/fulfilled`
- `users/fetchAll/rejected`

---

## Data Flow Summary

```
User interaction
      ↓
dispatch(action)         ← useDispatch
      ↓
Reducer (slice)          ← createSlice
      ↓
Store updates
      ↓
useSelector re-renders   ← component picks up new state
```

---

## Quick Reference

```js
// Create slice
createSlice({ name, initialState, reducers, extraReducers })

// Configure store
configureStore({ reducer: { sliceName: sliceReducer } })

// Async thunk
createAsyncThunk('slice/action', async (arg, thunkAPI) => { ... })

// Hooks
useSelector(state => state.sliceName.field)
useDispatch()
```

---

## Common Gotchas

1. **Selectors use the store key, not the slice name** — if you registered the reducer as `counter` in `configureStore`, access it as `state.counter`, regardless of what `name` you put in `createSlice`.
2. **Don't mutate state outside reducers** — Immer only protects inside reducer functions.
3. **`createAsyncThunk` payload must be serializable** — no class instances, no functions, no `undefined` (use `null`).
4. **`extraReducers` vs `reducers`** — `reducers` handles actions defined in *this* slice; `extraReducers` handles actions from *other* slices or thunks.
