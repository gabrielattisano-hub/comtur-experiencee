export const dynamic = "force-dynamic";

"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function MapaContent() {
  const searchParams = useSearchParams();

  const lat = useMemo(() => Number(searchParams.get("lat")), [searchParams]);
  const lng = useMemo(() => Number(searchParams.get("lng")), [searchParams]);
  const label = useMemo(
    () => searchParams.get("label") ?? "Mapa",
    [searchParams]
  );

  const ok = Number.isFinite(lat) && Number.isFinite(lng);

  if (!ok) {
    return (
      <main style={{ padding: 16 }}>
        <h1>Mapa</h1>
        <p>Faltou latitude/longitude na URL.</p>
        <p style={{ opacity: 0.7 }}>Esperado: ?lat=...&lng=...&label=...</p>
      </main>
    );
  }

  // Link normal (abre fora)
  const mapsLink =
    `https://www.google.com/maps/search/?api=1` +
    `&query=${lat},${lng}`;

  // Embed simples (tenta abrir "dentro" da página via iframe)
  // Obs: nem sempre iOS/Safari deixa 100% "app-like", mas funciona no navegador.
  const embedSrc =
    `https://www.google.com/maps?q=${lat},${lng}` +
    `&z=16&output=embed`;

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Mapa</h1>

      <p style={{ marginBottom: 12 }}>
        <strong>{label}</strong>
        <br />
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </p>

      <div
        style={{
          width: "100%",
          height: "70vh",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid #ddd",
          background: "#fff",
        }}
      >
        <iframe
          title="Google Maps"
          src={embedSrc}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Abrir no Google Maps (externo)
        </a>
      </div>
    </main>
  );
}

export default function MapaPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 16 }}>
          <h1>Mapa</h1>
          <p>Carregando…</p>
        </main>
      }
    >
      <MapaContent />
    </Suspense>
  );
}