/**
 * Cover page — A4 portrait (794×1123px at 96dpi)
 * Layout: Header → category (above logo) → logo → product code → type → contact details → footer
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
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        backgroundColor: "#ffffff",
      }}
    >

      {/* ── TILED BCK BACKGROUND at low opacity ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url(/bck.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "160px 160px",
        opacity: 0.15,
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        zIndex: 1,
      }} />

      {/* ── GREEN HEADER BAR ── */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "64px",
        backgroundColor: "#0e6b3a",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        display: "flex",
        alignItems: "center",
        padding: "0 44px",
        zIndex: 10,
        gap: "16px",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/clover-logo.png" alt="Clover" style={{ height: "38px", width: "auto" }} />
        <div style={{ width: "1px", height: "28px", backgroundColor: "rgba(255,255,255,0.2)" }} />
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700 }}>
          PRODUCT CATALOG
        </div>
      </div>

      {/* Accent rule */}
      <div style={{
        position: "absolute",
        top: "64px", left: 0, right: 0,
        height: "3px",
        backgroundColor: "#2ecc71",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        zIndex: 10,
      }} />

      {/* ── PRODUCT CATEGORY — above logo ── */}
      <div style={{
        position: "absolute",
        top: "148px",
        left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 10,
      }}>
        <div style={{
          fontSize: "26px",
          fontWeight: 800,
          color: "#0e6b3a",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}>
          {category}
        </div>
        <div style={{
          marginTop: "10px",
          width: "40px", height: "2px",
          backgroundColor: "#0e6b3a",
          borderRadius: "1px",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }} />
      </div>

      {/* ── LOGO — centered, slightly above middle ── */}
      <div style={{
        position: "absolute",
        top: "272px",
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 10,
      }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            position: "absolute",
            width: "420px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0) 72%)",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-black.png"
            alt="Clover"
            style={{ height: "200px", width: "auto", display: "block", position: "relative", zIndex: 1 }}
          />
        </div>
      </div>

      {/* ── PRODUCT CODE + TYPE + CONTACT — centered below logo ── */}
      <div style={{
        position: "absolute",
        top: "540px",
        left: "80px",
        right: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        zIndex: 10,
      }}>

        {/* Product Code */}
        <div style={{
          fontSize: "72px",
          fontWeight: 900,
          color: "#0a1a0a",
          letterSpacing: "-0.02em",
          lineHeight: 1,
          textTransform: "uppercase",
          marginBottom: "14px",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}>
          {productCode}
        </div>

        {/* Product Type */}
        {productType && (
          <div style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "#2a5a2a",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}>
            {productType}
          </div>
        )}

        {/* Divider */}
        <div style={{
          width: "40px", height: "2px",
          backgroundColor: "#0e6b3a",
          borderRadius: "1px",
          opacity: 0.35,
          marginBottom: "28px",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }} />

        {/* Contact details — text only, centered */}
        <a href={`tel:+919560080424`} style={{ textDecoration: "none", marginBottom: "14px", display: "block" }}>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#0e6b3a", letterSpacing: "0.04em" }}>
            {BRAND.phone}
          </div>
        </a>
        <a href={`mailto:${BRAND.email}`} style={{ textDecoration: "none", marginBottom: "14px", display: "block" }}>
          <div style={{ fontSize: "19px", fontWeight: 500, color: "#1a1a1a", letterSpacing: "0.02em" }}>
            {BRAND.email}
          </div>
        </a>
        <a href={`https://${BRAND.website}`} style={{ textDecoration: "none", marginBottom: "14px", display: "block" }}>
          <div style={{ fontSize: "19px", fontWeight: 500, color: "#1a1a1a", letterSpacing: "0.02em" }}>
            {BRAND.website}
          </div>
        </a>
        <a href="https://share.google/P1bvtwyxU3HO2GR2I" style={{ textDecoration: "none", display: "block" }}>
          <div style={{ fontSize: "17px", fontWeight: 400, color: "#0a0a0a", letterSpacing: "0.02em", lineHeight: 1.5 }}>
            {BRAND.address.line1} {BRAND.address.line2}, {BRAND.address.line3}
          </div>
        </a>
      </div>

      {/* ── GREEN FOOTER BAR ── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "36px",
        backgroundColor: "#0e6b3a",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        padding: "0 44px",
        justifyContent: "space-between",
      }}>
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
