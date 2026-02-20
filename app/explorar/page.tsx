"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FavPlace, toggleFavorito, isFavorito } from "@/lib/favoritos";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ready"; lat: number; lng: number; accuracy?: number; at: string };

function ratingLabel(r?: number) {
  if (typeof r !== "number") return "Sem nota";
  if (r >= 4.6) return "Excelente";
  if (r >= 4.2) return "Muito bom";
  if (r >= 3.8) return "Bom";
  return "Ok";
}

export default function ExplorarPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "ready">(
    "idle"
  );
  const [erro, setErro] = useState("");

  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  // fallback Londrina
  const fallback = useMemo(() => ({ lat: -23.3045, lng: -51.1696 }), []);

  function coordsAtuais() {
    if (geo.status === "ready") return { lat: geo.lat, lng: geo.lng };
    return fallback;
  }

  async function carregar(lat: number, lng: number) {
    try {
      setStatus("loading");
      setErro("");

      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng, type: "restaurant" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErro(data?.error || "Erro ao buscar restaurantes.");
        return;
      }

      setPlaces(Array.isArray(data?.results) ? data.results : []);
      setStatus("ready");
    } catch (e: any) {
      setStatus("error");
      setErro(e?.message || "Erro inesperado.");
    }
  }

  function pegarLocalizacao() {
    if (!("geolocation" in navigator)) {
      setGeo({
        status: "error",
        message: "Seu navegador não suporta geolocalização.",
      });
      carregar(fallback.lat, fallback.lng);
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
        carregar(lat, lng);
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
        carregar(fallback.lat, fallback.lng);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  useEffect(() => {
    pegarLocalizacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFavorito(place: Place) {
    const fav: FavPlace = {
      place_id: place.place_id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      open_now: place.open_now,
    };

    const novaLista = toggleFavorito(fav);
    setFavoritos(novaLista.map((p) => p.place_id));
  }

  const origem = coordsAtuais();

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">🍽 Explorar (Famílias)</h1>
            <p className="text-white/70 mt-1">
              Sugestões próximas com base na sua localização.
            </p>

            <div className="mt-2 text-xs text-white/60">
              Coordenadas: {origem.lat.toFixed(4)}, {origem.lng.toFixed(4)}
              {geo.status === "ready" && geo.accuracy != null && (
                <> • precisão ~{Math.round(geo.accuracy)}m</>
              )}
            </div>

            {geo.status === "denied" && (
              <div className="mt-1 text-xs text-white/60">
                Permissão negada -- usando Londrina como fallback.
              </div>
            )}
            {geo.status === "error" && (
              <div className="mt-1 text-xs text-white/60">
                Erro: {geo.message} -- usando Londrina como fallback.
              </div>
            )}
          </div>

          <button
            onClick={pegarLocalizacao}
            className="shrink-0 bg-white text-blue-900 px-4 py-2 rounded-2xl font-semibold"
          >
            Atualizar
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">
            👨‍👩‍👧‍👦 Família
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">
            🧒 Kids friendly
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80">
            ⭐ Top avaliados
          </span>
        </div>
      </div>

      {status === "loading" && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/80">
          Buscando restaurantes próximos...
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/80">
          <b>Erro:</b> {erro}
        </div>
      )}

      {status === "ready" && places.length === 0 && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/80">
          Nenhum restaurante encontrado.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {places.map((place) => {
          const ativo =
            favoritos.includes(place.place_id) || isFavorito(place.place_id);

          const originParam = `${origem.lat},${origem.lng}`;
          const destinationParam = `${place.name}${
            place.vicinity ? `, ${place.vicinity}` : ""
          }`;

          const rotaHref = `/rota?origin=${encodeURIComponent(
            originParam
          )}&destination=${encodeURIComponent(destinationParam)}`;

          // ✅ Link "Ver detalhes" já passa dados úteis na query
          const detalhesHref =
            `/lugar/${encodeURIComponent(place.place_id)}` +
            `?name=${encodeURIComponent(place.name)}` +
            `&vicinity=${encodeURIComponent(place.vicinity ?? "")}` +
            `&rating=${encodeURIComponent(String(place.rating ?? ""))}` +
            `&urt=${encodeURIComponent(String(place.user_ratings_total ?? ""))}`;

          return (
            <div
              key={place.place_id}
              className="p-4 rounded-3xl bg-white/10 border border-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">
                    {place.name}
                  </div>

                  {place.vicinity && (
                    <div className="text-sm text-white/70 mt-1 line-clamp-2">
                      {place.vicinity}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white/70">
                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                      ⭐ {place.rating ?? "-"} • {ratingLabel(place.rating)}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                      🗣 {place.user_ratings_total ?? 0} avaliações
                    </span>
                    {typeof place.open_now === "boolean" && (
                      <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                        {place.open_now ? "✅ Aberto" : "❌ Fechado"}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleFavorito(place)}
                  className={`text-2xl leading-none ${
                    ativo ? "text-yellow-400" : "text-white/40"
                  }`}
                  aria-label="Favoritar"
                >
                  ★
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={detalhesHref}
                  className="flex-1 text-center bg-white text-blue-900 py-2 rounded-2xl font-semibold"
                >
                  Ver detalhes
                </Link>

                <Link
                  href={rotaHref}
                  className="flex-1 text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
                >
                  Traçar rota
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}