"use client";

import { useEffect, useState } from "react";

interface Entry {
  id: string;
  category: string;
  product_code: string;
  product_type: string;
  file_url: string;
  createdAt: string;
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/catalog/list");
    const { entries } = await r.json();
    setEntries(entries ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const handleDelete = async (entry: Entry) => {
    if (!confirm(`Delete "${entry.product_code}"? This cannot be undone.`)) return;
    setDeleting(entry.id);
    try {
      const r = await fetch("/api/catalog/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: entry.file_url, key }),
      });
      if (!r.ok) {
        const d = await r.json();
        alert("Error: " + (d.error ?? "Failed"));
      } else {
        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
      }
    } finally {
      setDeleting(null);
    }
  };

  /* ── Login screen ── */
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f5f0", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: "40px", width: "320px", boxShadow: "0 4px 24px rgba(0,0,0,0.10)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clover-logo-green.png" alt="Clover" style={{ height: "32px", marginBottom: "24px" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px", color: "#111" }}>Admin Access</h2>
          <p style={{ fontSize: "13px", color: "#888", margin: "0 0 24px" }}>Enter your admin key to manage catalogs.</p>
          {error && <p style={{ color: "#e53e3e", fontSize: "13px", marginBottom: "12px" }}>{error}</p>}
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (key.trim()) { setAuthed(true); setError(""); }
                else setError("Please enter a key.");
              }
            }}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }}
          />
          <button
            onClick={() => {
              if (key.trim()) { setAuthed(true); setError(""); }
              else setError("Please enter a key.");
            }}
            style={{ width: "100%", padding: "11px", backgroundColor: "#0e6b3a", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  /* ── Admin panel ── */
  return (
    <div style={{ minHeight: "100vh", background: "#f8f5f0", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ backgroundColor: "#0e6b3a", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/clover-logo.png" alt="Clover" style={{ height: "36px", width: "auto" }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", letterSpacing: "0.08em" }}>
          ADMIN · MANAGE CATALOGS
        </div>
      </header>
      <div style={{ height: "3px", backgroundColor: "#e53e3e" }} />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0a0a0a", margin: 0 }}>
            Delete Catalogs
          </h1>
          <span style={{ fontSize: "13px", color: "#888" }}>{entries.length} total</span>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#0e6b3a" }}>
            <div style={{ width: "36px", height: "36px", border: "3px solid #0e6b3a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>📂</div>
            <p style={{ margin: 0 }}>No catalogs found.</p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {entries.map((entry) => (
              <div
                key={entry.id}
                style={{ background: "white", borderRadius: "12px", padding: "16px 20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: "16px" }}
              >
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#0e6b3a", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>
                    {entry.category}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 800, color: "#111", marginBottom: "1px" }}>
                    {entry.product_code}
                  </div>
                  {entry.product_type && (
                    <div style={{ fontSize: "12px", color: "#888" }}>{entry.product_type}</div>
                  )}
                  <div style={{ fontSize: "11px", color: "#bbb", marginTop: "4px" }}>
                    {new Date(entry.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>

                {/* View link */}
                <a
                  href={entry.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "#0e6b3a", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}
                >
                  View PDF
                </a>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(entry)}
                  disabled={deleting === entry.id}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: deleting === entry.id ? "#fcc" : "#fff0f0",
                    color: "#e53e3e",
                    border: "1.5px solid #fcc",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: deleting === entry.id ? "not-allowed" : "pointer",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {deleting === entry.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
