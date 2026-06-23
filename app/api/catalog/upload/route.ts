import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["application/pdf", "image/jpeg", "image/jpg"],
        addRandomSuffix: false,
        allowOverwrite: true,
      }),
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (err) {
    const msg = (err as Error).message ?? String(err);
    console.error("Upload error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
