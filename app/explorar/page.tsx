"use client";

import { useEffect, useState } from "react";
import { FavPlace, toggleFavorito, isFavorito } from "@/lib/favoritos";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

export default function ExplorarPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    async function carregar() {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: -23.3045, lng: -51.1696 }), // exemplo Londrina
      });

      const data = await res.json();
      if (data.results) {
        setPlaces(data.results);
      }
    }

    carregar();
  }, []);

  function handleFavorito(place: Place) {
    const novo = toggleFavorito({
      ...place,
      lat: undefined,
      lng: undefined,
    } as FavPlace);

    setFavoritos(novo.map((p) => p.place_id));
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold text-white">
        🍽 Restaurantes Próximos
      </h1>

      {places.map((place) => {
        const ativo =
          favoritos.includes(place.place_id) ||
          isFavorito(place.place_id);

        return (
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
                    ⭐ {place.rating} (
                    {place.user_ratings_total ?? 0} avaliações)
                  </div>
                )}
              </div>

              <button
                onClick={() => handleFavorito(place)}
                className={`text-xl ${
                  ativo ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ⭐
              </button>
            </div>
          </div>
        );
      })}
    </main>
  );
}