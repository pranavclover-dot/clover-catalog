"use client";

import { useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

interface Entry {
  id: string;
  category: string;
  product_code: string;
  product_type: string;
  file_url: string;
  createdAt: string;
}

export default function CatalogPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [copiedCat, setCopiedCat] = useState<string | null>(null);

  useEffect(() => {
    // Read ?category= from URL on load
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setActiveCategory(cat);

    fetch("/api/catalog/list")
      .then((r) => r.json())
      .then(({ entries }) => {
        setEntries(entries ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(entries.map((e) => e.category))).sort()];

  const visible =
    activeCategory === "All"
      ? entries
      : entries.filter((e) => e.category === activeCategory);

  const copyLink = (cat: string) => {
    const url = cat === "All"
      ? window.location.origin + "/catalog"
      : `${window.location.origin}/catalog?category=${encodeURIComponent(cat)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedCat(cat);
      setTimeout(() => setCopiedCat(null), 2000);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f5f0", fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <header style={{ backgroundColor: "#0e6b3a", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clover-logo.png" alt="Clover" style={{ height: "36px", width: "auto" }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", letterSpacing: "0.08em" }}>
          PRODUCT CATALOG
        </div>
      </header>

      {/* Accent bar */}
      <div style={{ height: "3px", backgroundColor: "#2ecc71" }} />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#0a0a0a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
            Catalog Library
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
            {BRAND.companyName} · {entries.length} catalog{entries.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const isCopied = copiedCat === cat;
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "100px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    backgroundColor: isActive ? "#0e6b3a" : "white",
                    color: isActive ? "white" : "#444",
                    boxShadow: isActive ? "none" : "0 1px 4px rgba(0,0,0,0.08)",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
                {/* Copy link icon */}
                <button
                  onClick={() => copyLink(cat)}
                  title={`Copy link for ${cat}`}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: isCopied ? "#0e6b3a" : "white",
                    color: isCopied ? "white" : "#888",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                >
                  {isCopied ? "✓" : "🔗"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#0e6b3a" }}>
            <div style={{ width: "40px", height: "40px", border: "3px solid #0e6b3a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ margin: 0, fontSize: "14px" }}>Loading catalogs…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Empty */}
        {!loading && visible.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#aaa" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📂</div>
            <p style={{ margin: 0, fontSize: "15px" }}>No catalogs yet in this category.</p>
          </div>
        )}

        {/* Grid */}
        {!loading && visible.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
            {visible.map((entry) => (
              <a
                key={entry.id}
                href={entry.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "white",
                    borderRadius: "14px",
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)";
                  }}
                >
                  {/* PDF icon area */}
                  <div style={{ backgroundColor: "#f0f7f3", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg viewBox="0 0 24 24" fill="none" width="48" height="48">
                      <rect x="4" y="2" width="12" height="16" rx="2" fill="#0e6b3a" opacity="0.15" />
                      <rect x="4" y="2" width="12" height="16" rx="2" stroke="#0e6b3a" strokeWidth="1.5" />
                      <path d="M8 6h6M8 9h6M8 12h4" stroke="#0e6b3a" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M14 2l4 4h-4V2z" fill="#0e6b3a" opacity="0.5" />
                      <path d="M14 2v4h4" stroke="#0e6b3a" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "14px 16px 16px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#0e6b3a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>
                      {entry.category}
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "#111", letterSpacing: "-0.01em", marginBottom: "2px" }}>
                      {entry.product_code}
                    </div>
                    {entry.product_type && (
                      <div style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>
                        {entry.product_type}
                      </div>
                    )}
                    <div style={{ fontSize: "11px", color: "#bbb" }}>
                      {new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>

                    {/* Download button */}
                    <div style={{ marginTop: "12px", backgroundColor: "#0e6b3a", color: "white", borderRadius: "8px", padding: "9px", textAlign: "center", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em" }}>
                      View / Download PDF
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
