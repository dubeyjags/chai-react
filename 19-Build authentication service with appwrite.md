# Build Authentication Service with Appwrite

## 1. Why a Service Class?

Wrap all Appwrite SDK calls inside a plain JS class instead of calling the SDK directly from components or Redux actions.

```
Components / Redux actions
        ↓  call methods on
   AuthService (auth.js)
        ↓  calls
   Appwrite SDK
        ↓  HTTP
   Appwrite Cloud
```

**Benefits:**
- If Appwrite is replaced by Firebase tomorrow, you only rewrite `auth.js` — zero changes in components.
- All error handling lives in one place.
- Methods are easy to mock in tests.

---

## 2. Appwrite SDK Setup Inside the Class

```js
// src/appwrite/auth.js
import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf.js";

class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)      // e.g. https://cloud.appwrite.io/v1
      .setProject(conf.appwriteProjectId); // your project ID from conf.js

    this.account = new Account(this.client);
  }
}
```

`Client` is the base HTTP client. `Account` is the service that handles users/sessions. Both are set up once in the constructor and reused by every method.

---

## 3. createAccount — Register a New User

```js
async createAccount({ email, password, name }) {
  try {
    const userAccount = await this.account.create(
      ID.unique(),   // auto-generated user ID
      email,
      password,
      name
    );

    if (userAccount) {
      // immediately log the new user in
      return this.login({ email, password });
    }
    return userAccount;
  } catch (error) {
    throw error;
  }
}
```

| Parameter | Source | Notes |
|---|---|---|
| `ID.unique()` | Appwrite helper | Generates a unique string ID — never reuse IDs |
| `email` | Form input | Must be a valid email |
| `password` | Form input | Min 8 characters (Appwrite default) |
| `name` | Form input | Display name, optional but set here |

After creation, the method immediately calls `login()` so the user doesn't have to sign in separately after registering.

---

## 4. login — Create a Session

```js
async login({ email, password }) {
  try {
    return await this.account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw error;
  }
}
```

`createEmailPasswordSession` sends credentials to Appwrite and returns a **Session** object. Appwrite sets a cookie automatically — subsequent SDK calls are authenticated.

---

## 5. getCurrentUser — Fetch the Active User

```js
async getCurrentUser() {
  try {
    return await this.account.get();
  } catch (error) {
    console.log("Appwrite service :: getCurrentUser :: error", error);
    return null;   // ← return null, don't throw; no session is a normal state
  }
}
```

`this.account.get()` returns the logged-in user object if a valid session cookie exists, otherwise throws. Returning `null` on error keeps the calling code simple:

```js
// in App.jsx
const user = await authService.getCurrentUser();
if (user) dispatch(login({ userData: user }));
else      dispatch(logout());
```

---

## 6. logout — Destroy the Session

```js
async logout() {
  try {
    await this.account.deleteSessions();
  } catch (error) {
    console.log("Appwrite service :: logout :: error", error);
  }
}
```

`deleteSessions()` removes **all** active sessions for the user (all devices). Use `deleteSession('current')` to log out only the current device.

| Method | Removes |
|---|---|
| `deleteSessions()` | All sessions (all devices) |
| `deleteSession('current')` | Only the current browser session |

---

## 7. Singleton Export

```js
const authService = new AuthService();
export default authService;
```

The class is instantiated once and the instance is exported. Every file that imports `authService` gets the **same** object — the client and account are not re-created on each import.

```
import authService from "./appwrite/auth"  // file A
import authService from "./appwrite/auth"  // file B
        ↑ same instance ↑
```

---

## 8. Complete auth.js File

```js
// src/appwrite/auth.js
import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf.js";

class AuthService {
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
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      }
      return userAccount;
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

---

## 9. Error Handling Strategy

| Method | On error | Why |
|---|---|---|
| `createAccount` | `throw error` | Caller (form) needs to show the error message to the user |
| `login` | `throw error` | Caller needs to know credentials were wrong |
| `getCurrentUser` | `return null` | No session is normal on first visit; throwing would crash App.jsx |
| `logout` | `console.log` only | If logout fails, the UI can still reset; crashing is worse |

---

## 10. How auth.js Fits Into the Bigger Picture

```
.env  →  conf.js  →  auth.js (AuthService)
                          ↓ imported by
                      App.jsx
                      useEffect → getCurrentUser()
                          ↓
                      dispatch(login/logout)  →  Redux store
                          ↓
                      All components read state.auth.status
```

See note 18 for `conf.js` setup and the Redux `authSlice` that receives `login` / `logout` dispatches.

---

## 11. Key Concepts Summary

| Concept | Why it matters |
|---|---|
| Class-based service | Swap backend (Appwrite → Firebase) by rewriting one file |
| `ID.unique()` | Always use this for user IDs — never hardcode or reuse |
| Auto-login after register | Better UX: user is immediately logged in after signing up |
| `getCurrentUser` returns `null` | Lets App.jsx handle "no session" without a try/catch |
| Singleton export | One shared client instance — no repeated SDK initialisation |
| `deleteSessions()` vs `deleteSession('current')` | All devices vs current device |

---

## 12. Common Mistakes

1. **Calling `new Client()` inside each method** — re-initialises the SDK on every call; use the constructor.
2. **Throwing in `getCurrentUser`** — crashes App.jsx on first load when there is no session; always return `null` instead.
3. **Forgetting `ID.unique()`** — passing your own string as the ID works, but collisions cause silent failures; let Appwrite generate it.
4. **Not calling `login()` after `createAccount()`** — user is registered but not logged in; they get a confusing redirect to the login page.
5. **Importing `conf` values directly from `import.meta.env` in auth.js** — breaks the single-source pattern; always go through `conf.js`.
