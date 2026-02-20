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
};

export default function ExplorarPage() {
  const router = useRouter();

  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const [places, setPlaces] = useState<Place[]>([]);
  const [placesStatus, setPlacesStatus] = useState<
    "idle" | "loading" | "error" | "ready"
  >("idle");
  const [placesError, setPlacesError] = useState<string>("");

  async function buscarRestaurantes(lat: number, lng: number) {
    try {
      setPlacesStatus("loading");
      setPlacesError("");

      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat,
          lng,
          type: "restaurant",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setPlacesStatus("error");
        setPlacesError(data?.error || "Erro ao buscar lugares.");
        return;
      }

      setPlaces(Array.isArray(data?.results) ? (data.results as Place[]) : []);
      setPlacesStatus("ready");
    } catch (e: unknown) {
      setPlacesStatus("error");
      setPlacesError(e instanceof Error ? e.message : "Erro inesperado.");
    }
  }

  function pegarLocalizacao() {
    if (typeof window === "undefined") return;

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

        // busca automático
        buscarRestaurantes(lat, lng);
      },
      (err) => {
        // GeolocationPositionError nem sempre tipa bem no TS em alguns builds,
        // então tratamos de forma defensiva:
        const code = (err as any)?.code;
        const message = (err as any)?.message;

        if (code === 1) {
          setGeo({ status: "denied" });
        } else {
          setGeo({
            status: "error",
            message: message || "Erro ao obter localização.",
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  useEffect(() => {
    pegarLocalizacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                className="p-4 rounded-2xl bg-white/10 border border-white/20"
              >
                <div className="font-semibold text-white">{place.name}</div>

                {place.vicinity && (
                  <div className="text-sm text-white/70">{place.vicinity}</div>
                )}

                {typeof place.rating === "number" && (
                  <div className="text-sm text-white/70 mt-1">
                    ⭐ {place.rating} ({place.user_ratings_total ?? 0} avaliações)
                  </div>
                )}

                {typeof place.open_now === "boolean" && (
                  <div className="text-sm text-white/70 mt-1">
                    {place.open_now ? "✅ Aberto agora" : "❌ Fechado agora"}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
