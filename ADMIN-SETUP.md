# Admin Panel Setup

The site now has an admin panel at **`/admin`** for managing everything: courses,
gallery, testimonials, stats, live classes, recorded lectures, certificates,
contact info, and all form submissions (contact messages, admissions,
newsletter subscribers, students).

It's built on the same Firebase project the rest of the site already uses —
no new services required. Follow these steps once, in order.

## 1. Enable Email/Password sign-in

Firebase Console → **Authentication** → **Sign-in method** → enable
**Email/Password** (skip if you already did this for the student portal).

## 2. Create your admin account

Firebase Console → **Authentication** → **Users** → **Add user** → enter the
email/password you want to log into `/admin` with.

Click into that new user and **copy their UID** (a long string like
`aB3xQ...`). You'll need it in the next step.

## 3. Publish Firestore security rules

Open `firestore.rules` in this project. Replace `REPLACE_WITH_ADMIN_UID` with
the UID you copied, then paste the whole file into:

Firebase Console → **Firestore Database** → **Rules** → paste → **Publish**.

These rules are what actually make the admin panel secure — they restrict
writes on all content collections (and reads on submissions/students) to
that one admin UID. Everything else (the public site) keeps working exactly
as before.

> Read the comment above the `students` match block in `firestore.rules` —
> it explains a pre-existing tradeoff around the enrollment-number login
> lookup and how to harden it further if you want to.

## 4. Set your environment variables

Make sure `.env.local` has your `NEXT_PUBLIC_FIREBASE_*` values filled in
(see `.env.example` — same ones the rest of the site already needs).

## 5. Run it

```bash
npm install
npm run dev
```

Go to **http://localhost:3000/admin/login** and sign in with the account
from step 2.

## 6. Seed your existing content

The site currently ships with placeholder content hardcoded in
`lib/data.ts` (courses, testimonials, stats, etc. — mostly marked
`[Add figure]` / `[Student Name]` for you to fill in). The admin panel reads
from **Firestore**, falling back to those defaults until you migrate.

Go to **`/admin/seed`** and click **Run Seed** once. This copies the
current defaults into Firestore so they show up as editable rows in the
admin panel — safe to run repeatedly, it skips anything that already has
data unless you tick "Overwrite existing content."

After seeding, edit everything from the sidebar: Courses, Gallery,
Testimonials, Stats, Live Classes, Recorded Lectures, Certificates, and
Contact Info. Changes show up on the live site immediately (no rebuild
needed — pages fetch from Firestore on every request).

## What's NOT in the admin panel

To keep this focused, a few things stayed as code in `lib/data.ts` rather
than becoming admin-editable, since they're structural copy that rarely
changes: navigation labels, the admissions process steps, the required
documents checklist, "why choose us" bullets, qualifications list, and
online-class feature blurbs. Edit those directly in `lib/data.ts` if needed
— happy to wire any of them into the admin panel too if you want.

## Managing submissions

- **Contact Messages** (`/admin/submissions/contact`) — everything
  submitted via the Contact page form.
- **Admissions** (`/admin/submissions/admissions`) — applications, with a
  status dropdown (New / Contacted / Enrolled / Rejected) you can update.
- **Newsletter** (`/admin/submissions/newsletter`) — subscriber emails.
- **Students** (`/admin/students`) — everyone who completed registration
  (has a portal login), including their uploaded photo/document links.

All four support delete. None of this data is editable in bulk beyond
status — if you need CSV export or anything fancier, let me know and I can
add it.

## Troubleshooting

- **"Couldn't load data" errors in the admin panel** → almost always means
  the Firestore rules weren't published yet, or the UID doesn't match.
  Double check step 2 and 3.
- **Changes not showing on the live site** → the site fetches fresh from
  Firestore on every page load (no caching layer), so this shouldn't
  happen. Hard-refresh, and check the browser console for errors.
- **Locked out of `/admin`** → create another user in Firebase Console and
  update the UID in `firestore.rules`, or reset the existing user's
  password from the Firebase Console.
