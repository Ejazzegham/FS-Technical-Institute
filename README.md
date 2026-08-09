# Furqan Saeed Technical Institute — Website

A full marketing site (Home, About Us, Courses, Admissions, Gallery, Contact) built
with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Firebase** (Firestore, for the
newsletter, contact, and admission forms) and **Cloudflare R2** (S3-compatible storage
for uploaded admission documents / course / gallery images).

## Pages

| Route          | Description                                    |
|----------------|-------------------------------------------------|
| `/`            | Home — hero, stats, popular courses, why-us, about snippet, CTA, testimonials, partners |
| `/about`       | About Us — mission, vision, values, stats, commitments |
| `/courses`     | Courses — filterable category explorer + course grid |
| `/admissions`  | Admissions — admission form (with file upload), process steps, required documents |
| `/gallery`     | Gallery — filterable photo grid by category |
| `/contact`     | Contact — contact form, embedded map, office info cards |
| `/online-class`| Online Class — live class list + join panel, recorded lecture library |
| `/verification`| Student Verification — look up a student by serial number to see diploma, duration, marks, and status |
| `/login`       | Student Portal sign in (standalone, no header/footer chrome) |
| `/register`    | Student registration — creates a Firebase Auth account + student profile |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Firebase + Cloudflare R2 keys
npm run dev
```

Open http://localhost:3000

## Firebase setup

1. Create a project at https://console.firebase.google.com
2. Add a **Web app** (</> icon) — copy the config values into `.env.local`
   (`NEXT_PUBLIC_FIREBASE_*` variables).
3. Enable **Firestore Database** (production or test mode).
4. That's it — three forms write to Firestore via API routes:
   - Newsletter signup (footer) → `newsletter_subscribers` (`app/api/subscribe/route.ts`)
   - Contact form (`/contact`) → `contact_requests` (`app/api/contact/route.ts`)
   - Admission form (`/admissions`) → `admissions`, including an auto-generated
     enrollment number and the uploaded document's R2 URL (`app/api/admissions/route.ts`)

5. Enable **Authentication → Sign-in method → Email/Password**. The `/register`
   page creates a Firebase Auth account (email + password) and a matching
   `students/{uid}` Firestore profile; `/login` signs the student back in,
   accepting either their email or their FSTI enrollment number (it looks up
   the email by enrollment number via a Firestore query first).

**Security note:** the enrollment-number lookup on `/login` currently reads
the `students` collection directly from the browser, so if you keep Firestore
rules open for that collection anyone can query it. Before going live, either
restrict reads on `students` to authenticated users only (and drop the
enrollment-number login option in favor of email), or move the lookup into a
server-side API route using the Firebase Admin SDK. Also lock down write
access more generally with proper Firestore security rules.

## Student verification (`/verification`)

`/verification` lets anyone look up a student by **serial number** and see
their diploma/course, duration, batch, marks, grade, and status (Enrolled /
In Progress / Completed / Discontinued). It reads from a dedicated
**`certificates`** Firestore collection via `app/api/verify/route.ts` —
deliberately **not** the `students` collection, since that holds private
data (email, mobile, CNIC, address, uploaded documents) that should never be
exposed on a public, unauthenticated lookup.

**This ships with no data in it yet** — there's no student data anywhere in
the app that includes completion status, marks, or grades, so there's
nothing to migrate automatically. To make a record verifiable, add a
document to `certificates` where the **document ID is the serial number,
uppercased** (e.g. `FSTI-2026-000123`) with fields like:

```
studentName:       "Student Name"
fatherName:         "Father's Name"        (optional)
course:             "Web Designing & Developing"
duration:            "3–6 Months"
batch:               "Morning Batch"        (optional)
status:              "Completed"            // "Enrolled" | "In Progress" | "Completed" | "Discontinued"
marksObtained:        870                    (number, optional)
totalMarks:            1000                  (number, optional)
grade:                "A"                    (optional)
startDate:            "Jan 2026"             (optional)
completionDate:       "Jul 2026"             (optional)
certificateNumber:    "FSTI-CERT-000123"     (optional)
```

You can add these by hand in the Firebase console for now, or wire up a
small internal form later that writes to this collection when a student
completes a course — happy to build that next.

## Cloudflare R2 setup (storage)

1. In the Cloudflare dashboard, go to **R2 Object Storage** → create a bucket
   (e.g. `fsti-assets`).
2. Create an **R2 API token** with read/write access — copy the Account ID,
   Access Key ID and Secret Access Key into `.env.local`.
3. (Optional) Enable the bucket's public dev URL, or attach a custom domain,
   and set `CLOUDFLARE_R2_PUBLIC_URL` so uploaded files get a public link.
4. Use the helpers in `lib/r2.ts` (`uploadToR2`, `getFromR2`, `deleteFromR2`)
   from any API route or server action to upload course thumbnails, gallery
   photos, brochures, etc. This file is server-only — never import it in a
   client component.

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** (CSS-based theme tokens in `app/globals.css` — navy `#0f1e3d` / gold `#f0a93b` brand palette)
- **Firebase** (`firebase` SDK — Firestore)
- **Cloudflare R2** via `@aws-sdk/client-s3` (S3-compatible)
- **lucide-react** for icons

## Project structure

```
app/
  page.tsx                  Home
  about/page.tsx            About Us
  courses/page.tsx          Courses
  admissions/page.tsx       Admissions (form + process)
  gallery/page.tsx          Gallery
  online-class/page.tsx     Online Class (live classes + recorded lectures)
  contact/page.tsx          Contact
  verification/page.tsx     Student Verification (lookup by serial number)
  login/page.tsx            Student sign in (standalone, no site chrome)
  register/page.tsx         Student registration (standalone, no site chrome)
  api/subscribe/route.ts    Newsletter -> Firestore
  api/contact/route.ts      Contact form -> Firestore
  api/admissions/route.ts   Admission form -> R2 upload + Firestore
  api/register/route.ts     Registration -> R2 upload + Firestore student profile
  api/verify/route.ts       Verification lookup <- Firestore `certificates` collection
components/
  Header.tsx, Footer.tsx, SiteChrome.tsx   Shared layout (SiteChrome hides Header/Footer on /login & /register)
  StatsBar.tsx, CourseCard.tsx, CoursesExplorer.tsx, CTABanner.tsx, SocialIcons.tsx
  AdmissionForm.tsx, GalleryExplorer.tsx, ContactForm.tsx
  LoginForm.tsx, RegisterForm.tsx, JoinLiveClass.tsx, RecordedLecturesGrid.tsx
  VerificationForm.tsx
lib/
  data.ts       Nav links, courses, stats, testimonials, gallery/admissions/online-class content
  firebase.ts   Firebase client init (Firestore + lazy Auth via getFirebaseAuth())
  r2.ts         Cloudflare R2 client + upload/get/delete helpers
public/images/logo.png      Your FSTI logo
```

## Editing content

There are two ways to edit content:

1. **Admin panel** (`/admin`) — courses, gallery, testimonials, stats, live
   classes, recorded lectures, certificates, contact info, and all form
   submissions (contact messages, admissions, newsletter, students) are all
   editable from a browser, with Firebase Auth login. **See
   [ADMIN-SETUP.md](./ADMIN-SETUP.md) for one-time setup.**
2. **`lib/data.ts`** — structural copy that stays in code (nav links,
   admissions process steps, required documents, etc.), plus the default
   values the admin panel seeds from initially.

## Deploying

Any Next.js host works (Vercel, Cloudflare Pages via `@cloudflare/next-on-pages`,
your own Node server). Remember to set the same environment variables from
`.env.example` in your hosting provider's dashboard.
