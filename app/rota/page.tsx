export const dynamic = "force-dynamic";

"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function RotaContent() {
  const searchParams = useSearchParams();

  const origemLat = useMemo(
    () => Number(searchParams.get("origemLat")),
    [searchParams]
  );
  const origemLng = useMemo(
    () => Number(searchParams.get("origemLng")),
    [searchParams]
  );
  const destinoLat = useMemo(
    () => Number(searchParams.get("destinoLat")),
    [searchParams]
  );
  const destinoLng = useMemo(
    () => Number(searchParams.get("destinoLng")),
    [searchParams]
  );

  const label = useMemo(
    () => searchParams.get("label") ?? "Rota",
    [searchParams]
  );

  // Se não tiver coords, mostra mensagem
  const okOrigem = Number.isFinite(origemLat) && Number.isFinite(origemLng);
  const okDestino = Number.isFinite(destinoLat) && Number.isFinite(destinoLng);

  if (!okOrigem || !okDestino) {
    return (
      <main style={{ padding: 16 }}>
        <h1>Rota</h1>
        <p>Faltou origem/destino na URL.</p>
        <p style={{ opacity: 0.7 }}>
          Esperado: origemLat, origemLng, destinoLat, destinoLng
        </p>
      </main>
    );
  }

  // Direção no Google Maps
  const mapsDirectionsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${origemLat},${origemLng}` +
    `&destination=${destinoLat},${destinoLng}` +
    `&travelmode=driving`;

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Rota</h1>
      <p style={{ marginBottom: 12 }}>
        <strong>{label}</strong>
        <br />
        Origem: {origemLat.toFixed(6)}, {origemLng.toFixed(6)}
        <br />
        Destino: {destinoLat.toFixed(6)}, {destinoLng.toFixed(6)}
      </p>

      <a
        href={mapsDirectionsUrl}
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
        Abrir rota no Google Maps
      </a>
    </main>
  );
}

export default function RotaPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 16 }}>
          <h1>Rota</h1>
          <p>Carregando…</p>
        </main>
      }
    >
      <RotaContent />
    </Suspense>
  );
}