import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { PDFDocument } from "pdf-lib";
import { r2, BUCKET, PUBLIC_URL } from "@/lib/r2";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const newPagesFile = formData.get("newPages") as File | null;
    const existingKey = formData.get("existingKey") as string | null;
    if (!newPagesFile || !existingKey) {
      return NextResponse.json({ error: "newPages and existingKey required" }, { status: 400 });
    }

    // Load existing PDF from R2
    const existing = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: existingKey }));
    const existingBytes = await existing.Body?.transformToByteArray();
    if (!existingBytes) return NextResponse.json({ error: "Existing PDF not found" }, { status: 404 });

    const existingDoc = await PDFDocument.load(existingBytes);
    const pageCount = existingDoc.getPageCount();

    // Load new pages PDF from request
    const newPagesBytes = Buffer.from(await newPagesFile.arrayBuffer());
    const newDoc = await PDFDocument.load(newPagesBytes);

    // Merge: existing body (all but last contact page) + new pages + contact page
    const merged = await PDFDocument.create();

    const bodyIndices = Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => i);
    if (bodyIndices.length > 0) {
      const bodyPages = await merged.copyPages(existingDoc, bodyIndices);
      bodyPages.forEach((p) => merged.addPage(p));
    }

    const newIndices = Array.from({ length: newDoc.getPageCount() }, (_, i) => i);
    const newPages = await merged.copyPages(newDoc, newIndices);
    newPages.forEach((p) => merged.addPage(p));

    if (pageCount > 0) {
      const [contactPage] = await merged.copyPages(existingDoc, [pageCount - 1]);
      merged.addPage(contactPage);
    }

    const mergedBytes = await merged.save();

    await r2.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: existingKey,
      Body: Buffer.from(mergedBytes),
      ContentType: "application/pdf",
    }));

    return NextResponse.json({ publicUrl: `${PUBLIC_URL}/${existingKey}` });
  } catch (err) {
    const msg = (err as Error).message ?? String(err);
    console.error("Merge error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
