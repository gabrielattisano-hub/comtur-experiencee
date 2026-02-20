"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";
import {
  toggleFavorito,
  isFavorito,
  FavPlace,
} from "../../libs/favoritos";

type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ready"; lat: number; lng: number; accuracy?: number; at: string };

type Place = FavPlace & {
  distanceKm?: number | null;
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

export default function ExplorarPage() {
  const router = useRouter();
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });
  const [placesRaw, setPlacesRaw] = useState<Place[]>([]);
  const [placesStatus, setPlacesStatus] = useState<
    "idle" | "loading" | "error" | "ready"
  >("idle");
  const [placesError, setPlacesError] = useState<string>("");

  const [refreshFav, setRefreshFav] = useState(0);

  async function pegarLocalizacao() {
    if (!("geolocation" in navigator)) return;

    setGeo({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setGeo({
          status: "ready",
          lat,
          lng,
          accuracy: pos.coords.accuracy,
          at: new Date().toLocaleString("pt-BR"),
        });

        buscarRestaurantes(lat, lng);
      },
      () => setGeo({ status: "denied" }),
      { enableHighAccuracy: true }
    );
  }

  async function buscarRestaurantes(lat: number, lng: number) {
    try {
      setPlacesStatus("loading");

      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPlacesStatus("error");
        setPlacesError(data?.error || "Erro ao buscar lugares.");
        return;
      }

      setPlacesRaw(data.results || []);
      setPlacesStatus("ready");
    } catch (e: any) {
      setPlacesStatus("error");
      setPlacesError(e?.message);
    }
  }

  useEffect(() => {
    pegarLocalizacao();
    // eslint-disable-next-line
  }, []);

  const places = useMemo(() => {
    if (geo.status !== "ready") return placesRaw;

    return placesRaw.map((p) => ({
      ...p,
      distanceKm:
        typeof p.lat === "number"
          ? haversineKm(geo.lat, geo.lng, p.lat, p.lng)
          : null,
    }));
  }, [geo, placesRaw]);

  function salvar(place: Place) {
    toggleFavorito(place);
    setRefreshFav((v) => v + 1);
  }

  function irMapa(place: Place) {
    if (!place.lat || !place.lng) return;
    router.push(
      `/mapa?lat=${place.lat}&lng=${place.lng}&name=${encodeURIComponent(
        place.name
      )}`
    );
  }

  function rota(place: Place) {
    if (geo.status !== "ready") return;
    if (!place.lat || !place.lng) return;

    router.push(
      `/rota?fromLat=${geo.lat}&fromLng=${geo.lng}&toLat=${place.lat}&toLng=${
        place.lng
      }&toName=${encodeURIComponent(place.name)}`
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Explorar" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <button
          onClick={pegarLocalizacao}
          className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold"
        >
          📍 Atualizar localização
        </button>

        {placesStatus === "loading" && (
          <div className="text-white/60">Carregando...</div>
        )}

        {placesStatus === "error" && (
          <div className="text-red-300">{placesError}</div>
        )}

        {placesStatus === "ready" &&
          places.map((place) => {
            const fav = isFavorito(place.place_id);

            return (
              <div
                key={place.place_id}
                className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-white">
                    {place.name}
                  </div>

                  <button
                    onClick={() => salvar(place)}
                    className="text-xl"
                  >
                    {fav ? "❤️" : "🤍"}
                  </button>
                </div>

                {place.vicinity && (
                  <div className="text-sm text-white/70">
                    {place.vicinity}
                  </div>
                )}

                <div className="text-sm text-white/70">
                  ⭐ {place.rating ?? "-"} •{" "}
                  {place.distanceKm
                    ? `${place.distanceKm.toFixed(2)} km`
                    : ""}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => irMapa(place)}
                    className="bg-white text-blue-900 px-3 py-2 rounded-xl"
                  >
                    🗺 Mapa
                  </button>

                  <button
                    onClick={() => rota(place)}
                    className="bg-emerald-400 text-emerald-950 px-3 py-2 rounded-xl"
                  >
                    🚗 Rota
                  </button>
                </div>
              </div>
            );
          })}
      </main>
    </div>
  );
}