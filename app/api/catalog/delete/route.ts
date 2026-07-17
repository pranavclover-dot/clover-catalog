import { NextRequest, NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET, PUBLIC_URL } from "@/lib/r2";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "clover2024";

function urlToKey(url: string): string {
  // Strip public URL prefix to get the R2 object key
  return url.replace(`${PUBLIC_URL}/`, "");
}

export async function DELETE(req: NextRequest) {
  const { url, key } = await req.json();

  if ((key ?? "").trim() !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  const objectKey = urlToKey(url);
  const thumbKey = objectKey.replace(/\.pdf$/i, ".thumb.jpg");

  await Promise.all([
    r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: objectKey })),
    r2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: thumbKey })).catch(() => {}),
  ]);

  return NextResponse.json({ success: true });
}
