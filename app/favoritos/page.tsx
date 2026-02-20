"use client";

import { useEffect, useState } from "react";
import {
  FavPlace,
  getFavoritos,
  toggleFavorito,
} from "@/lib/favoritos";

export default function FavoritosPage() {
  const [lista, setLista] = useState<FavPlace[]>([]);

  useEffect(() => {
    setLista(getFavoritos());
  }, []);

  function remover(place: FavPlace) {
    const novaLista = toggleFavorito(place);
    setLista(novaLista);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">
        ⭐ Meus Favoritos
      </h1>

      {lista.length === 0 && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/70">
          Você ainda não salvou nenhum lugar.
        </div>
      )}

      {lista.map((place) => (
        <div
          key={place.place_id}
          className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-white">
                {place.name}
              </div>

              {place.vicinity && (
                <div className="text-sm text-white/70">
                  {place.vicinity}
                </div>
              )}

              {place.rating && (
                <div className="text-sm text-white/70 mt-1">
                  ⭐ {place.rating} ({place.user_ratings_total ?? 0} avaliações)
                </div>
              )}
            </div>

            <button
              onClick={() => remover(place)}
              className="text-red-400 text-sm"
            >
              Remover
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}