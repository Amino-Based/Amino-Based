"use client";

import { useState } from "react";

const trashIdFromUrl = () => window.location.pathname.match(/\/collections\/trash\/([^/?#]+)/)?.[1] ?? null;

/** Restores the deleted record this trash entry holds, then opens it. */
export default function TrashRestoreButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function restore() {
    const id = trashIdFromUrl();
    if (!id) return;
    if (!window.confirm("Restore this record? It will be recreated and removed from the trash.")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/trash/${id}/restore`, { method: "POST", credentials: "same-origin" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Could not restore this record.");
      window.location.href = `/pb-console/collections/${body.collection}/${body.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <button
        type="button"
        onClick={restore}
        disabled={busy}
        style={{
          padding: "10px 18px",
          border: 0,
          borderRadius: 4,
          background: "#4f46e5",
          color: "#fff",
          fontWeight: 700,
          cursor: busy ? "wait" : "pointer",
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? "Restoring…" : "Restore this record"}
      </button>
      {error && <p style={{ margin: "8px 0 0", fontSize: 13, color: "#ef4444" }}>{error}</p>}
    </div>
  );
}
