"use client";

import { useState, useRef, useCallback } from "react";
import { upload } from "@vercel/blob/client";
import PhotoPage from "@/app/_pdf/PhotoPage";

interface Photo {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
}

interface Entry {
  id: string;
  category: string;
  product_code: string;
  product_type: string;
  file_url: string;
  createdAt: string;
}

interface Props {
  entry: Entry;
  adminKey: string;
  onClose: () => void;
}

type Step = "upload" | "processing" | "done" | "error";

export default function AddPhotosModal({ entry, adminKey, onClose }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [step, setStep] = useState<Step>("upload");
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [existingPageCount, setExistingPageCount] = useState(0);
  const pagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suppress unused warning — adminKey is kept for future server-side auth checks
  void adminKey;

  const compressImage = useCallback((file: File): Promise<Photo> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
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
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(objectUrl);
        resolve({ id: crypto.randomUUID(), dataUrl: canvas.toDataURL("image/jpeg", 0.85), width, height });
      };
      img.onerror = reject;
      img.src = objectUrl;
    });
  }, []);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const photo = await compressImage(file);
        setPhotos((prev) => [...prev, photo]);
      } catch { /* skip */ }
    }
  }, [compressImage]);

  const photoGroups: { top: Photo; bottom: Photo | null }[] = [];
  for (let i = 0; i < photos.length; i += 2) {
    photoGroups.push({ top: photos[i], bottom: photos[i + 1] ?? null });
  }

  const handleAppend = async () => {
    if (photos.length === 0) { setError("Add at least one photo first."); return; }
    setError("");
    setStep("processing");
    setStatusMsg("Loading existing PDF…");

    try {
      // ── Load everything in parallel ──────────────────────────────
      const [existingBytes, { default: html2canvas }, { default: jsPDF }, { PDFDocument }] = await Promise.all([
        fetch(entry.file_url).then((r) => r.arrayBuffer()),
        import("html2canvas"),
        import("jspdf"),
        import("pdf-lib"),
      ]);

      const existingDoc = await PDFDocument.load(existingBytes);
      const count = existingDoc.getPageCount();

      // Set page count → triggers re-render → off-screen PhotoPages mount
      setExistingPageCount(count);
      setStatusMsg("Rendering new pages…");

      // Wait for React to commit the render with correct PhotoPages
      await new Promise((r) => setTimeout(r, 500));

      // ── Capture new photo pages with html2canvas → jsPDF ─────────
      const container = pagesRef.current;
      if (!container) throw new Error("Render container not found");
      const pageEls = container.querySelectorAll<HTMLElement>(".pdf-page");
      if (pageEls.length === 0) throw new Error("No pages rendered");

      const newPdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123] });
      for (let i = 0; i < pageEls.length; i++) {
        const canvas = await html2canvas(pageEls[i], {
          scale: 2, useCORS: true, allowTaint: true,
          backgroundColor: "#ffffff", width: 794, height: 1123, logging: false,
        });
        if (i > 0) newPdf.addPage([794, 1123], "portrait");
        newPdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 794, 1123);
      }

      // ── Merge with pdf-lib ────────────────────────────────────────
      setStatusMsg("Merging PDFs…");
      const newPdfBytes = newPdf.output("arraybuffer");
      const newDoc = await PDFDocument.load(newPdfBytes);
      const merged = await PDFDocument.create();

      // All existing pages except the last (contact page)
      const bodyIndices = Array.from({ length: count - 1 }, (_, i) => i);
      const existingBodyPages = await merged.copyPages(existingDoc, bodyIndices);
      existingBodyPages.forEach((p) => merged.addPage(p));

      // New photo pages
      const newPageIndices = Array.from({ length: newDoc.getPageCount() }, (_, i) => i);
      const newPages = await merged.copyPages(newDoc, newPageIndices);
      newPages.forEach((p) => merged.addPage(p));

      // Re-add the contact page (last of existing)
      const [contactPage] = await merged.copyPages(existingDoc, [count - 1]);
      merged.addPage(contactPage);

      const mergedBytes = await merged.save();

      // ── Re-upload to same Vercel Blob path (overwrites) ───────────
      setStatusMsg("Uploading updated PDF…");
      const blobPath = new URL(entry.file_url).pathname.slice(1);
      const filename = blobPath.split("/").pop()!;
      const mergedFile = new File([new Uint8Array(mergedBytes)], filename, { type: "application/pdf" });
      await upload(blobPath, mergedFile, { access: "public", handleUploadUrl: "/api/catalog/upload" });

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStep("upload");
      setExistingPageCount(0);
    }
  };

  const newPageCount = photoGroups.length;

  return (
    <>
      {/* Off-screen render area — only mounts once we have the existing page count */}
      {step === "processing" && existingPageCount > 0 && (
        <div ref={pagesRef} style={{ position: "fixed", top: 0, left: "-10000px", width: "794px", pointerEvents: "none", zIndex: -1 }}>
          {photoGroups.map(({ top, bottom }, idx) => (
            <div key={idx} className="pdf-page" style={{ width: 794, height: 1123, overflow: "hidden" }}>
              <PhotoPage
                topPhoto={top.dataUrl} topWidth={top.width} topHeight={top.height}
                bottomPhoto={bottom?.dataUrl} bottomWidth={bottom?.width} bottomHeight={bottom?.height}
                pageNumber={existingPageCount + idx}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal overlay */}
      <div
        onClick={step === "processing" ? undefined : onClose}
        style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)",
          zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "white", borderRadius: "18px", width: "100%", maxWidth: "480px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.25)", overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: "#0e6b3a", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>
                Add Photos
              </div>
              <div style={{ color: "white", fontSize: "17px", fontWeight: 800, marginTop: "2px" }}>
                {entry.product_code}
                {entry.product_type && <span style={{ fontWeight: 400, opacity: 0.7 }}> · {entry.product_type}</span>}
              </div>
            </div>
            {step !== "processing" && (
              <button onClick={onClose} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", color: "white", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                ×
              </button>
            )}
          </div>

          <div style={{ padding: "24px" }}>

            {/* ── DONE STATE ── */}
            {step === "done" && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#0e6b3a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", color: "white" }}>✓</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#111", marginBottom: "6px" }}>Pages Added!</div>
                <div style={{ fontSize: "13px", color: "#888", marginBottom: "24px" }}>
                  {newPageCount} new page{newPageCount !== 1 ? "s" : ""} appended to the PDF.
                </div>
                <button
                  onClick={onClose}
                  style={{ width: "100%", padding: "12px", backgroundColor: "#0e6b3a", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
                >
                  Done
                </button>
              </div>
            )}

            {/* ── PROCESSING STATE ── */}
            {step === "processing" && (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ width: "44px", height: "44px", border: "3px solid #0e6b3a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#333" }}>{statusMsg}</div>
                <div style={{ fontSize: "12px", color: "#aaa", marginTop: "6px" }}>Please wait, don&apos;t close this window</div>
              </div>
            )}

            {/* ── UPLOAD STATE ── */}
            {step === "upload" && (
              <>
                {error && (
                  <div style={{ backgroundColor: "#fff0f0", border: "1.5px solid #fca5a5", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#dc2626", marginBottom: "16px" }}>
                    {error}
                  </div>
                )}

                <div style={{ fontSize: "12px", color: "#888", marginBottom: "14px", lineHeight: 1.5 }}>
                  These photos will be added as new pages <strong>before the contact page</strong>.
                </div>

                {/* Photo grid */}
                {photos.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "12px" }}>
                    {photos.map((p) => (
                      <div key={p.id} style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.dataUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          onClick={() => setPhotos((prev) => prev.filter((x) => x.id !== p.id))}
                          style={{ position: "absolute", top: "4px", right: "4px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "rgba(0,0,0,0.6)", border: "none", color: "white", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: "100%", padding: "18px", borderRadius: "10px", border: "2px dashed #d1d5db",
                    background: "none", cursor: "pointer", fontSize: "13px", color: "#6b7280",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    marginBottom: "16px",
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: "24px", height: "24px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{photos.length > 0 ? "Add more photos" : "Tap to add photos"}</span>
                </button>

                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={(e) => handleFiles(e.target.files)} style={{ display: "none" }} />

                {/* Page count info */}
                {photos.length > 0 && (
                  <div style={{ fontSize: "12px", color: "#0e6b3a", fontWeight: 600, marginBottom: "16px", textAlign: "center" }}>
                    {photos.length} photo{photos.length !== 1 ? "s" : ""} → {newPageCount} new page{newPageCount !== 1 ? "s" : ""} will be added
                  </div>
                )}

                {/* Append button */}
                <button
                  onClick={handleAppend}
                  disabled={photos.length === 0}
                  style={{
                    width: "100%", padding: "13px", backgroundColor: photos.length === 0 ? "#e5e7eb" : "#0e6b3a",
                    color: photos.length === 0 ? "#9ca3af" : "white", border: "none", borderRadius: "10px",
                    fontSize: "14px", fontWeight: 700, cursor: photos.length === 0 ? "not-allowed" : "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  Append {newPageCount > 0 ? `${newPageCount} Page${newPageCount !== 1 ? "s" : ""} to PDF` : "Pages to PDF"}
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
