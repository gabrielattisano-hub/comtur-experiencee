"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RotaPage() {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  const [rotaUrl, setRotaUrl] = useState<string>("");

  useEffect(() => {
    if (origin && destination) {
      setRotaUrl(
        `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
          origin
        )}&destination=${encodeURIComponent(destination)}`
      );
    }
  }, [origin, destination]);

  if (!origin || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Origem ou destino não fornecidos.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🚗 Rota</h1>

      <a
        href={rotaUrl}
        target="_blank"
        rel="noreferrer"
        className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold"
      >
        Abrir rota no Google Maps
      </a>
    </div>
  );
}