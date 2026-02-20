"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";

type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ready"; lat: number; lng: number; accuracy?: number; at: string };

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
  lat?: number;
  lng?: number;
  maps_url?: string;
  photo_url?: string;
};

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

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "bad" | "info";
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-400/15 text-emerald-200 border-emerald-400/30"
      : tone === "bad"
      ? "bg-red-400/15 text-red-200 border-red-400/30"
      : tone === "info"
      ? "bg-blue-400/15 text-blue-200 border-blue-400/30"
      : "bg-white/10 text-white/80 border-white/20";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${cls}`}>
      {children}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/10 border border-white/15 shadow-xl">
      <div className="w-full h-44 bg-white/10 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-white/10 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-10 bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ExplorarPage() {
  const router = useRouter();
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const [placesRaw, setPlacesRaw] = useState<Place[]>([]);
  const [placesStatus, setPlacesStatus] = useState<
    "idle" | "loading" | "error" | "ready"
  >("idle");
  const [placesError, setPlacesError] = useState<string>("");

  async function pegarLocalizacao() {
    if (!("geolocation" in navigator)) {
      setGeo({
        status: "error",
        message: "Seu navegador não suporta geolocalização.",
      });
      return;
    }

    setGeo({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        const at = new Date().toLocaleString("pt-BR");

        setGeo({ status: "ready", lat, lng, accuracy, at });
        buscarRestaurantes(lat, lng);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeo({ status: "denied" });
        } else {
          setGeo({
            status: "error",
            message: err.message || "Erro ao obter localização.",
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  async function buscarRestaurantes(lat: number, lng: number) {
    try {
      setPlacesStatus("loading");
      setPlacesError("");

      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, type: "restaurant", radius: 1500 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPlacesStatus("error");
        setPlacesError(data?.error || "Erro ao buscar lugares.");
        return;
      }

      setPlacesRaw(Array.isArray(data?.results) ? data.results : []);
      setPlacesStatus("ready");
    } catch (e: any) {
      setPlacesStatus("error");
      setPlacesError(e?.message || "Erro inesperado.");
    }
  }

  useEffect(() => {
    pegarLocalizacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const places = useMemo(() => {
    if (geo.status !== "ready") return placesRaw;

    const userLat = geo.lat;
    const userLng = geo.lng;

    const withDistance = placesRaw.map((p) => {
      const distanceKm =
        typeof p.lat === "number" && typeof p.lng === "number"
          ? haversineKm(userLat, userLng, p.lat, p.lng)
          : null;

      return { ...p, distanceKm };
    });

    return withDistance.sort((a: any, b: any) => {
      if (a.open_now === true && b.open_now !== true) return -1;
      if (a.open_now !== true && b.open_now === true) return 1;

      const da = a.distanceKm ?? 9999;
      const db = b.distanceKm ?? 9999;
      if (da !== db) return da - db;

      const ra = a.rating ?? 0;
      const rb = b.rating ?? 0;
      if (ra !== rb) return rb - ra;

      const ua = a.user_ratings_total ?? 0;
      const ub = b.user_ratings_total ?? 0;
      return ub - ua;
    });
  }, [geo, placesRaw]);

  const bestRatedId = useMemo(() => {
    const best = [...places].sort((a: any, b: any) => (b.rating ?? 0) - (a.rating ?? 0))[0];
    return best?.place_id;
  }, [places]);

  const nearestId = useMemo(() => {
    const near = [...places]
      .filter((p: any) => typeof p.distanceKm === "number")
      .sort((a: any, b: any) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))[0];
    return near?.place_id;
  }, [places]);

  function irParaMapaNoApp(place: any) {
    if (!place.lat || !place.lng) return;
    const name = encodeURIComponent(place.name ?? "");
    router.push(`/mapa?lat=${place.lat}&lng=${place.lng}&name=${name}`);
  }

  function tracarRota(place: any) {
    if (geo.status !== "ready") return;
    if (!place.lat || !place.lng) return;

    const toName = encodeURIComponent(place.name ?? "Destino");
    router.push(
      `/rota?fromLat=${geo.lat}&fromLng=${geo.lng}&toLat=${place.lat}&toLng=${place.lng}&toName=${toName}`
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Explorar" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 shadow-xl">
          <div className="text-xl font-semibold">Perto de você agora</div>
          <div className="text-sm text-white/70 mt-1">
            Sugestões para famílias em Londrina -- aberto, perto e bem avaliado.
          </div>

          <button
            onClick={pegarLocalizacao}
            className="mt-4 w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold"
          >
            📍 Atualizar localização
          </button>

          {geo.status === "denied" && (
            <div className="text-sm text-red-200 mt-3">
              Permissão de localização negada. Ative no navegador.
            </div>
          )}
          {geo.status === "error" && (
            <div className="text-sm text-red-200 mt-3">Erro: {geo.message}</div>
          )}
        </div>

        {placesStatus === "loading" && (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {placesStatus === "error" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Erro ao buscar restaurantes: {placesError}
          </div>
        )}

        {placesStatus === "ready" && places.length > 0 && (
          <div className="grid gap-3">
            {places.slice(0, 10).map((place: any) => (
              <div
                key={place.place_id}
                className="overflow-hidden rounded-2xl bg-white/10 border border-white/15 shadow-xl"
              >
                {place.photo_url ? (
                  <div className="w-full h-44 bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={place.photo_url}
                      alt={place.name}
                      className="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 bg-white/5 flex items-center justify-center text-white/60 text-sm">
                    Sem foto
                  </div>
                )}

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold text-white text-lg leading-tight">
                      {place.name}
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {place.open_now === true && <Chip tone="good">🟢 Aberto</Chip>}
                      {place.open_now === false && <Chip tone="bad">🔴 Fechado</Chip>}
                      {place.place_id === nearestId && <Chip tone="info">📍 Mais perto</Chip>}
                      {place.place_id === bestRatedId && <Chip tone="info">🏆 Melhor nota</Chip>}
                    </div>
                  </div>

                  {place.vicinity && (
                    <div className="text-sm text-white/70">{place.vicinity}</div>
                  )}

                  <div className="flex items-center justify-between gap-3 text-sm text-white/70">
                    <div>
                      {typeof place.rating === "number" ? (
                        <>
                          ⭐ {place.rating} ({place.user_ratings_total ?? 0})
                        </>
                      ) : (
                        <>⭐ Sem avaliação</>
                      )}
                    </div>

                    {typeof place.distanceKm === "number" && (
                      <div>📍 {place.distanceKm.toFixed(2)} km</div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => irParaMapaNoApp(place)}
                      className="bg-white text-blue-900 px-3 py-2 rounded-xl font-semibold"
                      disabled={!place.lat || !place.lng}
                    >
                      🗺 Mapa
                    </button>

                    <button
                      onClick={() => tracarRota(place)}
                      className="bg-emerald-400 text-emerald-950 px-3 py-2 rounded-xl font-semibold"
                      disabled={geo.status !== "ready" || !place.lat || !place.lng}
                    >
                      🚗 Rota
                    </button>

                    {place.maps_url ? (
                      <a
                        href={place.maps_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center bg-white/10 border border-white/20 text-white px-3 py-2 rounded-xl font-semibold"
                      >
                        ↗ Externo
                      </a>
                    ) : (
                      <div className="bg-white/5 border border-white/10 rounded-xl" />
                    )}
                  </div>

                  {geo.status !== "ready" && (
                    <div className="text-xs text-white/60">
                      Ative a localização para traçar rotas.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {placesStatus === "ready" && places.length === 0 && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Nenhum resultado encontrado nessa região.
          </div>
        )}
      </main>
    </div>
  );
}