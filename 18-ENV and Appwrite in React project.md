# ENV and Appwrite in React Project

## 1. Why ENV Variables?

Secrets (API keys, project IDs) must never be committed to Git. ENV variables keep them out of source code and let you swap values per environment (dev / staging / prod) without changing code.

```
.env  (never committed)
  VITE_APPWRITE_PROJECT_ID=abc123
        ↓ read at build time by Vite
conf.js (committed — safe, no real values)
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID)
        ↓ imported by
auth.js / config.js (service files)
```

---

## 2. Vite ENV Rules

Vite only exposes env vars to browser code when they start with `VITE_`. Everything else is stripped from the bundle.

| Var name | Visible in browser? | Use case |
|---|---|---|
| `VITE_APPWRITE_URL` | Yes | Client-side SDK config |
| `SECRET_KEY` | No (stripped) | Server-only secrets |
| `NODE_ENV` | Partial (`import.meta.env.MODE`) | Build mode |

### ENV file priority (Vite loads all, later overrides earlier)

```
.env                  ← always loaded
.env.local            ← always loaded, git-ignored
.env.development      ← only in dev mode
.env.production       ← only in prod mode
.env.development.local
.env.production.local
```

> **Rule:** put real secrets in `.env.local` so they are auto-ignored by Vite's default `.gitignore`.

---

## 3. .env File Setup

```bash
# .env  (project root)
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

**Never** put real values here if you push this file. Use `.env.local` for real secrets during development.

Add to `.gitignore`:
```
.env
.env.local
.env*.local
```

---

## 4. conf.js — The Single Source of Truth

One file reads all env vars and exports a typed object. All service files import from here — never call `import.meta.env` directly in services or components.

```js
// src/conf/conf.js
const conf = {
  appwriteUrl:          String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId:    String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId:   String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteBucketId:     String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default conf;
```

`String()` prevents `undefined` from silently passing through — you get the string `"undefined"` which is easy to catch while debugging.

---

## 5. Project Folder Structure (Blog App)

```
src/
├── conf/
│   └── conf.js            ← env vars (single source of truth)
│
├── appwrite/
│   ├── auth.js            ← AuthService (createAccount, login, logout, getCurrentUser)
│   └── config.js          ← Service (CRUD posts, upload/delete file, getFilePreview)
│
├── store/
│   ├── store.js           ← Redux store
│   └── authSlice.js       ← auth state (userData, status)
│
├── components/            ← UI components (Header, Footer, PostCard, etc.)
├── pages/                 ← route-level components (Home, Login, AddPost, etc.)
├── App.jsx                ← auth check on mount, route layout
└── main.jsx               ← ReactDOM + Provider + Router
```

---

## 6. Redux Auth Slice

Auth state lives in Redux so any component can read login status without prop drilling.

```js
// src/store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: false,     // logged in?
    userData: null,    // Appwrite user object
  },
  reducers: {
    login(state, action) {
      state.status   = true;
      state.userData = action.payload.userData;
    },
    logout(state) {
      state.status   = false;
      state.userData = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
```

```js
// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
```

---

## 7. App.jsx — Auth Check on Mount

On every page load, check Appwrite for an existing session and sync it into Redux.

```jsx
// src/App.jsx
import { useEffect, useState } from "react";
import { useDispatch }         from "react-redux";
import authService             from "./appwrite/auth";
import { login, logout }       from "./store/authSlice";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else          dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? null : <RouterOutlet />;
}

export default App;
```

**Why `loading` state?** Without it, protected routes briefly render before auth resolves, causing a flash or redirect loop.

---

## 8. main.jsx — Wiring Everything Together

```jsx
// src/main.jsx
import React        from "react";
import ReactDOM     from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store        from "./store/store.js";
import App          from "./App.jsx";
import Home         from "./pages/Home.jsx";
import Login        from "./pages/Login.jsx";
import AddPost      from "./pages/AddPost.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "",        element: <Home /> },
      { path: "login",   element: <Login /> },
      { path: "add-post",element: <AddPost /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
```

---

## 9. Data Flow Diagram

```
User visits app
     ↓
main.jsx  →  <Provider store>  →  <RouterProvider>
                                       ↓
                                   App.jsx
                                   useEffect → authService.getCurrentUser()
                                                    ↓ (Appwrite SDK)
                                              Appwrite Cloud
                                                    ↓
                                   dispatch(login/logout)
                                                    ↓
                                   Redux store.auth updated
                                                    ↓
                                   All components can useSelector(state => state.auth)
```

---

## 10. Protecting Routes

```jsx
// src/components/AuthLayout.jsx
import { useEffect, useState }      from "react";
import { useSelector }              from "react-redux";
import { useNavigate }              from "react-router-dom";

function AuthLayout({ children, authentication = true }) {
  const navigate    = useNavigate();
  const authStatus  = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authentication && !authStatus) navigate("/login");
    if (!authentication && authStatus)  navigate("/");
    setLoading(false);
  }, [authStatus, navigate, authentication]);

  return loading ? <div>Loading...</div> : <>{children}</>;
}

export default AuthLayout;
```

Usage in router:
```jsx
{ path: "add-post", element: <AuthLayout authentication><AddPost /></AuthLayout> }
{ path: "login",    element: <AuthLayout authentication={false}><Login /></AuthLayout> }
```

---

## 11. Key Concepts Summary

| Concept | Why it matters |
|---|---|
| `VITE_` prefix | Vite strips vars without it — they become `undefined` in the browser |
| `conf.js` | One file to update if env var names change |
| `String()` wrapper | Converts `undefined` to `"undefined"`, easier to debug than silent failure |
| Redux auth slice | Single source of truth for login state across all components |
| `loading` guard in App | Prevents protected route flash before Appwrite responds |
| `AuthLayout` component | Reusable redirect logic — keeps route definitions clean |

---

## 12. Common Mistakes

1. **Missing `VITE_` prefix** — var is `undefined` in the browser, but no error is thrown at build time.
2. **Calling `import.meta.env` in service files directly** — breaks the single-source pattern; hard to test or mock.
3. **No `loading` state in App** — users see a flash of unauthenticated UI before the session check completes.
4. **Committing `.env` with real values** — use `.env.local` for secrets; only commit `.env` with placeholder comments.
5. **Forgetting `Provider` wraps the router** — `useSelector` / `useDispatch` fail silently if components render outside `<Provider>`.
