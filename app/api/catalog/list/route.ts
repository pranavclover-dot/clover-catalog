import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "catalogs/" });

    const entries = blobs
      .filter((b) => b.pathname.endsWith(".pdf"))
      .map((b) => {
        // pathname: "catalogs/{category}/{CODE}__{TYPE}__{ts}.pdf"
        const parts = b.pathname.split("/");
        const category = parts[1] ?? "";
        const filename = (parts[2] ?? "").replace(/\.pdf$/i, "");
        const segs = filename.split("__");
        const product_code = (segs[0] ?? "").replace(/_/g, " ");
        const product_type = (segs[1] ?? "").replace(/_/g, " ").replace(/^-$/, "");
        return {
          id: b.pathname,
          category,
          product_code,
          product_type,
          file_url: b.url,
          createdAt: b.uploadedAt instanceof Date
            ? b.uploadedAt.toISOString()
            : String(b.uploadedAt),
        };
      })
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}
