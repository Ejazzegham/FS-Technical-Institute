// Firebase Admin SDK setup — server-only.
//
// The client SDK (lib/firebase.ts) can only ever manage the currently
// signed-in user's own Auth account. Deleting *another* user's account (e.g.
// when the admin removes a student/admission record) requires a privileged
// service-account credential, which is what this file sets up. Only import
// this from API routes / server code — never from a "use client" component.
//
// One-time setup:
// 1. Firebase Console -> Project settings (gear icon) -> Service accounts
// 2. "Generate new private key" -> downloads a JSON file
// 3. Copy project_id / client_email / private_key from that file into
//    .env.local as FIREBASE_ADMIN_PROJECT_ID / FIREBASE_ADMIN_CLIENT_EMAIL /
//    FIREBASE_ADMIN_PRIVATE_KEY (see .env.example)

import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let _app: App | null = null;

function adminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0]!;
    return _app;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // The private key from the downloaded JSON contains real newlines, but
  // pasting it into a single-line env var usually turns them into literal
  // "\n" characters — convert those back before using it.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin SDK is not configured. Set FIREBASE_ADMIN_PROJECT_ID, " +
        "FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY in .env.local " +
        "— see .env.example and ADMIN-SETUP.md."
    );
  }

  _app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return _app;
}

export function adminAuth() {
  return getAuth(adminApp());
}

export function adminDb() {
  return getFirestore(adminApp());
}
