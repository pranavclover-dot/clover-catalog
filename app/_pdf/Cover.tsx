/**
 * Cover page — A4 portrait (794×1123px at 96dpi)
 * Diagonal wave design using inline SVG (renders in html2canvas).
 * Product code = hero. Category = secondary tag.
 */
import { BRAND } from "@/lib/brand";

interface CoverProps {
  category: string;
  productCode: string;
  productType: string;
}

// Diagonal offset across 794px width at ~15°
// Each layer stacks from bottom with a darker green
const STRIPE_COLORS = [
  "#c0e050", // lightest — background fill
  "#9ecf38",
  "#7dba28",
  "#5a9e18",
  "#38800a",
  "#1c6004",
  "#0a4402", // darkest
];

// Right-side y is 213px above left-side y (creates consistent ~15° diagonal)
const D = 213;
// Left-edge y positions where each new stripe begins
const LEFT_Y = [0, 190, 380, 570, 760, 950, 1060];

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

      {/* ── SVG WAVE BACKGROUND ── */}
      <svg
        width="794"
        height="1123"
        viewBox="0 0 794 1123"
        style={{ position: "absolute", inset: 0, display: "block" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base fill (lightest) */}
        <rect x="0" y="0" width="794" height="1123" fill={STRIPE_COLORS[0]} />

        {/* Stacked diagonal stripes — each covers from its diagonal line to the bottom */}
        {STRIPE_COLORS.slice(1).map((color, i) => {
          const leftY  = LEFT_Y[i + 1];
          const rightY = Math.max(0, leftY - D);
          return (
            <polygon
              key={i}
              fill={color}
              points={`0,${leftY} 794,${rightY} 794,1123 0,1123`}
            />
          );
        })}

        {/* Bottom dark gradient for text legibility */}
        <defs>
          <linearGradient id="fadeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#020e02" stopOpacity="0" />
            <stop offset="50%"  stopColor="#020e02" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#020e02" stopOpacity="0.92" />
          </linearGradient>
        </defs>
        <rect x="0" y="680" width="794" height="443" fill="url(#fadeGrad)" />
      </svg>

      {/* ── GREEN HEADER BAR ── */}
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

      {/* Accent rule */}
      <div style={{
        position: "absolute",
        top: "68px", left: 0, right: 0,
        height: "3px",
        backgroundColor: "#2ecc71",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        zIndex: 10,
      }} />

      {/* ── BOTTOM TEXT BLOCK ── */}
      <div style={{
        position: "absolute",
        bottom: "88px",
        left: "52px",
        right: "52px",
        zIndex: 10,
      }}>
        {/* Category — secondary */}
        <div style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.60)",
          letterSpacing: "0.30em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "10px",
        }}>
          {category}
        </div>

        {/* Accent line */}
        <div style={{
          width: "44px",
          height: "3px",
          backgroundColor: "#2ecc71",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          marginBottom: "12px",
        }} />

        {/* PRODUCT CODE — HERO */}
        <div style={{
          fontSize: "78px",
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
            fontSize: "15px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.48)",
            letterSpacing: "0.13em",
            textTransform: "uppercase",
          }}>
            {productType}
          </div>
        )}
      </div>

      {/* ── CONTACT STRIP ── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "72px",
        borderTop: "1px solid rgba(255,255,255,0.10)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 52px",
        zIndex: 10,
      }}>
        {([
          { label: "Website", text: BRAND.website, href: `https://${BRAND.website}`, d: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" },
          { label: "Phone",   text: BRAND.phone,   href: `tel:${BRAND.phone.replace(/\s/g,"")}`, d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 .09 1.18 2 2 0 0 1 2 .05h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" },
          { label: "Email",   text: BRAND.email,   href: `mailto:${BRAND.email}`, d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" },
        ] as { label: string; text: string; href: string; d: string }[]).map(({ label, text, href, d }) => (
          <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
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
              <div style={{ fontSize: "7px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "1px" }}>{label}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 600, whiteSpace: "nowrap" }}>{text}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
