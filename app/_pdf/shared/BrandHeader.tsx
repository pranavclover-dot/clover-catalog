/**
 * Green header band — used on the Cover page.
 * Contains: location block (TL), logo + wordmark (center), contact block (TR).
 * Torn-paper bottom edge (green teeth extending downward into white).
 */
import { BRAND } from "@/lib/brand";

export default function BrandHeader() {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {/* ── Green band ──────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#0e6b3a",
          padding: "24px 40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "145px",
          position: "relative",
        }}
      >
        {/* Left – address block */}
        <div style={{ color: "white", fontSize: "10.5px", lineHeight: "1.6", maxWidth: "168px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
            {/* Pin icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "13px", height: "13px", flexShrink: 0, marginTop: "3px" }}
            >
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <div>
              <div style={{ fontWeight: 800, fontSize: "11px", letterSpacing: "0.07em", marginBottom: "2px" }}>
                {BRAND.companyName.toUpperCase()}
              </div>
              <div style={{ opacity: 0.9 }}>{BRAND.address.line1}</div>
              <div style={{ opacity: 0.9 }}>{BRAND.address.line2}</div>
              <div style={{ opacity: 0.9 }}>{BRAND.address.line3}</div>
            </div>
          </div>
        </div>

        {/* Center – logo + wordmark (absolutely centered) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/clover-logo.png"
            alt=""
            style={{ width: "64px", height: "64px", objectFit: "contain" }}
          />
          <div
            style={{
              color: "white",
              fontWeight: 900,
              fontSize: "22px",
              letterSpacing: "0.22em",
              lineHeight: 1,
            }}
          >
            {BRAND.wordmark}
            <sup style={{ fontSize: "9px", fontWeight: 400, letterSpacing: 0 }}>®</sup>
          </div>
          <div
            style={{
              color: "white",
              fontSize: "7px",
              letterSpacing: "0.28em",
              opacity: 0.8,
              textTransform: "uppercase",
            }}
          >
            {BRAND.tagline}
          </div>
        </div>

        {/* Right – contact */}
        <div
          style={{
            color: "white",
            fontSize: "10.5px",
            lineHeight: "2.0",
            textAlign: "right",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "7px" }}>
            <span style={{ opacity: 0.95 }}>{BRAND.email}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "12px", height: "12px", flexShrink: 0 }}>
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "7px" }}>
            <span style={{ opacity: 0.95 }}>{BRAND.phone}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "12px", height: "12px", flexShrink: 0 }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 9.81 19.79 19.79 0 0 1 .09 1.18 2 2 0 0 1 2 .05h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "7px", marginTop: "2px" }}>
            <span style={{ opacity: 0.95 }}>{BRAND.website}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ width: "12px", height: "12px", flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Torn-paper bottom edge (green teeth → white body) ── */}
      <svg
        viewBox="0 0 1000 60"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: "34px", marginTop: "-1px" }}
      >
        <path
          d="M0,0 L0,30 C25,44 50,16 80,32 C110,48 135,20 165,36 C195,52 220,22 250,38 C280,54 305,18 335,34 C365,50 390,20 420,36 C450,52 475,18 505,34 C535,50 560,22 590,38 C620,54 645,20 675,36 C705,52 730,18 760,34 C790,50 815,22 845,38 C875,54 900,20 930,36 C960,52 980,28 1000,38 L1000,0 Z"
          fill="#0e6b3a"
        />
      </svg>
    </div>
  );
}
