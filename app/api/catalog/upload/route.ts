import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET, PUBLIC_URL } from "@/lib/r2";

export const runtime = "nodejs";

// Allow up to 10 MB bodies (covers large PDFs)
export const maxDuration = 60;

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    const pathname = req.headers.get("x-pathname");
    const contentType = req.headers.get("x-content-type") ?? req.headers.get("content-type") ?? "";

    if (!pathname) {
      return NextResponse.json({ error: "x-pathname header required" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Content type not allowed" }, { status: 400 });
    }

    const body = await req.arrayBuffer();

    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: pathname,
        Body: Buffer.from(body),
        ContentType: contentType,
      })
    );

    return NextResponse.json({ publicUrl: `${PUBLIC_URL}/${pathname}` });
  } catch (err) {
    const msg = (err as Error).message ?? String(err);
    console.error("Upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
