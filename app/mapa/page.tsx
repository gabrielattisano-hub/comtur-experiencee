export const dynamic = "force-dynamic";

"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function MapaContent() {
  const searchParams = useSearchParams();

  const lat = useMemo(() => Number(searchParams.get("lat")), [searchParams]);
  const lng = useMemo(() => Number(searchParams.get("lng")), [searchParams]);
  const label = useMemo(
    () => searchParams.get("label") ?? "Local",
    [searchParams]
  );

  // Se não vier lat/lng, mostra mensagem simples
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return (
      <main style={{ padding: 16 }}>
        <h1>Mapa</h1>
        <p>Faltou latitude e longitude na URL.</p>
      </main>
    );
  }

  // Abre o Google Maps no navegador (sem app externo obrigatório)
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Mapa</h1>
      <p style={{ marginBottom: 12 }}>
        <strong>{label}</strong>
        <br />
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </p>

      <a
        href={mapsUrl}
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
        Abrir no Google Maps
      </a>
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