/**
 * Cover page — A4 portrait (794×1123px at 96dpi)
 * Diagonal wave stripe design, product code as hero text.
 */
import { BRAND } from "@/lib/brand";

interface CoverProps {
  category: string;
  productCode: string;
  productType: string;
}

const WAVES = [
  { color: "#a8d84a" },                                                                   // lightest — background
  { color: "#82c035", clip: "polygon(0 16%, 100% 0%, 100% 100%, 0 100%)" },
  { color: "#5ea828", clip: "polygon(0 30%, 100% 14%, 100% 100%, 0 100%)" },
  { color: "#3e8a1c", clip: "polygon(0 44%, 100% 28%, 100% 100%, 0 100%)" },
  { color: "#25700e", clip: "polygon(0 58%, 100% 42%, 100% 100%, 0 100%)" },
  { color: "#105808", clip: "polygon(0 72%, 100% 56%, 100% 100%, 0 100%)" },
  { color: "#074205", clip: "polygon(0 84%, 100% 68%, 100% 100%, 0 100%)" },
];

export default function Cover({ category, productCode, productType }: CoverProps) {
  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >

      {/* ── WAVE LAYERS ── */}
      {WAVES.map((w, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: w.color,
            clipPath: (w as { clip?: string }).clip ?? undefined,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        />
      ))}

      {/* ── BOTTOM GRADIENT — makes text readable ── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "400px",
        background: "linear-gradient(to bottom, rgba(3,18,2,0) 0%, rgba(3,18,2,0.75) 45%, rgba(3,18,2,0.95) 100%)",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        zIndex: 2,
      }} />

      {/* ── GREEN HEADER BAR — on top of waves ── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "68px",
        backgroundColor: "#0e6b3a",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clover-logo.png" alt="Clover" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
      </div>

      {/* Accent rule under header */}
      <div style={{
        position: "absolute",
        top: "68px", left: 0, right: 0,
        height: "3px",
        backgroundColor: "#2ecc71",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        zIndex: 10,
      }} />

      {/* ── TEXT BLOCK — bottom of page ── */}
      <div style={{
        position: "absolute",
        bottom: "84px",
        left: "52px",
        right: "52px",
        zIndex: 10,
      }}>
        {/* Category — secondary label */}
        <div style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.65)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "12px",
        }}>
          {category}
        </div>

        {/* Accent line */}
        <div style={{
          width: "48px",
          height: "3px",
          backgroundColor: "#2ecc71",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          marginBottom: "14px",
        }} />

        {/* PRODUCT CODE — HERO ── */}
        <div style={{
          fontSize: "82px",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          lineHeight: 0.9,
          textTransform: "uppercase",
          marginBottom: "14px",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}>
          {productCode}
        </div>

        {/* Product type */}
        {productType && (
          <div style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.50)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            {productType}
          </div>
        )}
      </div>

      {/* ── CONTACT STRIP — very bottom ── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "70px",
        borderTop: "1px solid rgba(255,255,255,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 52px",
        zIndex: 10,
      }}>
        {([
          {
            label: "Website", text: BRAND.website, href: `https://${BRAND.website}`,
            d: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
          },
          {
            label: "Phone", text: BRAND.phone, href: `tel:${BRAND.phone.replace(/\s/g, "")}`,
            d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 .09 1.18 2 2 0 0 1 2 .05h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
          },
          {
            label: "Email", text: BRAND.email, href: `mailto:${BRAND.email}`,
            d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
          },
        ] as { label: string; text: string; href: string; d: string }[]).map(({ label, text, href, d }) => (
          <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" style={{ width: "13px", height: "13px" }}>
                <path d={d} />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "2px" }}>
                {label}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 600, whiteSpace: "nowrap" }}>
                {text}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
