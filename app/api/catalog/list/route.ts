import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: "catalogs/" });

    // Build a map of thumbnail URLs keyed by their base filename
    const thumbMap = new Map<string, string>();
    blobs
      .filter((b) => b.pathname.endsWith(".thumb.jpg"))
      .forEach((b) => {
        const parts = b.pathname.split("/");
        const base = (parts[2] ?? "").replace(/\.thumb\.jpg$/, "");
        thumbMap.set(base, b.url);
      });

    const entries = blobs
      .filter((b) => b.pathname.endsWith(".pdf"))
      .map((b) => {
        // pathname: "catalogs/{category}/{CODE}.{TYPE}.{ts}.pdf"  (new dot format)
        //       or: "catalogs/{category}/{CODE}__{TYPE}__{ts}.pdf" (legacy __ format)
        const parts = b.pathname.split("/");
        const category = (parts[1] ?? "").replace(/-/g, " ");
        const filename = (parts[2] ?? "").replace(/\.pdf$/i, "");
        let product_code: string, product_type: string;
        if (filename.includes("__")) {
          // legacy format
          const segs = filename.split("__");
          product_code = (segs[0] ?? "").replace(/_/g, " ");
          product_type = (segs[1] ?? "").replace(/_/g, " ").replace(/^-$/, "");
        } else {
          // new dot-separated format: CODE.TYPE.TIMESTAMP
          const firstDot = filename.indexOf(".");
          const afterCode = firstDot >= 0 ? filename.slice(firstDot + 1) : "";
          product_code = firstDot >= 0 ? filename.slice(0, firstDot) : filename;
          const secondDot = afterCode.indexOf(".");
          const typeRaw = secondDot >= 0 ? afterCode.slice(0, secondDot) : afterCode;
          product_type = typeRaw.replace(/-/g, " ").replace(/^-$/, "").trim();
        }
        return {
          id: b.pathname,
          category,
          product_code,
          product_type,
          file_url: b.url,
          thumbnail_url: thumbMap.get(filename) ?? null,
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
