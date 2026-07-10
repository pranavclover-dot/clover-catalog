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
  const [verifying, setVerifying] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const r = await fetch("/api/catalog/list", { cache: "no-store" });
    const { entries } = await r.json();
    setEntries(entries ?? []);
    setSelected(new Set());
    setLoading(false);
  };

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    const filteredIds = filtered.map((e) => e.id);
    const allFilteredSelected = filteredIds.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) filteredIds.forEach((id) => next.delete(id));
      else filteredIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const deleteOne = async (entry: Entry): Promise<boolean> => {
    const r = await fetch("/api/catalog/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: entry.file_url, key: key.trim() }),
    });
    return r.ok;
  };

  const handleDelete = async (entry: Entry) => {
    if (!confirm(`Delete "${entry.product_code}"? This cannot be undone.`)) return;
    setDeleting(entry.id);
    try {
      const ok = await deleteOne(entry);
      if (!ok) alert("Error: Failed to delete");
      else setEntries((prev) => prev.filter((e) => e.id !== entry.id));
    } finally {
      setDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    const count = selected.size;
    if (!count) return;
    if (!confirm(`Delete ${count} selected catalog${count > 1 ? "s" : ""}? This cannot be undone.`)) return;
    setBulkDeleting(true);
    const toDelete = entries.filter((e) => selected.has(e.id));
    const results = await Promise.allSettled(toDelete.map(deleteOne));
    const failed = results.filter((r) => r.status === "rejected" || (r.status === "fulfilled" && !r.value)).length;
    const deletedIds = new Set(toDelete.filter((_, i) => results[i].status === "fulfilled" && (results[i] as PromiseFulfilledResult<boolean>).value).map((e) => e.id));
    setEntries((prev) => prev.filter((e) => !deletedIds.has(e.id)));
    setSelected(new Set());
    setBulkDeleting(false);
    if (failed > 0) alert(`${failed} item(s) failed to delete.`);
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
              if (e.key === "Enter") (e.currentTarget.nextElementSibling as HTMLButtonElement)?.click();
            }}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }}
          />
          <button
            onClick={async () => {
              if (!key.trim()) { setError("Please enter a key."); return; }
              setVerifying(true);
              setError("");
              try {
                const r = await fetch("/api/catalog/delete", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ key: key.trim() }),
                });
                if (r.status === 401) { setError("Wrong admin key. Try again."); }
                else { setAuthed(true); setError(""); }
              } catch {
                setError("Network error. Try again.");
              } finally {
                setVerifying(false);
              }
            }}
            disabled={verifying}
            style={{ width: "100%", padding: "11px", backgroundColor: "#0e6b3a", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: verifying ? "not-allowed" : "pointer", opacity: verifying ? 0.7 : 1 }}
          >
            {verifying ? "Checking…" : "Enter"}
          </button>
        </div>
      </div>
    );
  }

  const q = search.trim().toLowerCase();
  const filtered = entries
    .filter((e) =>
      !q ||
      e.product_code.toLowerCase().includes(q) ||
      e.product_type.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    )
    .sort((a, b) => a.product_code.localeCompare(b.product_code));

  const allSelected = filtered.length > 0 && filtered.every((e) => selected.has(e.id));
  const someSelected = selected.size > 0;

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

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 900, color: "#0a0a0a", margin: 0 }}>
            Delete Catalogs
          </h1>
          <span style={{ fontSize: "13px", color: "#888" }}>
            {q ? `${filtered.length} of ${entries.length}` : `${entries.length} total`}
          </span>
        </div>

        {/* Search bar */}
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by product code, type or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "11px 40px 11px 40px",
              borderRadius: "10px", border: "1.5px solid #e0e0e0",
              fontSize: "14px", outline: "none", background: "white",
              boxSizing: "border-box", color: "#111",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "16px", lineHeight: 1 }}>
              ×
            </button>
          )}
        </div>

        {/* Bulk action bar — only shown when items are selected */}
        {someSelected && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fff8f8", border: "1.5px solid #fcc", borderRadius: "12px",
            padding: "12px 20px", marginBottom: "16px",
          }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#e53e3e" }}>
              {selected.size} selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              style={{
                padding: "8px 20px", backgroundColor: bulkDeleting ? "#fcc" : "#e53e3e",
                color: "white", border: "none", borderRadius: "8px",
                fontSize: "13px", fontWeight: 700,
                cursor: bulkDeleting ? "not-allowed" : "pointer",
                opacity: bulkDeleting ? 0.7 : 1,
              }}
            >
              {bulkDeleting ? "Deleting…" : `Delete ${selected.size}`}
            </button>
          </div>
        )}

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

        {!loading && entries.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#aaa" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔍</div>
            <p style={{ margin: 0 }}>No results for &ldquo;{search}&rdquo;</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            {/* Select all row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", padding: "0 4px" }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#0e6b3a" }}
              />
              <span style={{ fontSize: "12px", color: "#888", fontWeight: 600 }}>
                {allSelected ? "Deselect all" : "Select all"}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filtered.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => toggleSelect(entry.id)}
                  style={{
                    background: selected.has(entry.id) ? "#fff8f8" : "white",
                    borderRadius: "12px", padding: "16px 20px",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                    display: "flex", alignItems: "center", gap: "16px",
                    border: selected.has(entry.id) ? "1.5px solid #fca5a5" : "1.5px solid transparent",
                    cursor: "pointer", transition: "all 0.12s",
                  }}
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selected.has(entry.id)}
                    onChange={() => toggleSelect(entry.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: "16px", height: "16px", flexShrink: 0, cursor: "pointer", accentColor: "#e53e3e" }}
                  />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
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
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: "12px", color: "#0e6b3a", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}
                  >
                    View PDF
                  </a>

                  {/* Delete button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(entry); }}
                    disabled={deleting === entry.id || bulkDeleting}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: deleting === entry.id ? "#fcc" : "#fff0f0",
                      color: "#e53e3e",
                      border: "1.5px solid #fcc",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: (deleting === entry.id || bulkDeleting) ? "not-allowed" : "pointer",
                      flexShrink: 0,
                      transition: "all 0.15s",
                    }}
                  >
                    {deleting === entry.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
