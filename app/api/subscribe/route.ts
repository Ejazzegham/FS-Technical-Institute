import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    await addDoc(collection(db, "newsletter_subscribers"), {
      email,
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("subscribe error", err);
    return NextResponse.json({ error: "Could not save subscription." }, { status: 500 });
  }
}
