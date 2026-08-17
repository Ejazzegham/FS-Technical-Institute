# Admin Panel Setup

The admin panel at `/admin` is locked to a single account: **fstechins@gmail.com**.
Anyone signed in with a different email — including students who registered
through the public site — is automatically signed out and redirected back to
the login page. This is enforced in two places, and both need to agree:

- `lib/adminAuth.ts` — the app-side check (what shows/hides the admin UI)
- `firestore.rules` — the real security boundary (what the database itself
  will actually allow that account to read/write)

## One-time setup

1. In the [Firebase Console](https://console.firebase.google.com), open your
   project → **Authentication** → **Users** → **Add user**.
2. Create the user with email `fstechins@gmail.com` and a strong password.
   (If this account already exists, skip this step.)
3. Open **Firestore Database** → **Rules**, paste in the contents of
   `firestore.rules` from this project, and click **Publish**.
4. Go to `/admin/login` on your site and sign in with that email/password.
5. For the Delete button on Students/Admissions to fully remove a record
   (including the person's Auth login, not just the database row): open
   **Project settings → Service accounts → Generate new private key**, then
   copy the three values from the downloaded JSON into `.env.local` as
   `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and
   `FIREBASE_ADMIN_PRIVATE_KEY` (see `.env.example`). Without this step,
   Delete still removes the record from the admin list, but the person's
   email/login stays taken.

That's it — no UID lookup required. If you ever need to change which email
is the admin account, update the email in **both** `lib/adminAuth.ts` and
`firestore.rules`, then re-publish the rules.

## Why two checks?

`AdminAuthGuard` (the app-side check) only controls what the *browser*
shows — it's a convenience layer. Someone could bypass it entirely (e.g. by
calling Firestore directly), so the Firestore rules are what actually stop
an unauthorized account from reading or writing admin data, regardless of
what the UI does.
