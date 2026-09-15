import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET, PUBLIC_URL } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pathname = formData.get("pathname") as string | null;
    const contentType = (formData.get("contentType") as string | null) ?? "application/pdf";

    if (!file || !pathname) {
      return NextResponse.json({ error: "file and pathname are required" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Content type not allowed" }, { status: 400 });
    }

    const body = Buffer.from(await file.arrayBuffer());

    await r2.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: pathname,
        Body: body,
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
