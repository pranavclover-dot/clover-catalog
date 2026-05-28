/**
 * Gallery page — A4 portrait (794×1123px at 96dpi).
 *
 * Design system (matches Cover & ContactPage):
 *   • Same green header: logo + "PRODUCT GALLERY" + page number
 *   • 3px bright-green accent rule under header (matches cover's accent)
 *   • Two full-width photos filling the body
 *   • Green watermark separator between photos
 *   • Green footer with brand name + website (mirrors cover contact language)
 */
import { BRAND } from "@/lib/brand";

interface PhotoPageProps {
  topPhoto: string;
  bottomPhoto?: string;
  pageNumber?: number;
}

function PhotoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        margin: "0 28px",
        flex: 1,
        borderRadius: "14px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

function EmptyCard() {
  return (
    <div
      style={{
        margin: "0 28px",
        flex: 1,
        borderRadius: "14px",
        backgroundColor: "#e8f0ea",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        flexShrink: 0,
        boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
      }}
    />
  );
}

export default function PhotoPage({ topPhoto, bottomPhoto, pageNumber }: PhotoPageProps) {
  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        backgroundColor: "#ffffff",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ══ HEADER — green bar (matches cover top bar DNA) ══ */}
      <div
        style={{
          height: "64px",
          backgroundColor: "#0e6b3a",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          display: "flex",
          alignItems: "center",
          padding: "0 44px",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Left: logo (PNG includes wordmark) + page label */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clover-logo.png" alt="Clover" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
          <div style={{ width: "1px", height: "28px", backgroundColor: "rgba(255,255,255,0.2)" }} />
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700 }}>
            PRODUCT GALLERY
          </div>
        </div>

        {/* Right: page number */}
        {pageNumber !== undefined && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
              PAGE
            </div>
            <div style={{ color: "white", fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {String(pageNumber).padStart(2, "0")}
            </div>
          </div>
        )}
      </div>

      {/* Bright green accent rule — same as cover */}
      <div style={{ height: "3px", backgroundColor: "#2ecc71", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", flexShrink: 0 }} />

      {/* ══ PHOTOS AREA — fills all remaining height ══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <PhotoCard src={topPhoto} alt="Product photo" />

        {/* Separator — Clover green image on white background */}
        <div
          style={{
            height: "52px",
            flexShrink: 0,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/clover-green.png"
            alt=""
            style={{ height: "100%", width: "auto", objectFit: "contain", display: "block" }}
          />
        </div>

        {bottomPhoto ? (
          <PhotoCard src={bottomPhoto} alt="Product photo" />
        ) : (
          <EmptyCard />
        )}
      </div>

      {/* ══ FOOTER — green bar with brand info ══ */}
      <div
        style={{
          height: "36px",
          backgroundColor: "#0e6b3a",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 44px",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>
          {BRAND.companyName}
        </div>
        <div style={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "#2ecc71", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }} />
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontWeight: 500 }}>
          {BRAND.website}
        </div>
        <div style={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "#2ecc71", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }} />
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontWeight: 500 }}>
          {BRAND.phone}
        </div>
      </div>
    </div>
  );
}
