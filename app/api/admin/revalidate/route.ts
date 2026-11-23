import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest } from "@/lib/verifyAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Called by the admin panel right after every successful save/delete so the
// public pages (which are pre-built for speed) are rebuilt with fresh data.
export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
