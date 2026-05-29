import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

const MANIFEST = "catalog-manifest.json";

export async function GET() {
  try {
    const { blobs } = await list({ prefix: MANIFEST });
    if (blobs.length === 0) {
      return NextResponse.json({ entries: [] });
    }
    const res = await fetch(blobs[0].url + "?nocache=" + Date.now());
    const entries = await res.json();
    return NextResponse.json({ entries });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}
