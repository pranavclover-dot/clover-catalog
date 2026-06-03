/**
 * Gallery page — A4 portrait (794×1123px at 96dpi).
 * Single mode: explicit pixel dimensions to avoid html2canvas objectFit issues.
 * Dual mode: both photos fit, cropped with objectFit cover.
 */

interface PhotoPageProps {
  topPhoto: string;
  topWidth?: number;
  topHeight?: number;
  bottomPhoto?: string;
  pageNumber?: number;
}

// Available area for single-photo mode
const AVAIL_W = 738; // 794 - 28px margin each side
const AVAIL_H = 1008; // 1123 - 64 header - 3 accent - 24 pad top - 24 pad bottom

export default function PhotoPage({ topPhoto, topWidth, topHeight, bottomPhoto, pageNumber }: PhotoPageProps) {
  const isSingle = !bottomPhoto;

  // Compute explicit pixel dimensions for single photo (prevents html2canvas stretch)
  let displayW = AVAIL_W;
  let displayH = AVAIL_H;
  if (isSingle && topWidth && topHeight) {
    const scale = Math.min(AVAIL_W / topWidth, AVAIL_H / topHeight);
    displayW = Math.round(topWidth * scale);
    displayH = Math.round(topHeight * scale);
  }

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
      {/* ══ HEADER ══ */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clover-logo.png" alt="Clover" style={{ height: "38px", width: "auto", objectFit: "contain" }} />
          <div style={{ width: "1px", height: "28px", backgroundColor: "rgba(255,255,255,0.2)" }} />
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700 }}>
            PRODUCT GALLERY
          </div>
        </div>
        {pageNumber !== undefined && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>PAGE</div>
            <div style={{ color: "white", fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {String(pageNumber).padStart(2, "0")}
            </div>
          </div>
        )}
      </div>

      {/* Accent rule */}
      <div style={{ height: "3px", backgroundColor: "#2ecc71", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", flexShrink: 0 }} />

      {/* ══ PHOTOS AREA ══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: "24px 28px",
        }}
      >
        {isSingle ? (

          /* ── SINGLE PHOTO — explicit pixel dimensions, centered ── */
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
            borderRadius: "14px",
            overflow: "hidden",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={topPhoto}
              alt="Product photo"
              style={{
                width: `${displayW}px`,
                height: `${displayH}px`,
                display: "block",
              }}
            />
          </div>

        ) : (

          /* ── TWO PHOTOS — stacked with separator ── */
          <>
            <div style={{
              flex: 1,
              borderRadius: "14px",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={topPhoto} alt="Product photo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>

            {/* Separator */}
            <div style={{ height: "44px", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 16px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#0e6b3a", opacity: 0.2 }} />
              <div style={{ padding: "0 14px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/clover-green.png" alt="" style={{ height: "20px", width: "auto", objectFit: "contain", display: "block" }} />
              </div>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#0e6b3a", opacity: 0.2 }} />
            </div>

            <div style={{
              flex: 1,
              borderRadius: "14px",
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bottomPhoto} alt="Product photo" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
