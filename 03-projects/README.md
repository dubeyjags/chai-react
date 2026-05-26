# React Mini Projects

A collection of 5 React mini-apps built while learning core React concepts — useState, custom hooks, Context API, React Router loaders, and localStorage. All projects live under one roof at **[project.dubeyjags.cloud](https://project.dubeyjags.cloud)** and share a common dark/light theme system built with Tailwind CSS.

---

## Projects

### 1. Background Changer `/bg-changer`
**Concepts:** `useState`, event handling, inline styles

Click any color button to instantly change the full-page background. Eight curated color presets ranging from Deep Navy to Rich Purple. A minimal demo showing how state drives visual UI updates in real time.

| Feature | Detail |
|---|---|
| Color presets | 8 (Deep Navy → Rich Purple) |
| State management | `useState` for active color |
| Styling | Dynamic `style` prop + Tailwind layout |

---

### 2. Password Generator `/password-generator`
**Concepts:** `useState`, `useCallback`, `useEffect`, `useRef`, clipboard API

Generates a random password on every option change. Configure length (6–40 chars), toggle numbers and special symbols, then copy to clipboard with one click. Password auto-regenerates whenever any setting changes.

| Feature | Detail |
|---|---|
| Length range | 6 – 40 characters |
| Options | Numbers toggle, Symbols toggle |
| Copy | `useRef` + `navigator.clipboard` |
| Auto-update | `useEffect` watches all settings |

---

### 3. Currency Converter `/currency-convertor`
**Concepts:** Custom hook, `fetch`, controlled components, `useState`

Converts between world currencies using live exchange rates from a public API. A custom `useCurrencyInfo(base)` hook abstracts the data-fetch logic. Supports swap (flip from/to currencies) and converts on form submit.

| Feature | Detail |
|---|---|
| Data source | Open exchange-rates REST API |
| Custom hook | `useCurrencyInfo(base)` returns rate map |
| Swap | Flips currency + amount in one click |
| Currency list | All pairs returned by the API |

---

### 4. Todo Manager `/todos`
**Concepts:** Context API, `useContext`, `localStorage`, CRUD

Full-featured todo app with add, inline-edit, delete, and completion toggle. Uses a `TodoProvider` (Context API) to share state across `TodoForm` and `TodoItem` without prop-drilling. Todos are persisted to `localStorage` so they survive page refreshes.

| Feature | Detail |
|---|---|
| State sharing | `TodoProvider` + `useTodo` context hook |
| Persistence | `localStorage` read on mount, write on change |
| Operations | Add, edit (inline), delete, toggle complete |
| Completed style | Green highlight + strikethrough text |

---

### 5. GitHub Profile `/github`
**Concepts:** React Router `loader`, `useLoaderData`, `useContext`, GitHub REST API

Fetches and displays a GitHub user's profile card before the page renders, using React Router's `loader` function (`gitHubInfoLoader`). Shows avatar, bio, public repos, followers, following, company, location, blog, and join year. Profile data is also stored in a `UserContext` for cross-component access.

| Feature | Detail |
|---|---|
| Data loading | React Router `loader` (runs before render) |
| API | `https://api.github.com/users/{username}` |
| Stats shown | Repos, Followers, Following |
| Context | `UserContext` holds loaded profile data |

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS |
| State | useState, Context API, custom hooks |
| Persistence | localStorage |
| External API | GitHub REST API, open exchange-rates API |

---

## Portfolio

Live at **[project.dubeyjags.cloud](https://project.dubeyjags.cloud)**

---

## Portfolio Summary

> **React Mini Projects** — [project.dubeyjags.cloud](https://project.dubeyjags.cloud)
>
> A multi-page React application featuring five interactive mini-projects built to practice core React patterns. Includes a **Password Generator** (useCallback + useRef + clipboard API), **Currency Converter** (custom hook + live REST API), **Todo Manager** (Context API + localStorage persistence), **Background Changer** (useState + dynamic styles), and a **GitHub Profile Viewer** (React Router loader + GitHub REST API). Built with React 18, React Router DOM v6, and Tailwind CSS — with a shared dark/light theme system across all pages.
