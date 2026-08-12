import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Verification records live in their own `certificates` collection (doc ID =
// the serial number, uppercased) rather than the `students` collection.
// `students` holds private registration data (email, mobile, CNIC, address,
// uploaded documents) which should never be reachable from a public,
// unauthenticated lookup like this one. Keeping verification data in a
// separate collection means only what's meant to be public is exposed here.
export async function GET(req: NextRequest) {
  try {
    const raw = req.nextUrl.searchParams.get("serial")?.trim();

    if (!raw) {
      return NextResponse.json(
        { error: "Please enter a student serial number." },
        { status: 400 }
      );
    }

    const serial = raw.toUpperCase();
    const snap = await getDoc(doc(db, "certificates", serial));

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "No record found for this serial number. Please check and try again." },
        { status: 404 }
      );
    }

    const data = snap.data();

    return NextResponse.json({
      serialNumber: data.serialNumber ?? serial,
      studentName: data.studentName ?? null,
      fatherName: data.fatherName ?? null,
      course: data.course ?? null,
      duration: data.duration ?? null,
      batch: data.batch ?? null,
      status: data.status ?? "Enrolled",
      marksObtained: data.marksObtained ?? null,
      totalMarks: data.totalMarks ?? null,
      grade: data.grade ?? null,
      startDate: data.startDate ?? null,
      completionDate: data.completionDate ?? null,
      certificateNumber: data.certificateNumber ?? null,
      photoUrl: data.photoUrl ?? null,
    });
  } catch (err) {
    console.error("verify error", err);
    return NextResponse.json(
      { error: "Could not verify at this time. Please try again shortly." },
      { status: 500 }
    );
  }
}
