import { NextResponse } from "next/server";
import { previewNextEnrollmentNumber } from "@/lib/enrollment";

// Always compute fresh — this powers the live "Application No." shown on
// the Admission and Student Portal registration forms.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const enrollmentNumber = await previewNextEnrollmentNumber();
    return NextResponse.json({ enrollmentNumber });
  } catch (err) {
    console.error("enrollment-number preview error", err);
    return NextResponse.json({ error: "Could not load the next serial number." }, { status: 500 });
  }
}
