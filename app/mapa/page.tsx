"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MapaPage() {
  const searchParams = useSearchParams();

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const [mapUrl, setMapUrl] = useState<string>("");

  useEffect(() => {
    if (lat && lng) {
      setMapUrl(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      );
    }
  }, [lat, lng]);

  if (!lat || !lng) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Coordenadas não fornecidas.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🗺️ Mapa</h1>

      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold"
      >
        Abrir no Google Maps
      </a>
    </div>
  );
}