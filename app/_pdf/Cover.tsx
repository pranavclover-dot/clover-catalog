/**
 * Cover page — A4 portrait (794×1123px at 96dpi)
 *
 * Full-bleed magazine cover style (RH / CB2 / Four Hands inspired):
 *
 *   ┌─────────────────────────────────┐
 *   │  LIFESTYLE PHOTO (full page)    │  ← fills entire 794×1123
 *   │                                 │
 *   │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← top: brand bar overlay
 *   │                                 │
 *   │                                 │
 *   │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← bottom: green gradient
 *   │  [CATEGORY]                     │
 *   │  PRODUCT                        │
 *   │  CODE     ← huge white type     │
 *   │  ── accent rule ──              │
 *   │  Description                    │
 *   │  ─────────── contact bar ─────  │
 *   └─────────────────────────────────┘
 */
import { BRAND } from "@/lib/brand";

interface CoverProps {
  category: string;
  productCode: string;
  description: string;
  lifestylePhotoSrc: string;
}

export default function Cover({
  category,
  productCode,
  description,
  lifestylePhotoSrc,
}: CoverProps) {
  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        backgroundColor: "#071f10",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ══════════════════════════════════════
          FULL-BLEED HERO PHOTO
      ══════════════════════════════════════ */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={lifestylePhotoSrc}
        alt="Lifestyle"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />

      {/* ══ Bottom gradient overlay for legible text ══ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "600px",
          background: "linear-gradient(to top, rgba(4,22,11,0.97) 0%, rgba(6,28,14,0.93) 30%, rgba(7,31,16,0.72) 60%, rgba(7,31,16,0) 100%)",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      />

      {/* ══════════════════════════════════════
          TOP BAR — solid green brand identity
      ══════════════════════════════════════ */}
      {/* ── Green header bar — logo centered ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "68px",
          backgroundColor: "#0e6b3a",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/clover-logo.png"
          alt="Clover"
          style={{ height: "46px", width: "auto", objectFit: "contain" }}
        />
      </div>

      {/* Bright accent rule under header */}
      <div style={{ position: "absolute", top: "68px", left: 0, right: 0, height: "3px", backgroundColor: "#2ecc71" }} />

      {/* ── Category pill — below header, centered on the photo ── */}
      <div
        style={{
          position: "absolute",
          top: "86px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#0e6b3a",
            color: "white",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.25em",
            padding: "10px 36px",
            textTransform: "uppercase",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          {category}
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM TEXT BLOCK — overlaid on photo
      ══════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "0 44px 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── ADDRESS — above the product code ── */}
        <a href="https://share.google/P1bvtwyxU3HO2GR2I" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", textDecoration: "none" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" style={{ width: "13px", height: "13px", flexShrink: 0 }}>
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </svg>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", letterSpacing: "0.03em", fontWeight: 600, whiteSpace: "nowrap" }}>
            {BRAND.companyName} &nbsp;·&nbsp; {BRAND.address.line1} {BRAND.address.line2}, {BRAND.address.line3}
          </div>
        </a>

        {/* Thin green accent line */}
        <div style={{ width: "56px", height: "3px", backgroundColor: "#2ecc71", marginBottom: "10px" }} />

        {/* ── HERO PRODUCT CODE ── */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "18px",
            textShadow: "0 2px 24px rgba(0,0,0,0.4)",
            display: "block",
          }}
        >
          {productCode}
        </div>

        {/* Description — capped at 4 lines so it never overflows */}
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.75)",
            lineHeight: "1.6",
            maxWidth: "560px",
            marginBottom: "14px",
            letterSpacing: "0.01em",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </div>

        {/* ══ CONTACT STRIP ══ */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: "12px",
            paddingBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
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
            ] as { label: string; text: string; href: string; d: string }[]).map(({ label, text, href, d }, i) => (
              <a key={label} href={href} style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, textDecoration: "none" }}>
                {i > 0 && (
                  <div style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.15)", margin: "0 20px" }} />
                )}
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  backgroundColor: "rgba(46,204,113,0.15)", border: "1px solid rgba(46,204,113,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" style={{ width: "15px", height: "15px" }}>
                    <path d={d} />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, marginBottom: "2px" }}>
                    {label}
                  </div>
                  <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.92)", fontWeight: 600, letterSpacing: "0.01em", whiteSpace: "nowrap" }}>
                    {text}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
