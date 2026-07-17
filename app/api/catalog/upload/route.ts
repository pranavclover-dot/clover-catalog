import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2, BUCKET, PUBLIC_URL } from "@/lib/r2";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg"];

export async function POST(req: NextRequest) {
  try {
    const { pathname, contentType } = await req.json();

    if (!pathname || !contentType) {
      return NextResponse.json({ error: "pathname and contentType required" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json({ error: "Content type not allowed" }, { status: 400 });
    }

    const uploadUrl = await getSignedUrl(
      r2,
      new PutObjectCommand({ Bucket: BUCKET, Key: pathname, ContentType: contentType }),
      { expiresIn: 3600 }
    );

    return NextResponse.json({ uploadUrl, publicUrl: `${PUBLIC_URL}/${pathname}` });
  } catch (err) {
    const msg = (err as Error).message ?? String(err);
    console.error("Upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
