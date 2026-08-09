import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// True once NEXT_PUBLIC_FIREBASE_API_KEY (and friends) are actually filled
// in .env.local. When they're blank, every Firestore write throws — this
// lets us return a clear, actionable error instead of a generic 500 so
// it's obvious from the browser network tab (or a toast) exactly what to
// fix, instead of just "Could not submit request."
const firebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

export async function POST(req: NextRequest) {
  if (!firebaseConfigured) {
    console.error(
      "contact error: Firebase is not configured — NEXT_PUBLIC_FIREBASE_* env vars are empty in .env.local. " +
        "See README.md 'Firebase setup' for the steps. The contact form cannot deliver messages until this is set."
    );
    return NextResponse.json(
      {
        error:
          "This site isn't connected to a database yet, so messages can't be delivered. " +
          "(Site owner: add your Firebase project keys to .env.local — see README.md.)",
      },
      { status: 503 }
    );
  }

  try {
    const { name, email, phone, message, course, subject } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    await addDoc(collection(db, "contact_requests"), {
      name,
      email,
      phone: phone || null,
      course: course || null,
      subject: subject || null,
      message: message || null,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("contact error", err);
    return NextResponse.json({ error: "Could not submit request." }, { status: 500 });
  }
}

