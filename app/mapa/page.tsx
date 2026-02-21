"use client";

import { useEffect, useState } from "react";

export default function MapaPage() {
  const [query, setQuery] = useState("Londrina PR");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");

    if (lat && lng) {
      setQuery(`${lat},${lng}`);
    }
  }, []);

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