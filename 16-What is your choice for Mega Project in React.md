# What is your choice for Mega Project in React?
## with details with appwrite

## Mega Project: Full-Stack Blog App

A production-ready blog platform where users can sign up, write posts with a rich text editor, upload images, and manage their own content.

---

## Why this project?

- Covers Auth, Database, File Storage — all real-world requirements
- Uses Appwrite as a complete Backend-as-a-Service (BaaS)
- Combines multiple React concepts learned so far (state, routing, hooks, context)
- Portfolio-worthy — showcases full-stack thinking without a custom backend

---

## Tech Stack

| Layer | Tool | Why |
|---|---|---|
| Frontend | React + Vite | Fast dev server, modern tooling |
| Styling | TailwindCSS | Utility-first, no custom CSS files |
| Routing | React Router DOM | Multi-page feel in SPA |
| State | Redux Toolkit | Global auth state across all pages |
| Forms | React Hook Form | Performant, less re-renders |
| Rich Text | TinyMCE | WYSIWYG editor for blog posts |
| Backend | Appwrite | Auth + DB + Storage in one SDK |

---

## Appwrite — What is it?

```
Your React App
     |
     | SDK (npm i appwrite)
     |
  Appwrite (self-hosted OR cloud)
  ├── Authentication  → sign up, login, logout, sessions
  ├── Databases       → store documents (like MongoDB)
  └── Storage         → upload / serve images & files
```

- Open-source Firebase alternative
- You call Appwrite SDK from frontend — no custom backend needed
- Free tier available at `cloud.appwrite.io`

---

## Appwrite Services Used

### 1. Authentication
```js
import { Account, Client } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(conf.appwriteProjectId);

const account = new Account(client);

// Create account
account.create(ID.unique(), email, password, name);

// Login
account.createEmailPasswordSession(email, password);

// Get current user
account.get();

// Logout
account.deleteSession("current");
```

### 2. Database (Posts)
```js
import { Databases, Query } from "appwrite";

const databases = new Databases(client);

// Create a post document
databases.createDocument(
  conf.appwriteDatabaseId,
  conf.appwriteCollectionId,
  ID.unique(),
  { title, content, featuredImage, status, userId }
);

// Get all active posts
databases.listDocuments(dbId, colId, [Query.equal("status", "active")]);

// Update post
databases.updateDocument(dbId, colId, postId, { title, content });

// Delete post
databases.deleteDocument(dbId, colId, postId);
```

### 3. Storage (Images)
```js
import { Storage } from "appwrite";

const storage = new Storage(client);

// Upload image
storage.createFile(conf.appwriteBucketId, ID.unique(), file);

// Get image preview URL
storage.getFilePreview(conf.appwriteBucketId, fileId);

// Delete image
storage.deleteFile(conf.appwriteBucketId, fileId);
```

---

## Project Folder Structure

```
src/
├── appwrite/
│   ├── auth.js          ← Account service (signup/login/logout)
│   └── config.js        ← Database + Storage service
├── store/
│   ├── store.js         ← Redux store setup
│   └── authSlice.js     ← Auth state (userData, status)
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── PostCard.jsx
│   ├── PostForm.jsx     ← Create + Edit post (React Hook Form + TinyMCE)
│   ├── AuthLayout.jsx   ← Protected route wrapper
│   └── RTE.jsx          ← TinyMCE rich text editor component
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── AddPost.jsx
│   ├── EditPost.jsx
│   ├── Post.jsx         ← Single post view
│   └── AllPosts.jsx
├── conf/
│   └── conf.js          ← ENV variables (never hardcode secrets)
└── App.jsx              ← Routes defined here
```

---

## Auth Flow (Redux + Appwrite)

```
App mounts
   ↓
useEffect → account.get()
   ↓
User exists? → dispatch(login(userData)) → authSlice sets status: true
No user?    → dispatch(logout())         → authSlice sets status: false
   ↓
AuthLayout checks Redux status
   ↓
Protected page? → redirect to /login if not authenticated
```

---

## ENV Variables Pattern

```js
// conf/conf.js — reads from .env, never import .env directly
const conf = {
  appwriteUrl:          String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId:    String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId:   String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteBucketId:     String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default conf;
```

```
.env  (root of project — never commit to git)
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=xxxxxxxxxxxx
...
```

> Vite requires `VITE_` prefix for env vars to be exposed to the browser.

---

## Key Concepts Practiced

| Concept | Where used |
|---|---|
| Redux Toolkit | Auth state (login/logout across app) |
| React Hook Form | Login, Signup, PostForm |
| Custom hooks | `useAuth`, form controller wrappers |
| React Router | Protected routes via `AuthLayout` |
| useEffect | Fetch posts on mount, check auth on load |
| Controlled components | PostForm with RTE controller |
| BaaS integration | All Appwrite SDK calls |

---

## What You Build Step by Step

1. Setup Vite + TailwindCSS + React Router
2. Setup Appwrite project (create DB, collection, bucket, auth)
3. Build `authService` and `dbService` classes wrapping Appwrite SDK
4. Setup Redux store with `authSlice`
5. Build `AuthLayout` for protected routes
6. Build Login + Signup pages with React Hook Form
7. Build PostForm with TinyMCE + image upload
8. Build Home (all posts), AddPost, EditPost, single Post pages
9. Wire delete post (also delete image from storage)
10. Deploy to Vercel, set ENV vars in Vercel dashboard
