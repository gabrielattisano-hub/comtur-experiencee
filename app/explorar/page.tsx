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

  // Exemplo fixo de Londrina (depois ligamos na geolocalização real)
  const origem = useMemo(() => ({ lat: -23.3045, lng: -51.1696 }), []);

  async function carregar() {
    try {
      setStatus("loading");
      setErro("");

      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: origem.lat,
          lng: origem.lng,
          type: "restaurant",
        }),
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

  useEffect(() => {
    carregar();
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

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">🍽 Explorar (Famílias)</h1>
            <p className="text-white/70 mt-1">
              Sugestões próximas para almoço, jantar e passeios rápidos em Londrina.
            </p>
          </div>

          <button
            onClick={carregar}
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
          const ativo = favoritos.includes(place.place_id) || isFavorito(place.place_id);

          // Rota: origem = coords fixas, destino = nome + cidade (funciona como endereço)
          const originParam = `${origem.lat},${origem.lng}`;
          const destinationParam = `${place.name}, Londrina PR`;

          const rotaHref = `/rota?origin=${encodeURIComponent(
            originParam
          )}&destination=${encodeURIComponent(destinationParam)}`;

          return (
            <div
              key={place.place_id}
              className="p-4 rounded-3xl bg-white/10 border border-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-white truncate">{place.name}</div>

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
                <button className="flex-1 bg-white text-blue-900 py-2 rounded-2xl font-semibold">
                  Ver detalhes
                </button>

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