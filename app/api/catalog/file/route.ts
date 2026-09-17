import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2, BUCKET, PUBLIC_URL } from "@/lib/r2";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "url param required" }, { status: 400 });
    }

    // Extract key from public URL
    const key = url.replace(`${PUBLIC_URL}/`, "");

    const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    const body = await res.Body?.transformToByteArray();
    if (!body) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return new NextResponse(body, {
      headers: {
        "Content-Type": res.ContentType ?? "application/pdf",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (err) {
    const msg = (err as Error).message ?? String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
