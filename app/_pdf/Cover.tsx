/**
 * Cover page — A4 portrait (794×1123px at 96dpi)
 * Background: cover-page.jpg (furniture icon pattern with green accents)
 * Text sequence: logo → category → product code → product type → contact details
 * Dark text colors for readability on the light patterned background.
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
        backgroundColor: "#f5f5f0",
      }}
    >
      {/* ── FULL-BLEED BACKGROUND IMAGE ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cover-page.jpg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "794px",
          height: "1123px",
          display: "block",
        }}
      />

      {/* ── LOGO — centered in upper half ── */}
      <div style={{
        position: "absolute",
        top: "200px",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 10,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/clover-logo.png"
          alt="Clover"
          style={{ height: "110px", width: "auto", display: "block" }}
        />
      </div>

      {/* ── TEXT BLOCK — right-aligned, lower center ── */}
      <div style={{
        position: "absolute",
        top: "560px",
        left: "44px",
        right: "60px",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        textAlign: "right",
      }}>

        {/* Product Category */}
        <div style={{
          fontSize: "22px",
          fontWeight: 700,
          color: "#0e6b3a",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginBottom: "14px",
        }}>
          {category}
        </div>

        {/* Accent rule */}
        <div style={{
          width: "60px",
          height: "3px",
          backgroundColor: "#0e6b3a",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          marginBottom: "16px",
        }} />

        {/* PRODUCT CODE — hero */}
        <div style={{
          fontSize: "72px",
          fontWeight: 900,
          color: "#0a1a0a",
          letterSpacing: "-0.02em",
          lineHeight: 0.95,
          textTransform: "uppercase",
          marginBottom: "20px",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}>
          {productCode}
        </div>

        {/* Product Type (e.g. 100% Cotton) */}
        {productType && (
          <div style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#2a4a2a",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}>
            {productType}
          </div>
        )}

        {/* Contact details */}
        <div style={{
          fontSize: "13px",
          color: "#3a4a3a",
          letterSpacing: "0.03em",
          lineHeight: 1.9,
          textAlign: "right",
        }}>
          <div style={{ fontWeight: 700, color: "#0e6b3a", marginBottom: "2px" }}>{BRAND.companyName}</div>
          <div>{BRAND.address.line1}</div>
          <div>{BRAND.address.line2}, {BRAND.address.line3}</div>
          <div style={{ marginTop: "6px" }}>{BRAND.phone}</div>
          <div>{BRAND.email}</div>
          <div>{BRAND.website}</div>
        </div>
      </div>
    </div>
  );
}
