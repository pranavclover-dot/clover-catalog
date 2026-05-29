import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";

const ADMIN_KEY = process.env.ADMIN_KEY ?? "clover2024";

export async function DELETE(req: NextRequest) {
  const { url, key } = await req.json();

  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!url) {
    return NextResponse.json({ error: "No URL provided" }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ success: true });
}
