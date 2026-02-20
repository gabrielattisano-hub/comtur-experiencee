"use client";

import { useEffect, useState } from "react";
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

export default function ExplorarPage() {
  const router = useRouter();
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const [places, setPlaces] = useState<Place[]>([]);
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
        body: JSON.stringify({ lat, lng, type: "restaurant" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPlacesStatus("error");
        setPlacesError(data?.error || "Erro ao buscar lugares.");
        return;
      }

      setPlaces(Array.isArray(data?.results) ? data.results : []);
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

  function OpenBadge({ open }: { open?: boolean }) {
    if (open === true) return <span className="text-emerald-300">🟢 Aberto</span>;
    if (open === false) return <span className="text-red-300">🔴 Fechado</span>;
    return <span className="text-white/60">⏱</span>;
  }

  function irParaMapaNoApp(place: Place) {
    if (!place.lat || !place.lng) return;
    const name = encodeURIComponent(place.name ?? "");
    router.push(`/mapa?lat=${place.lat}&lng=${place.lng}&name=${name}`);
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Explorar (Perto de Mim)" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <button
          onClick={pegarLocalizacao}
          className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold"
        >
          📍 Atualizar localização
        </button>

        {geo.status === "loading" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Obtendo localização...
          </div>
        )}

        {geo.status === "denied" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Permissão negada. Ative a localização no navegador.
          </div>
        )}

        {geo.status === "error" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Erro: {geo.message}
          </div>
        )}

        {placesStatus === "loading" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Buscando restaurantes próximos...
          </div>
        )}

        {placesStatus === "error" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Erro ao buscar restaurantes: {placesError}
          </div>
        )}

        {placesStatus === "ready" && places.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">
              🍽 Restaurantes próximos
            </h2>

            {places.slice(0, 10).map((place) => (
              <div
                key={place.place_id}
                className="overflow-hidden rounded-2xl bg-white/10 border border-white/20"
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
                ) : null}

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold text-white text-lg leading-tight">
                      {place.name}
                    </div>
                    <div className="text-sm whitespace-nowrap">
                      <OpenBadge open={place.open_now} />
                    </div>
                  </div>

                  {place.vicinity && (
                    <div className="text-sm text-white/70">{place.vicinity}</div>
                  )}

                  <div className="text-sm text-white/70">
                    {typeof place.rating === "number" ? (
                      <>
                        ⭐ {place.rating} ({place.user_ratings_total ?? 0} avaliações)
                      </>
                    ) : (
                      <>⭐ Sem avaliação</>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => irParaMapaNoApp(place)}
                      className="flex-1 bg-white text-blue-900 px-3 py-2 rounded-xl font-semibold"
                      disabled={!place.lat || !place.lng}
                    >
                      🗺 Mapa no app
                    </button>

                    {place.maps_url ? (
                      <a
                        href={place.maps_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center bg-white/10 border border-white/20 text-white px-3 py-2 rounded-xl font-semibold"
                      >
                        ↗ Externo
                      </a>
                    ) : null}
                  </div>
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