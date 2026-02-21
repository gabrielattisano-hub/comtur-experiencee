"use client";

import { useSearchParams } from "next/navigation";

export default function MapaClient() {
  const searchParams = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const query = lat && lng ? `${lat},${lng}` : "Londrina PR";

  const src = `https://www.google.com/maps?q=${encodeURIComponent(
    query
  )}&output=embed`;

  return (
    <main style={{ padding: 16 }}>
      <h1>Mapa</h1>

      <div style={{ height: "70vh", borderRadius: 12, overflow: "hidden" }}>
        <iframe
          title="Mapa"
          src={src}
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: 0 }}
        />
      </div>
    </main>
  );
}