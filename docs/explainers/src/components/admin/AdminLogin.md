# Explainer: `src/components/admin/AdminLogin.tsx`

### 1. What this file is
This file is the React login form component where administrators enter their email and password to gain access to the CMS control center.

### 2. Why it changed
It was updated to immediately clear saved login credentials from form state upon rendering and after successful authentication, while turning off browser autocomplete.

### 3. How it works
`useEffect` clears the `email` and `password` state variables whenever the login component mounts. Additionally, `autoComplete="off"` and `autoComplete="new-password"` prevent web browsers from pre-filling cached credentials after sign-out.

### 4. What difference it makes
When an admin clicks sign out, returning to the login screen presents clean, empty input fields without revealing previous username or password details.
