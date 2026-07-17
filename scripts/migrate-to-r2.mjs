/**
 * Migrates all PDFs from the local backup (already downloaded from Vercel Blob)
 * to Cloudflare R2, then also tries to fetch and migrate thumbnails from Vercel Blob.
 *
 * Run: node scripts/migrate-to-r2.mjs
 * Requires env vars: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";

const BACKUP_DIR = "C:/Users/apran/Desktop/Clover Catalog Backup";
const CATALOG_API = "https://clover-catalog-tdj5.vercel.app/api/catalog/list";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET_NAME;

async function upload(key, body, contentType) {
  await r2.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }));
}

// ── Step 1: Upload PDFs from local backup ─────────────────────────
console.log("Step 1: Uploading PDFs from local backup…\n");
const files = readdirSync(BACKUP_DIR).filter((f) => f.endsWith(".pdf"));
let pdfOk = 0, pdfFail = 0;

for (const file of files) {
  // Filename format: "Category Name__CODE--TYPE--TIMESTAMP.pdf"
  const [categoryRaw, rest] = file.split("__");
  if (!rest) { console.log(`  SKIP (unexpected name): ${file}`); continue; }

  // Convert category name back to hyphenated path segment
  const categoryPath = (categoryRaw ?? "unknown").replace(/\s+/g, "-");
  const key = `catalogs/${categoryPath}/${rest}`;

  process.stdout.write(`  [${pdfOk + pdfFail + 1}/${files.length}] ${key} … `);
  try {
    const body = readFileSync(join(BACKUP_DIR, file));
    await upload(key, body, "application/pdf");
    pdfOk++;
    console.log("✓");
  } catch (err) {
    pdfFail++;
    console.log(`✗ ${err.message}`);
  }
}

console.log(`\n  PDFs: ${pdfOk} uploaded, ${pdfFail} failed\n`);

// ── Step 2: Fetch thumbnails from Vercel Blob and upload to R2 ────
console.log("Step 2: Migrating thumbnails from Vercel Blob…\n");
const { entries } = await fetch(CATALOG_API).then((r) => r.json());
let thumbOk = 0, thumbSkip = 0, thumbFail = 0;

for (const entry of entries ?? []) {
  const pdfUrl = entry.file_url;
  const thumbUrl = pdfUrl.replace(/\.pdf$/i, ".thumb.jpg");

  // Derive R2 key from the PDF URL pathname
  const pdfPathname = new URL(pdfUrl).pathname.slice(1);
  const thumbKey = pdfPathname.replace(/\.pdf$/i, ".thumb.jpg");

  process.stdout.write(`  ${thumbKey} … `);
  try {
    const res = await fetch(thumbUrl);
    if (res.status === 404) { thumbSkip++; process.stdout.write("(no thumb)\n"); continue; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await upload(thumbKey, buf, "image/jpeg");
    thumbOk++;
    console.log("✓");
  } catch (err) {
    thumbFail++;
    console.log(`✗ ${err.message}`);
  }
}

console.log(`\n  Thumbnails: ${thumbOk} uploaded, ${thumbSkip} skipped (none existed), ${thumbFail} failed\n`);
console.log("Migration complete ✓");
