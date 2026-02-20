"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";
import { FavPlace, isFavorito, toggleFavorito } from "@/lib/favoritos";

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

  const [refreshFavTick, setRefreshFavTick] = useState(0);

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

  useEffect(() => {
    // fallback Londrina
    buscarRestaurantes(-23.3045, -51.1696);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(place: Place) {
    const p: FavPlace = {
      place_id: place.place_id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      open_now: place.open_now,
    };
    toggleFavorito(p);
    setRefreshFavTick((x) => x + 1);
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Explorar (Perto de Mim)" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <p className="text-white/90">
            Capture sua localização e veja restaurantes próximos (ideal para famílias).
          </p>
          <p className="text-white/60 text-sm mt-1">
            Sem notícias/crimes: recomendações sempre seguras e positivas.
          </p>
        </div>

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
            <p className="font-semibold">Permissão negada.</p>
            <p className="text-white/70 text-sm mt-1">
              Para funcionar, permita localização no navegador.
            </p>
          </div>
        )}

        {geo.status === "error" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            <p className="font-semibold">Erro:</p>
            <p className="text-white/70 text-sm mt-1">{geo.message}</p>
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

        {placesStatus === "ready" && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-white">
              🍽 Restaurantes próximos
            </h2>

            {places.slice(0, 12).map((place) => {
              const fav = isFavorito(place.place_id);

              const detalhesHref =
                `/lugar/${encodeURIComponent(place.place_id)}` +
                `?name=${encodeURIComponent(place.name)}` +
                `&vicinity=${encodeURIComponent(place.vicinity ?? "")}` +
                `&rating=${encodeURIComponent(String(place.rating ?? ""))}` +
                `&urt=${encodeURIComponent(
                  String(place.user_ratings_total ?? "")
                )}`;

              return (
                <div
                  key={place.place_id}
                  className="p-4 rounded-2xl bg-white/10 border border-white/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">
                        {place.name}
                      </div>

                      {place.vicinity && (
                        <div className="text-sm text-white/70 mt-1">
                          {place.vicinity}
                        </div>
                      )}

                      <div className="text-sm text-white/70 mt-1">
                        ⭐ {place.rating ?? "-"} •{" "}
                        {place.user_ratings_total ?? 0} avaliações
                        {typeof place.open_now === "boolean" && (
                          <> • {place.open_now ? "✅ Aberto" : "❌ Fechado"}</>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggle(place)}
                      className={`px-3 py-2 rounded-2xl font-semibold ${
                        fav
                          ? "bg-yellow-400 text-slate-900"
                          : "bg-white/10 border border-white/20 text-white"
                      }`}
                      title="Salvar nos favoritos"
                    >
                      {fav ? "★" : "☆"}
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Link
                      href={detalhesHref}
                      className="flex-1 text-center bg-white text-blue-900 py-2 rounded-2xl font-semibold"
                    >
                      Ver detalhes
                    </Link>

                    <Link
                      href="/assistente"
                      className="flex-1 text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
                    >
                      Perguntar IA
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* só pra evitar lint de state não usado */}
            <div className="hidden">{refreshFavTick}</div>
          </div>
        )}
      </main>
    </div>
  );
}