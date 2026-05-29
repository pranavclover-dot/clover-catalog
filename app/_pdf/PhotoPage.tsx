/**
 * Gallery page — A4 portrait (794×1123px at 96dpi).
 */

interface PhotoPageProps {
  topPhoto: string;
  bottomPhoto?: string;
  pageNumber?: number;
}

function PhotoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        marginLeft: "28px",
        marginRight: "28px",
        flex: 1,
        borderRadius: "14px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

function EmptyCard() {
  return (
    <div
      style={{
        marginLeft: "28px",
        marginRight: "28px",
        flex: 1,
        borderRadius: "14px",
        backgroundColor: "#e8f0ea",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        flexShrink: 0,
      }}
    />
  );
}

export default function PhotoPage({ topPhoto, bottomPhoto, pageNumber }: PhotoPageProps) {
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
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
              PAGE
            </div>
            <div style={{ color: "white", fontSize: "22px", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {String(pageNumber).padStart(2, "0")}
            </div>
          </div>
        )}
      </div>

      {/* Accent rule */}
      <div style={{ height: "3px", backgroundColor: "#2ecc71", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", flexShrink: 0 }} />

      {/* ══ PHOTOS AREA — fills all remaining height, padding top+bottom ══ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          paddingTop: "20px",
          paddingBottom: "20px",
        }}
      >
        <PhotoCard src={topPhoto} alt="Product photo" />

        {/* Separator — thin rule with clover favicon */}
        <div
          style={{
            height: "44px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            padding: "0 44px",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#0e6b3a", opacity: 0.2 }} />
          <div style={{ padding: "0 14px", display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/clover-green.png" alt="" style={{ height: "20px", width: "auto", objectFit: "contain", display: "block" }} />
          </div>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#0e6b3a", opacity: 0.2 }} />
        </div>

        {bottomPhoto ? (
          <PhotoCard src={bottomPhoto} alt="Product photo" />
        ) : (
          <EmptyCard />
        )}
      </div>
    </div>
  );
}
