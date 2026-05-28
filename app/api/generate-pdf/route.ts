import { NextRequest, NextResponse } from "next/server";
import { generatePdf } from "@/lib/pdf";
import { CATEGORY_PHOTO } from "@/lib/categories";
import { readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/generate-pdf
 *
 * FormData fields:
 *   category       string
 *   productCode    string
 *   description    string
 *   photo_0…N      base64 data URI strings (already compressed by client)
 */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const category = (form.get("category") as string | null)?.trim() ?? "";
    const productCode = (form.get("productCode") as string | null)?.trim() ?? "";
    const description = (form.get("description") as string | null)?.trim() ?? "";

    if (!category || !productCode) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Collect all photo_N fields in order
    const photoDataUris: string[] = [];
    for (let i = 0; ; i++) {
      const val = form.get(`photo_${i}`) as string | null;
      if (val === null) break;
      photoDataUris.push(val);
    }

    if (photoDataUris.length === 0) {
      return new NextResponse("At least one photo required", { status: 400 });
    }

    // Use the category-specific product photo as the cover background.
    // Falls back to lifestyle.svg if no match.
    const lifestylePhotoUri = loadCategoryPhoto(category);

    const pdfBuffer = await generatePdf({
      category,
      productCode,
      description,
      photoDataUris,
      lifestylePhotoUri,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${productCode.replace(/[^a-zA-Z0-9]/g, "_")}_Clover.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[generate-pdf]", err);
    return new NextResponse(
      err instanceof Error ? err.message : "Internal server error",
      { status: 500 }
    );
  }
}

function loadCategoryPhoto(category: string): string {
  // Try the mapped category photo first
  const mapped = CATEGORY_PHOTO[category];
  if (mapped) {
    // mapped is e.g. "/Bedsheet.png" → public/Bedsheet.png
    const fileName = mapped.replace(/^\//, "");
    const filePath = path.join(process.cwd(), "public", fileName);
    try {
      const buf = readFileSync(filePath);
      const ext = path.extname(fileName).toLowerCase();
      const mime = ext === ".png" ? "image/png" : ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
      return `data:${mime};base64,${buf.toString("base64")}`;
    } catch { /* fall through */ }
  }

  // Fallback: lifestyle SVG
  const candidates: Array<[string, string]> = [
    [path.join(process.cwd(), "public", "lifestyle.jpg"), "image/jpeg"],
    [path.join(process.cwd(), "public", "lifestyle.png"), "image/png"],
    [path.join(process.cwd(), "public", "lifestyle.svg"), "image/svg+xml"],
  ];
  for (const [filePath, mime] of candidates) {
    try {
      const buf = readFileSync(filePath);
      return `data:${mime};base64,${buf.toString("base64")}`;
    } catch { /* try next */ }
  }
  return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
}
