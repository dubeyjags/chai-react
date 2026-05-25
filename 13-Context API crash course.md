# Context API Crash Course

## 1. Context API

### Definition
Context API is React's built-in solution for **sharing state across the component tree** without prop drilling. It creates a "global" store that any nested component can read directly.

### When to Use
- Theme (dark/light mode)
- Auth user data
- Language/locale settings
- Anything needed by many components at different nesting levels

### Diagram

```
         App
          │
    ┌─────┴──────┐
  Sidebar      Main
                │
           ┌───┴───┐
         Header  Content
                    │
                  Button   ← needs user data
```

**Without Context** → App → Main → Content → Button (prop drilling every level)

**With Context:**
```
  UserContext.Provider (wraps App)
         │
    any component calls useContext(UserContext) → gets user directly
```

### Syntax

```jsx
// 1. Create context
import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

// 2. Provide it (wrap your tree)
function App() {
  const [user, setUser] = useState({ name: 'Alice' })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Main />
    </UserContext.Provider>
  )
}

// 3. Consume it anywhere in the tree
function Button() {
  const { user } = useContext(UserContext)
  return <button>Hello, {user.name}</button>
}
```

---

## 2. useContext Hook

### Definition
`useContext` is the hook that **subscribes a component to a context**. When the context value changes, the component re-renders automatically.

### Syntax

```jsx
const value = useContext(SomeContext)
```

### Full Pattern with Custom Hook

```jsx
// context/ThemeContext.jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// custom hook — cleaner API, no need to import context everywhere
export function useTheme() {
  return useContext(ThemeContext)
}

// Usage
function Navbar() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>Mode: {theme}</button>
}
```

### Limitations
- Every consumer re-renders when ANY part of the context value changes
- Not ideal for high-frequency updates (use Zustand/Redux for that)

---

## 3. Redux & Redux Toolkit

### Definition
Redux is a **predictable state container** for JavaScript apps. State lives in a single store; the only way to change it is to dispatch an **action**, which is handled by a **reducer**.

Redux Toolkit (RTK) is the official, opinionated way to write Redux — eliminates boilerplate.

### Core Concepts

| Concept | Role |
|---------|------|
| **Store** | Single source of truth — holds entire app state |
| **Slice** | A piece of state + its reducers, grouped together |
| **Action** | Plain object `{ type, payload }` describing what happened |
| **Reducer** | Pure function `(state, action) => newState` |
| **Dispatch** | Function to send an action to the store |
| **Selector** | Function to read state from the store |

### Diagram

```
  Component
     │
     │ dispatch(action)
     ▼
   Store  ──── Reducer ────► new State
     │
     │ useSelector(selector)
     ▼
  Component re-renders
```

### Syntax (Redux Toolkit)

```bash
npm install @reduxjs/toolkit react-redux
```

```jsx
// store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },       // Immer lets you "mutate"
    decrement: (state) => { state.value -= 1 },
    addBy: (state, action) => { state.value += action.payload },
  },
})

export const { increment, decrement, addBy } = counterSlice.actions
export default counterSlice.reducer
```

```jsx
// store/store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})
```

```jsx
// main.jsx — provide the store
import { Provider } from 'react-redux'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

```jsx
// Counter.jsx — use in component
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, addBy } from './store/counterSlice'

function Counter() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(addBy(5))}>+5</button>
    </div>
  )
}
```

### Async with createAsyncThunk

```jsx
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
})

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.loading = true })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})
```

---

## 4. Zustand

### Definition
Zustand (German: "state") is a **minimal, fast state management library** for React. No boilerplate, no Provider wrapping — just a hook-based store.

### When to Use Over Redux
- Small-to-medium apps
- When Redux feels over-engineered
- Need simple shared state with less ceremony

### Diagram

```
  useStore hook
       │
       ▼
  ┌──────────┐
  │  Store   │  ← plain object with state + actions
  │  {       │
  │   count  │
  │   inc()  │
  │  }       │
  └──────────┘
       │
  Any component calls useStore() → subscribes to relevant slice
```

### Syntax

```bash
npm install zustand
```

```jsx
// store/useCounterStore.js
import { create } from 'zustand'

const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

export default useCounterStore
```

```jsx
// Counter.jsx
import useCounterStore from './store/useCounterStore'

function Counter() {
  const { count, increment, decrement } = useCounterStore()

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}
```

### Selective Subscription (avoids unnecessary re-renders)

```jsx
// only re-renders when count changes, not on other state changes
const count = useCounterStore((state) => state.count)
const increment = useCounterStore((state) => state.increment)
```

### Zustand with Async

```jsx
const useUserStore = create((set) => ({
  user: null,
  loading: false,
  fetchUser: async (id) => {
    set({ loading: true })
    const res = await fetch(`/api/users/${id}`)
    const data = await res.json()
    set({ user: data, loading: false })
  },
}))
```

### Zustand with Persist (localStorage)

```jsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    { name: 'auth-storage' }   // localStorage key
  )
)
```

---

## Comparison Table

| Feature | Context API | Redux Toolkit | Zustand |
|---------|-------------|---------------|---------|
| Setup complexity | Low | Medium | Very Low |
| Boilerplate | Minimal | Some (slices) | None |
| DevTools | No | Yes (Redux DevTools) | Yes (middleware) |
| Async support | Manual | createAsyncThunk | Manual (simple) |
| Performance | Re-renders all consumers | Optimized | Optimized (selectors) |
| Best for | Simple/infrequent state | Large apps, teams | Small-medium apps |
| Provider needed | Yes | Yes | No |

---

## Rule of Thumb

```
Local state          → useState
Shared UI state      → Context API + useContext
Complex/async state  → Redux Toolkit
Simple shared state  → Zustand
```
