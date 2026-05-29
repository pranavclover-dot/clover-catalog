"use client";

import { useState, useRef, useCallback } from "react";
import { CATEGORIES, CATEGORY_NAMES, CATEGORY_PHOTO } from "@/lib/categories";
import { BRAND } from "@/lib/brand";
import Cover from "@/app/_pdf/Cover";
import PhotoPage from "@/app/_pdf/PhotoPage";
import ContactPage from "@/app/_pdf/ContactPage";

interface PhotoPreview {
  id: string;
  dataUrl: string;
  file: File;
}

type Step = "form" | "generating" | "done";

export default function HomePage() {
  const [category, setCategory] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productType, setProductType] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
  };

  const compressImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1600;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = url;
    });
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const newPhotos: PhotoPreview[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        try {
          const dataUrl = await compressImage(file);
          newPhotos.push({ id: crypto.randomUUID(), dataUrl, file });
        } catch {
          // skip unreadable files
        }
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    },
    [compressImage]
  );

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!category) { setError("Please select a category."); return; }
    if (!productCode.trim()) { setError("Please enter a product code."); return; }
    if (photos.length === 0) { setError("Please add at least one photo."); return; }

    setStep("generating");

    // Small delay so React renders the hidden pages into the DOM first
    await new Promise((r) => setTimeout(r, 300));

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const container = pagesRef.current;
      if (!container) throw new Error("Pages not mounted");

      const pageEls = container.querySelectorAll<HTMLElement>(".pdf-page");
      if (pageEls.length === 0) throw new Error("No pages found");

      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123] });

      for (let i = 0; i < pageEls.length; i++) {
        const el = pageEls[i];

        // Collect all clickable links BEFORE rendering (positions are in CSS px)
        const pageRect = el.getBoundingClientRect();
        const linkAnnotations: { x: number; y: number; w: number; h: number; url: string }[] = [];
        el.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
          const r = a.getBoundingClientRect();
          const url = a.getAttribute("href") ?? "";
          if (!url || url.startsWith("javascript")) return;
          linkAnnotations.push({
            x: r.left - pageRect.left,
            y: r.top - pageRect.top,
            w: r.width || 200,
            h: r.height || 24,
            url,
          });
        });

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          width: 794,
          height: 1123,
          logging: false,
        });

        if (i > 0) pdf.addPage([794, 1123], "portrait");
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        pdf.addImage(imgData, "JPEG", 0, 0, 794, 1123);

        // Add clickable link overlays on top of the image
        for (const lnk of linkAnnotations) {
          pdf.link(lnk.x, lnk.y, lnk.w, lnk.h, { url: lnk.url });
        }
      }

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF generation failed. Please try again.");
      setStep("form");
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${productCode.trim().replace(/\s+/g, "_")}_Clover.pdf`;
    a.click();
  };

  const handleShare = async () => {
    if (pdfUrl) {
      try {
        const blob = await fetch(pdfUrl).then((r) => r.blob());
        const file = new File([blob], `${productCode.trim().replace(/\s+/g, "_")}_Clover.pdf`, { type: "application/pdf" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `${BRAND.companyName} – ${productCode}` });
          return;
        }
      } catch {
        // fall through to WhatsApp
      }
    }
    const text = encodeURIComponent(
      `${BRAND.companyName} – ${category}\nProduct: ${productCode}\n${BRAND.phone}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleUploadToCatalog = async () => {
    if (!pdfUrl) return;
    setUploading(true);
    try {
      const { upload } = await import("@vercel/blob/client");
      const blob = await fetch(pdfUrl).then((r) => r.blob());
      const file = new File([blob], `${productCode.trim().replace(/\s+/g, "_")}_${Date.now()}.pdf`, { type: "application/pdf" });

      const uploaded = await upload(`catalogs/${category}/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/catalog/upload",
      });

      await fetch("/api/catalog/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          productCode: productCode.trim(),
          productType: productType.trim(),
          fileUrl: uploaded.url,
        }),
      });

      setUploadDone(true);
    } catch (err) {
      alert("Upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
    }
    setUploading(false);
  };

  const handleReset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
    setUploadDone(false);
    setStep("form");
    setError(null);
    setPhotos([]);
    setProductCode("");
    setProductType("");
    setCategory("");
  };

  // Build page data
  const photoDataUris = photos.map((p) => p.dataUrl);
  const pairs: [string, string | undefined][] = [];
  for (let i = 0; i < photoDataUris.length; i += 2) {
    pairs.push([photoDataUris[i], photoDataUris[i + 1]]);
  }
  const coverPhoto = CATEGORY_PHOTO[category] ?? "/lifestyle.svg";

  return (
    <>
      {/* ══ OFF-SCREEN RENDER AREA — captured by html2canvas ══ */}
      {step !== "form" && (
        <div
          ref={pagesRef}
          style={{
            position: "fixed",
            top: 0,
            left: "-10000px",
            width: "794px",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <div className="pdf-page" style={{ width: 794, height: 1123, overflow: "hidden" }}>
            <Cover
              category={category}
              productCode={productCode}
              productType={productType}
              lifestylePhotoSrc={coverPhoto}
            />
          </div>

          {pairs.map(([top, bottom], idx) => (
            <div key={idx} className="pdf-page" style={{ width: 794, height: 1123, overflow: "hidden" }}>
              <PhotoPage topPhoto={top} bottomPhoto={bottom} pageNumber={idx + 2} />
            </div>
          ))}

          <div className="pdf-page" style={{ width: 794, height: 1123, overflow: "hidden" }}>
            <ContactPage lifestylePhotoSrc={coverPhoto} />
          </div>
        </div>
      )}

      {/* ══ APP UI ══ */}
      <div className="min-h-dvh flex flex-col" style={{ background: "var(--clover-cream)" }}>
        {/* Header */}
        <header
          className="flex items-center justify-between px-4 py-3 text-white"
          style={{ backgroundColor: "var(--clover-green)" }}
        >
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/clover-logo.png" alt="Clover" className="h-8 w-auto object-contain" />
          </div>
          <div className="text-xs opacity-75">Catalog Generator</div>
        </header>

        {/* Body */}
        <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">

          {/* ── DONE STATE ──────────────────────────────────────── */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-5 pt-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl"
                style={{ backgroundColor: "var(--clover-green)" }}
              >
                ✓
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">PDF Ready!</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {productCode} · {category}
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm"
                style={{ backgroundColor: "var(--clover-green)" }}
              >
                Download PDF
              </button>

              <button
                onClick={handleShare}
                className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: "#25D366", color: "white" }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Share on WhatsApp
              </button>

              {/* Upload to Catalog */}
              {!uploadDone ? (
                <button
                  onClick={handleUploadToCatalog}
                  disabled={uploading}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ backgroundColor: "#f0f7f3", color: "#0e6b3a", border: "2px solid #0e6b3a" }}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#0e6b3a", borderTopColor: "transparent" }} />
                      Uploading…
                    </>
                  ) : (
                    <>
                      ☁️ Add to Catalog Library
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full py-3.5 rounded-xl text-sm text-center font-semibold" style={{ backgroundColor: "#f0f7f3", color: "#0e6b3a" }}>
                  ✓ Added to Catalog Library
                </div>
              )}

              <button
                onClick={handleReset}
                className="text-sm underline text-gray-500 mt-2"
              >
                Generate another
              </button>
            </div>
          )}

          {/* ── GENERATING STATE ────────────────────────────────── */}
          {step === "generating" && (
            <div className="flex flex-col items-center gap-4 pt-16 text-center">
              <div
                className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin"
                style={{ borderColor: "var(--clover-green)", borderTopColor: "transparent" }}
              />
              <p className="font-semibold text-gray-700">Building your PDF…</p>
              <p className="text-xs text-gray-400">This takes a few seconds</p>
            </div>
          )}

          {/* ── FORM STATE ──────────────────────────────────────── */}
          {step === "form" && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h1 className="text-lg font-bold text-gray-900">New Product Catalog</h1>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--clover-green)" }}
                >
                  <option value="">Select a category…</option>
                  {CATEGORY_NAMES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Product code */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product Code
                </label>
                <input
                  type="text"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="e.g. BS 1 EECO"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--clover-green)" }}
                />
              </div>

              {/* Type / Variant */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type / Variant <span className="normal-case text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  placeholder="e.g. 100% Cotton · Satin Finish"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: "var(--clover-green)" }}
                />
              </div>


              {/* Photo upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product Photos ({photos.length})
                </label>

                {photos.length > 0 && (
                  <div className="photo-grid">
                    {photos.map((p) => (
                      <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(p.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 flex flex-col items-center gap-1 active:bg-gray-50"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Tap to add photos</span>
                  <span className="text-xs text-gray-400">Camera or gallery</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white text-sm mt-2 active:opacity-90"
                style={{ backgroundColor: "var(--clover-green)" }}
              >
                Generate PDF
              </button>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
