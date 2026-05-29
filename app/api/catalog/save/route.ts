import { NextRequest, NextResponse } from "next/server";
import { list, put } from "@vercel/blob";

const MANIFEST = "catalog-manifest.json";

export async function POST(req: NextRequest) {
  const { category, productCode, productType, fileUrl } = await req.json();

  // Read existing manifest
  let entries: object[] = [];
  try {
    const { blobs } = await list({ prefix: MANIFEST });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url + "?nocache=" + Date.now());
      entries = await res.json();
    }
  } catch {}

  // Prepend new entry
  entries.unshift({
    id: Date.now().toString(),
    category,
    product_code: productCode,
    product_type: productType || "",
    file_url: fileUrl,
    createdAt: new Date().toISOString(),
  });

  // Write manifest back (overwrite, no random suffix)
  await put(MANIFEST, JSON.stringify(entries), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return NextResponse.json({ success: true });
}
