import "server-only";
import { createElement } from "react";
import PdfDocument, { PdfDocumentProps } from "@/app/_pdf/PdfDocument";

/**
 * Render PdfDocument to an HTML string that Puppeteer can print.
 * We inline Inter from Google Fonts + a small CSS reset so the
 * self-contained HTML renders correctly even with no network.
 */
async function buildHtml(props: PdfDocumentProps): Promise<string> {
  // Dynamic import prevents Next.js from including react-dom/server in the
  // client bundle analysis
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

export async function generatePdf(props: PdfDocumentProps): Promise<Buffer> {
  const isProd = process.env.NODE_ENV === "production";

  let browser;
  if (isProd) {
    const chromium = await import("@sparticuz/chromium");
    const puppeteer = await import("puppeteer-core");
    browser = await puppeteer.default.launch({
      args: chromium.default.args,
      defaultViewport: chromium.default.defaultViewport,
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  } else {
    // Local dev: needs Chrome installed at the system path
    const puppeteer = await import("puppeteer-core");
    browser = await puppeteer.default.launch({
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        (process.platform === "win32"
          ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
          : process.platform === "darwin"
          ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          : "/usr/bin/google-chrome"),
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123 });

    const html = await buildHtml(props);
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
