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
  bottomWidth?: number;
  bottomHeight?: number;
  pageNumber?: number;
}

// Available area (794px page, 28px padding each side, 64px header, 3px accent, 48px padding top+bottom)
const AVAIL_W = 738;
const AVAIL_H = 1008;
// Each dual-photo slot: (AVAIL_H - 44px separator) / 2
const DUAL_H = Math.floor((AVAIL_H - 44) / 2); // 482px

function fitDimensions(srcW: number | undefined, srcH: number | undefined, boxW: number, boxH: number) {
  if (!srcW || !srcH) return { w: boxW, h: boxH };
  const scale = Math.min(boxW / srcW, boxH / srcH);
  return { w: Math.round(srcW * scale), h: Math.round(srcH * scale) };
}

export default function PhotoPage({ topPhoto, topWidth, topHeight, bottomPhoto, bottomWidth, bottomHeight, pageNumber }: PhotoPageProps) {
  const isSingle = !bottomPhoto;

  // Single mode — fit within full available area
  const single = fitDimensions(topWidth, topHeight, AVAIL_W, AVAIL_H);

  // Dual mode — fit each photo within its slot
  const dualTop = fitDimensions(topWidth, topHeight, AVAIL_W, DUAL_H);
  const dualBot = fitDimensions(bottomWidth, bottomHeight, AVAIL_W, DUAL_H);

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
              style={{ width: `${single.w}px`, height: `${single.h}px`, display: "block" }}
            />
          </div>

        ) : (

          /* ── TWO PHOTOS — explicit pixel dimensions (no objectFit, html2canvas compat) ── */
          <>
            <div style={{
              height: `${DUAL_H}px`,
              flexShrink: 0,
              borderRadius: "14px",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={topPhoto} alt="Product photo" style={{ width: `${dualTop.w}px`, height: `${dualTop.h}px`, display: "block" }} />
            </div>

            {/* Separator */}
            <div style={{ height: "44px", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 16px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#0e6b3a", opacity: 0.2 }} />
              <div style={{ padding: "0 14px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/clover-green.png" alt="" style={{ height: "20px", width: "auto", display: "block" }} />
              </div>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#0e6b3a", opacity: 0.2 }} />
            </div>

            <div style={{
              height: `${DUAL_H}px`,
              flexShrink: 0,
              borderRadius: "14px",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bottomPhoto} alt="Product photo" style={{ width: `${dualBot.w}px`, height: `${dualBot.h}px`, display: "block" }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
