"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Topbar from "../../components/Topbar";

export default function MapaPage() {
  const router = useRouter();
  const params = useSearchParams();

  const qLat = params.get("lat");
  const qLng = params.get("lng");
  const qName = params.get("name");

  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);

  // Se vier por query (?lat=&lng=), usa. Senão tenta pegar do navegador.
  useEffect(() => {
    const lat = qLat ? Number(qLat) : NaN;
    const lng = qLng ? Number(qLng) : NaN;

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setGeo({ lat, lng });
      return;
    }

    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        // Se negou, fica sem geo
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, [qLat, qLng]);

  const embedUrl = useMemo(() => {
    if (!geo) return "";
    // Mapa EMBUTIDO (fica dentro do app)
    return `https://www.google.com/maps?q=${geo.lat},${geo.lng}&z=15&output=embed`;
  }, [geo]);

  return (
    <div className="min-h-screen">
      <Topbar title={qName ? `Mapa: ${qName}` : "Mapa (no app)"} onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {!geo && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Obtendo localização para abrir o mapa...
          </div>
        )}

        {geo && (
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/5">
            <iframe
              title="Mapa"
              src={embedUrl}
              className="w-full h-[70vh]"
              loading="lazy"
            />
          </div>
        )}

        {geo && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-sm text-white/80">
            Dica: esse mapa está **dentro do app** (embed).  
            Próximo upgrade: colocar pins dos restaurantes aqui.
          </div>
        )}
      </main>
    </div>
  );
}