/**
 * Cover page — A4 portrait (794×1123px at 96dpi)
 * Product code is the hero. Category is a secondary tag.
 */
import { BRAND } from "@/lib/brand";

interface CoverProps {
  category: string;
  productCode: string;
  productType: string;
}

export default function Cover({ category, productCode, productType }: CoverProps) {
  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        backgroundColor: "#071f10",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Ghost watermark logo — bottom-right ── */}
      <div style={{ position: "absolute", bottom: "100px", right: "-60px", opacity: 0.04, pointerEvents: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clover-logo.png" alt="" style={{ height: "420px", width: "auto" }} />
      </div>

      {/* ── TOP GREEN HEADER ── */}
      <div style={{
        height: "68px",
        backgroundColor: "#0e6b3a",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clover-logo.png" alt="Clover" style={{ height: "46px", width: "auto", objectFit: "contain" }} />
      </div>

      {/* Accent rule */}
      <div style={{ height: "3px", backgroundColor: "#2ecc71", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", flexShrink: 0 }} />

      {/* ── CENTRE CONTENT ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 60px",
        textAlign: "center",
      }}>

        {/* Category tag — secondary */}
        <div style={{
          display: "inline-block",
          backgroundColor: "rgba(46,204,113,0.12)",
          border: "1px solid rgba(46,204,113,0.35)",
          color: "#2ecc71",
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "0.30em",
          padding: "9px 28px",
          textTransform: "uppercase",
          borderRadius: "4px",
          marginBottom: "36px",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}>
          {category}
        </div>

        {/* PRODUCT CODE — HERO ── */}
        <div style={{
          fontSize: "88px",
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.03em",
          lineHeight: 0.88,
          textTransform: "uppercase",
          marginBottom: "28px",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}>
          {productCode}
        </div>

        {/* Accent line */}
        <div style={{
          width: "52px",
          height: "3px",
          backgroundColor: "#2ecc71",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          marginBottom: "22px",
        }} />

        {/* Product type */}
        {productType && (
          <div style={{
            fontSize: "17px",
            fontWeight: 500,
            color: "rgba(255,255,255,0.42)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            {productType}
          </div>
        )}
      </div>

      {/* ── BOTTOM CONTACT STRIP ── */}
      <div style={{
        padding: "20px 44px 26px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        flexShrink: 0,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {([
            {
              label: "Website",
              text: BRAND.website,
              href: `https://${BRAND.website}`,
              d: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
            },
            {
              label: "Phone",
              text: BRAND.phone,
              href: `tel:${BRAND.phone.replace(/\s/g, "")}`,
              d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 .09 1.18 2 2 0 0 1 2 .05h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
            },
            {
              label: "Email",
              text: BRAND.email,
              href: `mailto:${BRAND.email}`,
              d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
            },
          ] as { label: string; text: string; href: string; d: string }[]).map(({ label, text, href, d }) => (
            <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "50%",
                backgroundColor: "rgba(46,204,113,0.15)",
                border: "1px solid rgba(46,204,113,0.4)",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" style={{ width: "15px", height: "15px" }}>
                  <path d={d} />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.32)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "2px" }}>
                  {label}
                </div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 600, letterSpacing: "0.01em", whiteSpace: "nowrap" }}>
                  {text}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
