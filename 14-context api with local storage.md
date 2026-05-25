# Context API with Local Storage

## 1. Why Combine Context API + localStorage?

### Problem
Context API gives you shared state across components, but it is **in-memory** — refreshing the page resets everything.

### Solution
Sync the context state with `localStorage` so it **persists across page reloads**.

### Common Use Cases
- Theme (dark/light mode) — survives refresh
- Auth token / user session
- Cart items in an e-commerce app
- User preferences (language, font size)

---

## 2. localStorage Basics

```js
// Write
localStorage.setItem('theme', 'dark')

// Read (returns null if key doesn't exist)
localStorage.getItem('theme')            // 'dark'

// Delete one key
localStorage.removeItem('theme')

// Clear everything
localStorage.clear()

// Storing objects — must JSON-serialize
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }))
const user = JSON.parse(localStorage.getItem('user'))
```

### Key Rules
- Values are always **strings** — serialize objects with `JSON.stringify` / `JSON.parse`
- `getItem` returns `null` (not `undefined`) when the key is missing
- Synchronous API — does not block but avoid storing large data

---

## 3. The Core Pattern

```
                ┌────────────────────────────────┐
                │         Context Provider        │
                │                                 │
                │  useState  ◄──── localStorage   │  ← initialize from storage
                │     │                           │
                │     └──── localStorage.setItem  │  ← sync on every change
                └────────────────────────────────┘
                         │ value
               ┌─────────┴──────────┐
          ComponentA           ComponentB
         useContext()           useContext()
```

Two steps:
1. **Initialize** state by reading from localStorage (inside `useState` initializer)
2. **Sync** localStorage whenever state changes (inside the setter or a `useEffect`)

---

## 4. Theme Toggle Project

### File Structure
```
src/
  context/
    ThemeContext.jsx    ← context + provider
  components/
    ThemeBtn.jsx        ← toggle button
    Card.jsx            ← styled card that responds to theme
  App.jsx
  index.css
```

### context/ThemeContext.jsx

```jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // 1. Initialize from localStorage (falls back to 'light')
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem('themeMode') || 'light'
  )

  function lightMode() {
    setThemeMode('light')
    localStorage.setItem('themeMode', 'light')   // 2. Sync on change
  }

  function darkMode() {
    setThemeMode('dark')
    localStorage.setItem('themeMode', 'dark')
  }

  return (
    <ThemeContext.Provider value={{ themeMode, lightMode, darkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
```

### App.jsx — Apply theme class to `<html>`

```jsx
import { useEffect } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import ThemeBtn from './components/ThemeBtn'
import Card from './components/Card'

function AppContent() {
  const { themeMode } = useTheme()

  useEffect(() => {
    // Tailwind dark mode uses the 'dark' class on <html>
    const html = document.querySelector('html')
    html.classList.remove('light', 'dark')
    html.classList.add(themeMode)
  }, [themeMode])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="flex justify-end p-4">
        <ThemeBtn />
      </div>
      <Card />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
```

### components/ThemeBtn.jsx

```jsx
import { useTheme } from '../context/ThemeContext'

export default function ThemeBtn() {
  const { themeMode, lightMode, darkMode } = useTheme()
  const isDark = themeMode === 'dark'

  const handleToggle = (e) => {
    e.target.checked ? darkMode() : lightMode()
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="text-sm dark:text-white">Light</span>
      <input
        type="checkbox"
        checked={isDark}
        onChange={handleToggle}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full
                      peer-checked:after:translate-x-full after:absolute after:top-0.5
                      after:left-0.5 after:bg-white after:rounded-full after:h-5
                      after:w-5 after:transition relative" />
      <span className="text-sm dark:text-white">Dark</span>
    </label>
  )
}
```

### components/Card.jsx

```jsx
export default function Card() {
  return (
    <div className="max-w-sm mx-auto mt-10 rounded-xl shadow-md overflow-hidden
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6">
      <h2 className="text-xl font-bold mb-2">Theme Card</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        This card changes with the theme. Refresh the page — preference is saved.
      </p>
    </div>
  )
}
```

### tailwind.config.js — Enable class-based dark mode

```js
export default {
  darkMode: 'class',    // ← required: use .dark class on <html>
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

---

## 5. Alternative: useEffect Sync Pattern

Instead of calling `localStorage.setItem` inside every setter, use a single `useEffect` to watch for state changes:

```jsx
export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem('themeMode') || 'light'
  )

  // Sync whenever themeMode changes
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode)
  }, [themeMode])

  const lightMode = () => setThemeMode('light')
  const darkMode  = () => setThemeMode('dark')

  return (
    <ThemeContext.Provider value={{ themeMode, lightMode, darkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### Setter-sync vs useEffect-sync

| | Setter sync | useEffect sync |
|---|---|---|
| localStorage updated | Immediately on call | After render cycle |
| Code location | Inside each setter | One central effect |
| Risk | Easy to forget in a new setter | Slight delay (usually fine) |
| Preferred when | Few setters | Many setters or complex state |

---

## 6. Lazy Initializer Pattern (important)

```jsx
// BAD — runs localStorage.getItem on EVERY render
const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

// GOOD — runs only once on mount (lazy initializer)
const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
```

Pass a **function** to `useState` when the initial value is expensive to compute. React calls it only on the first render.

---

## 7. Storing Objects in localStorage

```jsx
const [user, setUser] = useState(() => {
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
})

function login(userData) {
  setUser(userData)
  localStorage.setItem('user', JSON.stringify(userData))
}

function logout() {
  setUser(null)
  localStorage.removeItem('user')
}
```

### Gotchas
- `JSON.parse(null)` returns `null` — safe, but always guard against corrupt data
- `JSON.parse` throws if the string is invalid — wrap in try/catch for production:

```jsx
const [user, setUser] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
})
```

---

## 8. Custom Hook: useLocalStorage

Reusable hook that wraps any `useState` with automatic localStorage sync:

```jsx
import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorage
```

Usage inside a provider:

```jsx
const [themeMode, setThemeMode] = useLocalStorage('themeMode', 'light')
const lightMode = () => setThemeMode('light')
const darkMode  = () => setThemeMode('dark')
```

---

## 9. Summary

```
Problem: Context state resets on refresh
Solution: Read initial state from localStorage, write back on every change

Key steps:
  1. createContext() + Provider component
  2. useState(() => localStorage.getItem(key) || default)   ← lazy init
  3. localStorage.setItem(key, value) on state change
  4. useEffect on <html> to apply theme class (for Tailwind dark mode)
  5. useContext / custom hook in consumers

Tailwind dark mode:
  tailwind.config.js → darkMode: 'class'
  Toggle 'dark' class on document.querySelector('html')
```
