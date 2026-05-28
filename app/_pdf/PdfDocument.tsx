/**
 * PdfDocument — composes Cover + N PhotoPages + ContactPage into a single
 * scrollable HTML document that Puppeteer will print to PDF.
 *
 * Each child is wrapped in a page-break container so Puppeteer's
 * print-to-PDF produces clean A4 pages.
 */
import Cover from "./Cover";
import PhotoPage from "./PhotoPage";
import ContactPage from "./ContactPage";

export interface PdfDocumentProps {
  category: string;
  productCode: string;
  description: string;
  /** Array of base64 data URIs for product photos */
  photoDataUris: string[];
  /** base64 data URI for the lifestyle photo (cover + contact) */
  lifestylePhotoUri: string;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "794px",
        height: "1123px",
        overflow: "hidden",
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {children}
    </div>
  );
}

export default function PdfDocument({
  category,
  productCode,
  description,
  photoDataUris,
  lifestylePhotoUri,
}: PdfDocumentProps) {
  // Pair up photos: [[p1,p2], [p3,p4], ...]
  const pairs: [string, string | undefined][] = [];
  for (let i = 0; i < photoDataUris.length; i += 2) {
    pairs.push([photoDataUris[i], photoDataUris[i + 1]]);
  }

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      {/* Cover */}
      <PageWrapper>
        <Cover
          category={category}
          productCode={productCode}
          description={description}
          lifestylePhotoSrc={lifestylePhotoUri}
        />
      </PageWrapper>

      {/* Gallery pages */}
      {pairs.map(([top, bottom], idx) => (
        <PageWrapper key={idx}>
          <PhotoPage
            topPhoto={top}
            bottomPhoto={bottom}
            pageNumber={idx + 2}
          />
        </PageWrapper>
      ))}

      {/* Contact */}
      <PageWrapper>
        <ContactPage lifestylePhotoSrc={lifestylePhotoUri} />
      </PageWrapper>
    </div>
  );
}
