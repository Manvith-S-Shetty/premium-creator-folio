# Explainer: `src/hooks/admin/useAuth.ts`

### 1. What this file is
This file is a React Context provider (`AuthProvider`) and custom hook (`useAuth`) that manages user login sessions and authentication status across the application.

### 2. Why it changed
It was updated to enforce an automatic 1-hour session timeout for admin users, reset session start timestamps upon fresh login (`SIGNED_IN` events), and prevent stale timestamps from causing premature logouts.

### 3. How it works
When a fresh login succeeds, the hook records a new start timestamp in local storage (`admin_session_start_time`). It calculates elapsed time and schedules a timer for the remaining duration up to 1 hour (3600 seconds). If the session exceeds 1 hour or is signed out, storage is cleared and `signOut()` is executed.

### 4. What difference it makes
The admin will seamlessly sign in without getting stuck in a infinite signing-in loop, while still automatically logging out 1 hour after sign-in.

