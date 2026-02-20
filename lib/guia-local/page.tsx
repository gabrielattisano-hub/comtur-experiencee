"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";
import { LONDRINA_SPOTS } from "../../libs/londrina-lugares";

type Geo =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "ready"; lat: number; lng: number }
  | { status: "error"; message: string };

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function GuiaLocalPage() {
  const router = useRouter();
  const [geo, setGeo] = useState<Geo>({ status: "idle" });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeo({ status: "error", message: "Sem geolocalização." });
      return;
    }

    setGeo({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          status: "ready",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => setGeo({ status: "denied" }),
      { enableHighAccuracy: true }
    );
  }, []);

  const spotsOrdenados = useMemo(() => {
    if (geo.status !== "ready") return LONDRINA_SPOTS;

    return [...LONDRINA_SPOTS]
      .map((spot) => ({
        ...spot,
        distancia: haversineKm(
          geo.lat,
          geo.lng,
          spot.lat,
          spot.lng
        ),
      }))
      .sort((a, b) => a.distancia - b.distancia);
  }, [geo]);

  return (
    <div className="min-h-screen">
      <Topbar title="Guia Local COMTUR" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <div className="text-xl font-semibold text-white">
            Descubra Londrina
          </div>
          <div className="text-sm text-white/70 mt-1">
            História, curiosidades e dicas rápidas perto de você.
          </div>
        </div>

        {geo.status === "denied" && (
          <div className="text-red-200 text-sm">
            Permita a localização para ordenar por proximidade.
          </div>
        )}

        {spotsOrdenados.map((spot: any) => (
          <div
            key={spot.id}
            className="p-5 rounded-2xl bg-white/10 border border-white/20 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="text-lg font-semibold text-white">
                {spot.nome}
              </div>
              {spot.distancia && (
                <div className="text-sm text-white/60">
                  📍 {spot.distancia.toFixed(2)} km
                </div>
              )}
            </div>

            <div className="text-white/80 text-sm">
              {spot.historiaCurta}
            </div>

            <div className="space-y-1">
              {spot.curiosidades.map((c: string, i: number) => (
                <div key={i} className="text-xs text-white/60">
                  • {c}
                </div>
              ))}
            </div>

            <div className="text-xs text-emerald-300">
              💡 Dica família: {spot.dicaFamilia}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}