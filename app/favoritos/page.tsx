"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FavPlace,
  getFavoritos,
  toggleFavorito,
} from "@/lib/favoritos";

export default function FavoritosPage() {
  const [lista, setLista] = useState<FavPlace[]>([]);

  // Origem padrão (Londrina). Depois ligamos na geolocalização real.
  const origem = useMemo(() => ({ lat: -23.3045, lng: -51.1696 }), []);

  useEffect(() => {
    setLista(getFavoritos());
  }, []);

  function remover(place: FavPlace) {
    const nova = toggleFavorito(place);
    setLista(nova);
  }

  function rotaHref(place: FavPlace) {
    const originParam = `${origem.lat},${origem.lng}`;
    const destinationParam = `${place.name}, Londrina PR`;

    return `/rota?origin=${encodeURIComponent(
      originParam
    )}&destination=${encodeURIComponent(destinationParam)}`;
  }

  function mapsHref(place: FavPlace) {
    // se tiver maps_url no futuro, usa ele. Por enquanto cria pela busca.
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${place.name}, Londrina PR`
    )}`;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">⭐ Meus Favoritos</h1>
        <p className="text-white/70 mt-1">
          Seus lugares salvos para voltar depois -- com rota rápida.
        </p>
      </div>

      {lista.length === 0 && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/70">
          Você ainda não salvou nenhum lugar.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {lista.map((place) => (
          <div
            key={place.place_id}
            className="p-4 rounded-3xl bg-white/10 border border-white/20 space-y-3"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-white truncate">
                  {place.name}
                </div>

                {place.vicinity && (
                  <div className="text-sm text-white/70 mt-1 line-clamp-2">
                    {place.vicinity}
                  </div>
                )}

                {place.rating && (
                  <div className="text-sm text-white/70 mt-2">
                    ⭐ {place.rating} ({place.user_ratings_total ?? 0} avaliações)
                  </div>
                )}
              </div>

              <button
                onClick={() => remover(place)}
                className="text-red-300 text-sm"
              >
                Remover
              </button>
            </div>

            <div className="flex gap-2">
              <a
                href={mapsHref(place)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center bg-white text-blue-900 py-2 rounded-2xl font-semibold"
              >
                Abrir no Maps
              </a>

              <Link
                href={rotaHref(place)}
                className="flex-1 text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
              >
                Traçar rota
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}