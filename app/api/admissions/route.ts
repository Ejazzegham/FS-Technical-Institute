import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToR2 } from "@/lib/r2";
import { getNextEnrollmentNumber } from "@/lib/enrollment";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const uid = formData.get("uid") as string | null;
    const fullName = formData.get("fullName") as string | null;
    const fatherName = formData.get("fatherName") as string | null;
    const email = formData.get("email") as string | null;
    const mobile = formData.get("mobile") as string | null;
    const cnic = formData.get("cnic") as string | null;
    const course = formData.get("course") as string | null;
    const batch = formData.get("batch") as string | null;
    const qualification = formData.get("qualification") as string | null;
    const religion = formData.get("religion") as string | null;
    const bloodGroup = formData.get("bloodGroup") as string | null;
    const address = formData.get("address") as string | null;
    const photo = formData.get("photo") as File | null;
    const document = formData.get("document") as File | null;

    if (!fullName || !email || !mobile || !course) {
      return NextResponse.json(
        { error: "Full name, email, mobile number and course are required." },
        { status: 400 }
      );
    }

    // Auto-assign the next serial number here (atomically, inside a Firestore
    // transaction) instead of trusting a client-supplied value — this is
    // what makes the enrollment number/username genuinely automatic rather
    // than something the student has to type in themselves.
    const enrollmentNumber = await getNextEnrollmentNumber();

    const folderId = uid || enrollmentNumber;

    let photoUrl: string | null = null;
    let documentUrl: string | null = null;

    if (photo && photo.size > 0) {
      const bytes = Buffer.from(await photo.arrayBuffer());
      photoUrl = await uploadToR2(
        `admissions/${folderId}/photo-${photo.name}`,
        bytes,
        photo.type || "image/jpeg"
      );
    }

    if (document && document.size > 0) {
      const bytes = Buffer.from(await document.arrayBuffer());
      documentUrl = await uploadToR2(
        `admissions/${folderId}/document-${document.name}`,
        bytes,
        document.type || "application/octet-stream"
      );
    }

    await addDoc(collection(db, "admissions"), {
      uid: uid || null,
      enrollmentNumber,
      fullName,
      fatherName: fatherName || null,
      email,
      mobile,
      cnic: cnic || null,
      course,
      batch: batch || null,
      qualification: qualification || null,
      religion: religion || null,
      bloodGroup: bloodGroup || null,
      address: address || null,
      photoUrl,
      documentUrl,
      status: "New",
      createdAt: serverTimestamp(),
    });

    return NextResponse.json({ success: true, enrollmentNumber, photoUrl, documentUrl });
  } catch (err) {
    console.error("admissions error", err);
    return NextResponse.json({ error: "Could not submit application." }, { status: 500 });
  }
}
