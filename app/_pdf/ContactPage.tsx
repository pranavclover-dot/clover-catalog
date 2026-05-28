/**
 * Contact page — A4 portrait (794×1123px at 96dpi).
 *
 * Design system (matches Cover & PhotoPage):
 *   • Same green header: logo + CLOVER® wordmark (mirrors PhotoPage header)
 *   • 3px bright-green accent rule under header
 *   • Bold "GET IN TOUCH" section heading with accent rule
 *   • 4 contact rows with bright-green icon circles (same accent as cover)
 *   • Full-bleed lifestyle photo filling all remaining space
 *   • Same green footer as PhotoPage
 */
import { BRAND } from "@/lib/brand";

interface ContactPageProps {
  lifestylePhotoSrc: string;
}

interface ContactRowProps {
  label: string;
  value: string;
  href: string;
  icon: string;
}

function ContactRow({ label, value, href, icon }: ContactRowProps) {
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "14px 0",
        borderBottom: "1px solid #f0f0f0",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Bright-green icon circle */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          backgroundColor: "#0e6b3a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div style={{
          position: "absolute",
          inset: "-2px",
          borderRadius: "50%",
          border: "2px solid rgba(46,204,113,0.35)",
        }} />
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          style={{ width: "18px", height: "18px" }}>
          <path d={icon} />
        </svg>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: "8px",
          color: "#aaa",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "3px",
        }}>
          {label}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#111", letterSpacing: "0.01em" }}>
          {value}
        </div>
      </div>

      {/* Right accent dot */}
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2ecc71", opacity: 0.6, flexShrink: 0 }} />
    </a>
  );
}

export default function ContactPage({ lifestylePhotoSrc }: ContactPageProps) {
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
      {/* ══ HEADER — same green bar as PhotoPage ══ */}
      <div
        style={{
          height: "64px",
          backgroundColor: "#0e6b3a",
          display: "flex",
          alignItems: "center",
          padding: "0 44px",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Left: logo — PNG already includes wordmark + tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clover logo.png" alt="Clover" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
        </div>

        {/* Right: "CONTACT" label */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
            REACH
          </div>
          <div style={{ color: "white", fontSize: "16px", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            US
          </div>
        </div>
      </div>

      {/* Bright green accent rule — same as PhotoPage & cover */}
      <div style={{ height: "3px", backgroundColor: "#2ecc71", flexShrink: 0 }} />

      {/* ══ SECTION HEADING ══ */}
      <div style={{ padding: "28px 44px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "4px" }}>
          <div style={{ width: "40px", height: "3px", backgroundColor: "#2ecc71", borderRadius: "2px" }} />
          <div style={{ fontSize: "10px", color: "#0e6b3a", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 800 }}>
            Get In Touch
          </div>
        </div>
        <div style={{ fontSize: "38px", fontWeight: 900, color: "#0a0a0a", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          We&apos;d love to<br />hear from you.
        </div>
      </div>

      {/* ══ CONTACT ROWS ══ */}
      <div style={{ padding: "16px 44px 0", flexShrink: 0 }}>
        <ContactRow
          icon="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 .09 1.18 2 2 0 0 1 2 .05h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          label="Phone"
          value={BRAND.phone}
          href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
        />
        <ContactRow
          icon="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"
          label="Email"
          value={BRAND.email}
          href={`mailto:${BRAND.email}`}
        />
        <ContactRow
          icon="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
          label="Website"
          value={BRAND.website}
          href={`https://${BRAND.website}`}
        />
        <ContactRow
          icon="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
          label="Address"
          value={`${BRAND.address.line1}, ${BRAND.address.line2}, ${BRAND.address.line3}  (click here for map)`}
          href="https://share.google/P1bvtwyxU3HO2GR2I"
        />
      </div>

      {/* ══ LIFESTYLE PHOTO — fills all remaining height ══ */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", marginTop: "20px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lifestylePhotoSrc}
          alt="Lifestyle"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Gradient overlay at top of photo for smooth transition */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)",
        }} />
        {/* Brand watermark overlay on photo */}
        <div style={{
          position: "absolute",
          bottom: "36px",
          right: "44px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          opacity: 0.5,
        }}>
          {/* Logo PNG — already includes wordmark text */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clover logo.png" alt="" style={{ height: "28px", width: "auto" }} />
        </div>
      </div>

      {/* ══ FOOTER — same green bar as PhotoPage ══ */}
      <div
        style={{
          height: "36px",
          backgroundColor: "#0e6b3a",
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
        <div style={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "#2ecc71" }} />
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontWeight: 500 }}>
          {BRAND.website}
        </div>
        <div style={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: "#2ecc71" }} />
        <div style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", fontWeight: 500 }}>
          {BRAND.phone}
        </div>
      </div>
    </div>
  );
}
