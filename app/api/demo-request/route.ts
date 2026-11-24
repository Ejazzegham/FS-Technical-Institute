import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const firebaseConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: NextRequest) {
  if (!firebaseConfigured) {
    return NextResponse.json(
      { error: "This site isn't connected to a database yet. (Site owner: add your Firebase keys to .env.local.)" },
      { status: 503 }
    );
  }
  try {
    const body = await req.json();
    // Honeypot: real users never fill this hidden field.
    if (clean(body.website, 100)) return NextResponse.json({ success: true });

    const name = clean(body.name, 100);
    const phone = clean(body.phone, 30);
    const course = clean(body.course, 120);
    if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (!course) return NextResponse.json({ error: "Please choose a course." }, { status: 400 });
    const email = clean(body.email, 120);
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await addDoc(collection(db, "demo_requests"), {
      name,
      phone,
      email: email || null,
      course,
      preferredTime: clean(body.preferredTime, 60) || null,
      mode: body.mode === "Online" ? "Online" : "On-campus",
      message: clean(body.message, 1000) || null,
      status: "New",
      createdAt: serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("demo-request error", err);
    return NextResponse.json({ error: "Could not submit your request." }, { status: 500 });
  }
}
