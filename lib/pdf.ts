import "server-only";
import { createElement } from "react";
import PdfDocument, { PdfDocumentProps } from "@/app/_pdf/PdfDocument";

async function buildHtml(props: PdfDocumentProps): Promise<string> {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const body = renderToStaticMarkup(createElement(PdfDocument, props));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter','Helvetica Neue',Arial,sans-serif;background:#fff;}
  @page{size:A4 portrait;margin:0;}
  @media print{
    body{margin:0;}
    div[style*="page-break-after"]{page-break-after:always;break-after:page;}
  }
</style>
</head>
<body>${body}</body>
</html>`;
}

function getChromiumPath(): string | null {
  // Explicit override via env var (set this in Render/Railway dashboard)
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  // Common Linux paths (Render, Railway, etc.)
  const { existsSync } = require("fs");
  const linuxPaths = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/snap/bin/chromium",
  ];
  for (const p of linuxPaths) {
    if (existsSync(p)) return p;
  }

  return null;
}

export async function generatePdf(props: PdfDocumentProps): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  const html = await buildHtml(props);

  const systemChrome = getChromiumPath();
  let browser;

  if (systemChrome) {
    // Render / Railway / any Linux server with Chromium installed
    browser = await puppeteer.default.launch({
      executablePath: systemChrome,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
      ],
    });
  } else if (process.env.NODE_ENV === "production") {
    // Lambda / Vercel serverless — use sparticuz chromium
    const chromium = await import("@sparticuz/chromium");
    browser = await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  } else {
    // Local Windows/Mac dev
    browser = await puppeteer.default.launch({
      executablePath:
        process.platform === "win32"
          ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
          : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
