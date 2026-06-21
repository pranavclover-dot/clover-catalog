import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const path = formData.get("path") as string | null;

    if (!file || !path) {
      return NextResponse.json({ error: "Missing file or path" }, { status: 400 });
    }

    const blob = await put(path, file, { access: "public", addRandomSuffix: false, allowOverwrite: true });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const msg = (err as Error).message ?? String(err);
    console.error("Upload error — path:", path, "— error:", msg);
    return NextResponse.json({ error: msg, path }, { status: 500 });
  }
}
