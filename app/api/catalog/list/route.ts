import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { r2, BUCKET, PUBLIC_URL } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allObjects: { key: string; lastModified: Date }[] = [];

    // Paginate through all objects under catalogs/
    let continuationToken: string | undefined;
    do {
      const res = await r2.send(new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: "catalogs/",
        ContinuationToken: continuationToken,
      }));
      for (const obj of res.Contents ?? []) {
        if (obj.Key) allObjects.push({ key: obj.Key, lastModified: obj.LastModified ?? new Date(0) });
      }
      continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (continuationToken);

    // Build thumbnail map: base filename → public URL
    const thumbMap = new Map<string, string>();
    allObjects
      .filter((o) => o.key.endsWith(".thumb.jpg"))
      .forEach((o) => {
        const parts = o.key.split("/");
        const base = (parts[2] ?? "").replace(/\.thumb\.jpg$/, "");
        thumbMap.set(base, `${PUBLIC_URL}/${o.key}`);
      });

    const entries = allObjects
      .filter((o) => o.key.endsWith(".pdf"))
      .map((o) => {
        const parts = o.key.split("/");
        const category = (parts[1] ?? "").replace(/-/g, " ");
        const filename = (parts[2] ?? "").replace(/\.pdf$/i, "");

        let product_code: string, product_type: string;
        if (filename.includes("--")) {
          const segs = filename.split("--");
          product_code = segs[0] ?? "";
          product_type = (segs[1] ?? "").replace(/^na$/, "").replace(/-/g, " ");
        } else if (filename.includes("__")) {
          const segs = filename.split("__");
          product_code = (segs[0] ?? "").replace(/_/g, " ");
          product_type = (segs[1] ?? "").replace(/_/g, " ").replace(/^-$/, "");
        } else {
          const firstDot = filename.indexOf(".");
          const afterCode = firstDot >= 0 ? filename.slice(firstDot + 1) : "";
          product_code = firstDot >= 0 ? filename.slice(0, firstDot) : filename;
          const secondDot = afterCode.indexOf(".");
          const typeRaw = secondDot >= 0 ? afterCode.slice(0, secondDot) : afterCode;
          product_type = typeRaw.replace(/-/g, " ").replace(/^-$/, "").replace(/^na$/, "").trim();
        }

        return {
          id: o.key,
          category,
          product_code,
          product_type,
          file_url: `${PUBLIC_URL}/${o.key}`,
          thumbnail_url: thumbMap.get(filename) ?? null,
          createdAt: o.lastModified.toISOString(),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}
