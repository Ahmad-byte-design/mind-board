Act as a senior React frontend engineer.

I have a React + TypeScript frontend using Zustand and Laravel Sanctum for cookie-based authentication.

My backend already has this authenticated endpoint:

GET /api/v1/auth/me

The current Zustand auth store is:

```ts
import { create } from 'zustand'
import type { User } from '../types/auth.types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
}))
```

Problem:

After login, Laravel Sanctum stores the authentication session in the browser cookie correctly. The user appears authenticated.

However, when I refresh the page, the Zustand store is recreated:

user = null
isAuthenticated = false

This causes the application to think the user is logged out, even though the Sanctum cookie still exists.

I want you to FIX this architecture properly.

Requirements:

1. DO NOT store the Sanctum authentication cookie manually in localStorage/sessionStorage/Zustand.

2. DO NOT use localStorage as the authentication mechanism.

3. Keep Sanctum cookie-based authentication.

4. Configure Axios correctly with:
   `withCredentials: true`

5. On application startup, call:

   GET /api/v1/auth/me

   The browser should automatically send the Sanctum cookie.

6. If `/api/v1/auth/me` returns the authenticated user:

   * call `setUser(user)`
   * set `isAuthenticated = true`

7. If `/api/v1/auth/me` returns 401:

   * set `user = null`
   * set `isAuthenticated = false`

8. Add an `isLoading` or `isInitializing` state to Zustand so protected routes do NOT redirect to `/login` while `/api/v1/auth/me` is still being checked.

9. Create a clean auth initialization mechanism, preferably something like:
   `initializeAuth()`

10. Call `initializeAuth()` exactly once when the React application starts.

11. Make sure protected routes behave like this:

While checking:

* show loading/splash state
* DO NOT redirect

Authenticated:

* render protected page

Not authenticated:

* redirect to login

12. Make logout call the Laravel logout endpoint as well as clearing the Zustand state. Do not only clear the frontend state.

13. Avoid unnecessary API calls. `/api/v1/auth/me` should be called once during application initialization, not on every component render.

14. Handle API errors properly. A 401 means unauthenticated, while unexpected 500/network errors should not silently be treated as a normal logout without considering the error.

15. Inspect my existing project structure before making changes. Reuse my existing Axios instance, API services, auth hooks, route protection, and Zustand patterns instead of creating duplicate systems.

16. Do not rewrite unrelated parts of the project.

17. Keep the implementation TypeScript-safe and production-ready.

Expected architecture:

Browser
↓
Sanctum HttpOnly Cookie
↓
React application starts
↓
initializeAuth()
↓
GET /api/v1/auth/me
↓
Laravel validates Sanctum session
↓
User returned
↓
Zustand.setUser(user)
↓
isAuthenticated = true
↓
Protected routes render

Also verify that the Axios configuration and Laravel Sanctum cookie setup are compatible with this flow.

After implementing the fix, explain:

* which files you changed
* why the current implementation loses authentication after refresh
* how `/api/v1/auth/me` restores the user
* how the loading state prevents premature redirects
* how the solution behaves after refresh and after closing/reopening the browser

Do not implement a token-based authentication system. I specifically want Laravel Sanctum cookie/session authentication.
