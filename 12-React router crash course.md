# React Router DOM — Crash Course

## Install

```bash
npm install react-router-dom
```

---

## 1. Setup — Wrap your app with BrowserRouter

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

> `BrowserRouter` uses the browser's History API (`/about`, `/users/1`).
> `HashRouter` uses hashes (`/#/about`) — useful for static file hosts.

---

## 2. Basic Routes

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFound />} />  {/* catch-all 404 */}
    </Routes>
  )
}
```

- `path="*"` is the wildcard — always put it last.
- React Router v6+ automatically picks the **most specific match**, so order mostly doesn't matter (except `*`).

---

## 3. Navigation — Link and NavLink

```jsx
import { Link, NavLink } from 'react-router-dom'

// Link — basic navigation, no page reload
<Link to="/about">About</Link>

// NavLink — adds `active` class automatically when the route matches
<NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
  About
</NavLink>
```

Never use `<a href>` for internal routes — it triggers a full page reload.

---

## 4. URL Params — `:paramName`

```jsx
// Route definition
<Route path="/users/:id" element={<UserDetail />} />

// Component — read the param with useParams()
import { useParams } from 'react-router-dom'

function UserDetail() {
  const { id } = useParams()
  return <h1>User ID: {id}</h1>
}
```

Multiple params:
```jsx
<Route path="/users/:userId/posts/:postId" element={<Post />} />

function Post() {
  const { userId, postId } = useParams()
}
```

---

## 5. Nested Routes

```jsx
// App.jsx
<Routes>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route index element={<DashboardHome />} />      {/* /dashboard */}
    <Route path="settings" element={<Settings />} /> {/* /dashboard/settings */}
    <Route path="profile" element={<Profile />} />   {/* /dashboard/profile */}
  </Route>
</Routes>

// Dashboard.jsx — render children with <Outlet />
import { Outlet, Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div>
      <nav>
        <Link to="settings">Settings</Link>
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />  {/* child route renders here */}
    </div>
  )
}
```

- `index` route renders at the parent path itself (no extra segment).
- `<Outlet />` is the slot where nested child routes are injected.

---

## 6. Query Params (Search Params)

```jsx
// URL: /products?category=shoes&sort=price
import { useSearchParams } from 'react-router-dom'

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category')  // "shoes"
  const sort = searchParams.get('sort')           // "price"

  const changeSort = () => {
    setSearchParams({ category, sort: 'name' })  // updates the URL
  }

  return <button onClick={changeSort}>Sort by name</button>
}
```

---

## 7. Programmatic Navigation — useNavigate

```jsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // ... login logic
    navigate('/dashboard')          // go forward
    navigate(-1)                    // go back (like browser back)
    navigate('/home', { replace: true })  // replace history entry (no back)
    navigate('/checkout', { state: { from: 'cart' } })  // pass state
  }
}
```

---

## 8. Passing State via Navigation

```jsx
// Sender
navigate('/order-confirm', { state: { orderId: 42 } })

// Receiver
import { useLocation } from 'react-router-dom'

function OrderConfirm() {
  const location = useLocation()
  const { orderId } = location.state  // { orderId: 42 }
}
```

`useLocation` gives you `{ pathname, search, hash, state, key }`.

---

## 9. Redirect / Protected Routes

```jsx
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Usage in routes
<Route
  path="/dashboard"
  element={
    <ProtectedRoute isLoggedIn={user !== null}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## 10. Layout Routes (Shared Layout)

```jsx
// Wrap multiple routes under a shared layout without adding a URL segment
<Routes>
  <Route element={<MainLayout />}>   {/* no path — just a wrapper */}
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Route>

  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>
</Routes>

// MainLayout.jsx
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />   {/* page content */}
      <Footer />
    </>
  )
}
```

---

## 11. createBrowserRouter (v6.4+ Data Router)

The newer API enables loaders, actions, and error boundaries per-route:

```jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'users/:id',
        element: <UserDetail />,
        loader: async ({ params }) => {
          const res = await fetch(`/api/users/${params.id}`)
          return res.json()           // returned value is available via useLoaderData()
        },
      },
    ],
  },
])

// main.jsx
<RouterProvider router={router} />

// UserDetail.jsx
import { useLoaderData } from 'react-router-dom'

function UserDetail() {
  const user = useLoaderData()   // data returned by loader
  return <h1>{user.name}</h1>
}
```

---

## Quick Reference — Hooks

| Hook | What it gives you |
|---|---|
| `useParams()` | URL params from `:paramName` |
| `useSearchParams()` | Query string `?key=val` |
| `useNavigate()` | Function to navigate programmatically |
| `useLocation()` | Current `pathname`, `search`, `hash`, `state` |
| `useLoaderData()` | Data returned by a route's `loader` (v6.4+) |
| `useMatch(path)` | Match info if current URL matches `path` |

---

## Full Mini App Example

```jsx
// main.jsx
import { BrowserRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><App /></BrowserRouter>
)

// App.jsx
import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

// Layout.jsx
import { Outlet, NavLink } from 'react-router-dom'
function Layout() {
  return (
    <>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/users">Users</NavLink>
      </nav>
      <Outlet />
    </>
  )
}

// Users.jsx
import { Link } from 'react-router-dom'
function Users() {
  const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
  return users.map(u => <Link key={u.id} to={`/users/${u.id}`}>{u.name}</Link>)
}

// UserDetail.jsx
import { useParams } from 'react-router-dom'
function UserDetail() {
  const { id } = useParams()
  return <h2>User {id}</h2>
}
```
