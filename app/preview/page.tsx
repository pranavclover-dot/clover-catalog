/**
 * /preview — browser-visible A4 page preview for design iteration.
 *
 * Shows Cover → PhotoPage (sample 2 photos) → ContactPage
 * at actual A4 pixel dimensions (794×1123) so you can compare
 * directly against the reference PDF.
 *
 * Uses placeholder green rectangles for photos so it works with no uploads.
 */
import Cover from "@/app/_pdf/Cover";
import PhotoPage from "@/app/_pdf/PhotoPage";
import ContactPage from "@/app/_pdf/ContactPage";
import { CATEGORIES } from "@/lib/categories";

// Use real product images from public/
const GREEN_PH = "/Bedsheet.png";
const GREEN_PH2 = "/Online Bedsheets.png";

// Use the Bedsheets product photo as the cover background (matching the sample category)
const LIFESTYLE_PH = "/Bedsheet.png";

export default function PreviewPage() {
  const sampleDescription = CATEGORIES["Bedsheets"];

  return (
    <div style={{ background: "#888", padding: "24px", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
      <p style={{ color: "white", fontFamily: "sans-serif", fontSize: "13px", background: "rgba(0,0,0,0.4)", padding: "8px 16px", borderRadius: "6px" }}>
        Preview mode — each white block below is one A4 page (794×1123px). Compare against the reference PDF.
      </p>

      {/* Cover */}
      <div style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
        <Cover
          category="Bedsheets"
          productCode="BS 1 EECO"
          productType=""
          lifestylePhotoSrc={LIFESTYLE_PH}
        />
      </div>

      {/* Gallery page — 2 photos */}
      <div style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
        <PhotoPage topPhoto={GREEN_PH} bottomPhoto={GREEN_PH2} pageNumber={2} />
      </div>

      {/* Contact */}
      <div style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
        <ContactPage lifestylePhotoSrc={LIFESTYLE_PH} />
      </div>
    </div>
  );
}
