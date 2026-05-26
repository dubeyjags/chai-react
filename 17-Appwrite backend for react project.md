# Appwrite Backend for React Project

## What is Appwrite?

Appwrite is an open-source **Backend-as-a-Service (BaaS)** — it gives you Auth, Database, Storage, and more via a single SDK. You call it directly from React; no custom server needed.

```
React App  ──→  Appwrite SDK  ──→  Appwrite Cloud / Self-hosted
                                    ├── Authentication
                                    ├── Databases (documents)
                                    └── Storage (files/images)
```

---

## Setup

### 1. Create Appwrite Cloud Project

1. Go to `cloud.appwrite.io` → create account → new Project
2. Note your **Project ID** from Settings → General
3. Create:
   - **Database** → note Database ID → create **Collection** → note Collection ID
   - **Storage** → create Bucket → note Bucket ID
   - In Collection **Attributes**, add: `title`, `content`, `featuredImage`, `status`, `userId`
   - In Collection **Permissions**, allow `any` to read, logged-in users to write

### 2. Install SDK

```bash
npm install appwrite
```

### 3. ENV Variables

```bash
# .env  (project root — add to .gitignore)
VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

```js
// src/conf/conf.js — single place to read all env vars
const conf = {
  appwriteUrl:          String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId:    String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appwriteDatabaseId:   String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  appwriteBucketId:     String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
};

export default conf;
```

> Vite only exposes env vars with `VITE_` prefix to browser code.

---

## Service Layer Pattern

Instead of calling Appwrite SDK methods directly in components, wrap them in **service classes**. Components call the service; the service calls Appwrite.

```
Component
   ↓  (calls method)
authService / dbService     ← src/appwrite/auth.js, config.js
   ↓  (calls SDK)
Appwrite SDK
   ↓  (HTTP)
Appwrite Cloud
```

**Why?** If you switch from Appwrite to Firebase later, you only change the service files — not every component.

---

## Auth Service

```js
// src/appwrite/auth.js
import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf.js";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(), email, password, name
      );
      if (userAccount) return this.login({ email, password });
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
```

### Auth Methods Quick Reference

| Method | Appwrite SDK call | Returns |
|---|---|---|
| `createAccount` | `account.create()` | calls `login` on success |
| `login` | `account.createEmailPasswordSession()` | session object |
| `getCurrentUser` | `account.get()` | user object or `null` |
| `logout` | `account.deleteSessions()` | void |

---

## Database + Storage Service

```js
// src/appwrite/config.js
import { Client, Databases, Storage, Query, ID } from "appwrite";
import conf from "../conf/conf.js";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket    = new Storage(this.client);
  }

  // --- POSTS ---

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    return await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug,                    // slug used as document ID for readable URLs
      { title, content, featuredImage, status, userId }
    );
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug,
      { title, content, featuredImage, status }
    );
  }

  async deletePost(slug) {
    await this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug
    );
    return true;
  }

  async getPost(slug) {
    return await this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug
    );
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    return await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      queries
    );
  }

  // --- STORAGE ---

  async uploadFile(file) {
    return await this.bucket.createFile(
      conf.appwriteBucketId,
      ID.unique(),
      file
    );
  }

  async deleteFile(fileId) {
    await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
    return true;
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
```

### Database Methods Quick Reference

| Method | Operation | Note |
|---|---|---|
| `createPost` | `createDocument` | slug = document ID |
| `updatePost` | `updateDocument` | only changed fields |
| `deletePost` | `deleteDocument` | |
| `getPost` | `getDocument` | single by slug |
| `getPosts` | `listDocuments` | filters with `Query` |

### Storage Methods Quick Reference

| Method | Operation | Returns |
|---|---|---|
| `uploadFile` | `createFile` | file object with `$id` |
| `deleteFile` | `deleteFile` | — |
| `getFilePreview` | `getFilePreview` | URL string (synchronous) |

---

## Query Helper

```js
import { Query } from "appwrite";

// Equality filter
Query.equal("status", "active")

// Multiple filters (AND)
[Query.equal("status", "active"), Query.equal("userId", uid)]

// Order + limit
Query.orderDesc("$createdAt")
Query.limit(10)
```

---

## ID Helper

```js
import { ID } from "appwrite";

ID.unique()   // generates a unique string — use for new documents/files
```

---

## Using Services in Components

```jsx
// Example: check auth on app load (App.jsx or main.jsx)
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else          dispatch(logout());
      });
  }, []);

  // ...
}
```

```jsx
// Example: fetch all active posts
import { useEffect, useState } from "react";
import service from "./appwrite/config";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    service.getPosts().then((res) => {
      if (res) setPosts(res.documents);
    });
  }, []);

  return posts.map((post) => <PostCard key={post.$id} {...post} />);
}
```

---

## Key Concepts

| Concept | Where it applies |
|---|---|
| Service class pattern | Isolates SDK from components |
| `conf.js` | Single file reads all `VITE_` env vars |
| Slug as document ID | Human-readable URLs, no extra query needed |
| `Query.equal` | Filter documents server-side |
| `getFilePreview` is sync | Returns a URL directly, no `await` needed |
| `deleteSessions()` | Logs out from all devices; use `deleteSession("current")` for single device |

---

## Common Mistakes

1. **Hardcoding IDs** — always use `conf.js` + `.env`, never inline strings.
2. **Calling `getFilePreview` with `await`** — it returns a URL synchronously, not a Promise.
3. **Forgetting Collection permissions** — Appwrite denies access by default; set read/write rules in the dashboard.
4. **Not adding `VITE_` prefix** — Vite strips env vars without this prefix from the browser bundle.
5. **Using `account.deleteSession("current")` vs `deleteSessions()`** — former logs out current device only; latter logs out everywhere.
