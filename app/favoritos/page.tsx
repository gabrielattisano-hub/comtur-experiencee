"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FavPlace, getFavoritos, toggleFavorito } from "@/lib/favoritos";

export default function FavoritosPage() {
  const [lista, setLista] = useState<FavPlace[]>([]);

  useEffect(() => {
    setLista(getFavoritos());
  }, []);

  function remover(place: FavPlace) {
    toggleFavorito(place);
    setLista(getFavoritos());
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">⭐ Favoritos</h1>
        <p className="text-white/70 mt-1">Seus lugares salvos para visitar depois.</p>
      </div>

      {lista.length === 0 && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/70">
          Você ainda não salvou nenhum lugar.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {lista.map((place) => {
          const detalhesHref =
            `/lugar/${encodeURIComponent(place.place_id)}` +
            `?name=${encodeURIComponent(place.name)}` +
            `&vicinity=${encodeURIComponent(place.vicinity ?? "")}` +
            `&rating=${encodeURIComponent(String(place.rating ?? ""))}` +
            `&urt=${encodeURIComponent(String(place.user_ratings_total ?? ""))}`;

          const rotaHref =
            `/rota?origin=Londrina` +
            `&destination=${encodeURIComponent(
              `${place.name}${place.vicinity ? `, ${place.vicinity}` : ""}`
            )}`;

          return (
            <div
              key={place.place_id}
              className="p-4 rounded-3xl bg-white/10 border border-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{place.name}</div>

                  {place.vicinity && (
                    <div className="text-sm text-white/70 mt-1">{place.vicinity}</div>
                  )}

                  <div className="text-xs text-white/60 mt-2">
                    ⭐ {place.rating ?? "-"} • 🗣 {place.user_ratings_total ?? 0} avaliações
                  </div>
                </div>

                <button
                  onClick={() => remover(place)}
                  className="text-red-400 text-xl"
                  title="Remover dos favoritos"
                >
                  ✕
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