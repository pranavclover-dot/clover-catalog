"use client";
/**
 * /pdf-print — renders the full catalog and triggers window.print()
 * The browser's native Print → Save as PDF replaces Puppeteer entirely.
 * No Chromium needed on the server.
 */
import { useEffect, useState } from "react";
import Cover from "@/app/_pdf/Cover";
import PhotoPage from "@/app/_pdf/PhotoPage";
import ContactPage from "@/app/_pdf/ContactPage";
import { CATEGORY_PHOTO } from "@/lib/categories";

interface PdfJob {
  category: string;
  productCode: string;
  description: string;
  photoDataUris: string[];
}

export default function PdfPrintPage() {
  const [job, setJob] = useState<PdfJob | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pdf-job");
      if (raw) setJob(JSON.parse(raw));
    } catch {
      document.body.innerText = "Error: could not read PDF data.";
    }
  }, []);

  // Auto-trigger print after images have time to load
  useEffect(() => {
    if (!job) return;
    const t = setTimeout(() => window.print(), 1800);
    return () => clearTimeout(t);
  }, [job]);

  if (!job) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif", color: "#0e6b3a", fontSize: "18px" }}>
        Preparing your catalog…
      </div>
    );
  }

  // Pair photos into gallery pages
  const pairs: [string, string | undefined][] = [];
  for (let i = 0; i < job.photoDataUris.length; i += 2) {
    pairs.push([job.photoDataUris[i], job.photoDataUris[i + 1]]);
  }

  // Cover background: use the category product image from public/
  const coverPhoto = CATEGORY_PHOTO[job.category] ?? "/lifestyle.svg";

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: white; }
        .page {
          width: 794px;
          height: 1123px;
          overflow: hidden;
          page-break-after: always;
          break-after: page;
        }
        @media print {
          html, body { width: 794px; }
          .no-print { display: none !important; }
          @page { size: A4 portrait; margin: 0; }
          .page { page-break-after: always; break-after: page; }
        }
      `}</style>

      {/* Print hint — hidden during actual print */}
      <div className="no-print" style={{ background: "#0e6b3a", color: "white", textAlign: "center", padding: "12px", fontFamily: "sans-serif", fontSize: "14px" }}>
        Your catalog is ready! In the print dialog → change destination to <strong>"Save as PDF"</strong> → click Save.
      </div>

      <div className="page"><Cover category={job.category} productCode={job.productCode} productType="" lifestylePhotoSrc={coverPhoto} /></div>

      {pairs.map(([top, bottom], idx) => (
        <div className="page" key={idx}>
          <PhotoPage topPhoto={top} bottomPhoto={bottom} pageNumber={idx + 2} />
        </div>
      ))}

      <div className="page"><ContactPage lifestylePhotoSrc={coverPhoto} /></div>
    </>
  );
}
