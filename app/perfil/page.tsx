"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";
import {
  getFavoritos,
  toggleFavorito,
  FavPlace,
} from "../../libs/favoritos";

type Geo = { lat: number; lng: number } | null;

export default function PerfilPage() {
  const router = useRouter();
  const [favoritos, setFavoritos] = useState<FavPlace[]>([]);
  const [geo, setGeo] = useState<Geo>(null);

  function carregar() {
    setFavoritos(getFavoritos());
  }

  useEffect(() => {
    carregar();

    // tenta pegar localização pra rotas
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }, []);

  function remover(place: FavPlace) {
    toggleFavorito(place);
    carregar();
  }

  function abrirMapa(place: FavPlace) {
    if (!place.lat || !place.lng) return;
    router.push(
      `/mapa?lat=${place.lat}&lng=${place.lng}&name=${encodeURIComponent(
        place.name
      )}`
    );
  }

  function tracarRota(place: FavPlace) {
    if (!geo) return;
    if (!place.lat || !place.lng) return;

    router.push(
      `/rota?fromLat=${geo.lat}&fromLng=${geo.lng}&toLat=${place.lat}&toLng=${
        place.lng
      }&toName=${encodeURIComponent(place.name)}`
    );
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Perfil" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <div className="text-lg font-semibold text-white">❤️ Salvos</div>
          <div className="text-sm text-white/70 mt-1">
            Seus lugares favoritos para repetir com a família.
          </div>
        </div>

        {favoritos.length === 0 && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/70">
            Você ainda não salvou nenhum lugar.
            <div className="mt-2 text-white/80">
              Vá em <b>Explorar</b> e toque no ❤️.
            </div>
          </div>
        )}

        {favoritos.map((place) => (
          <div
            key={place.place_id}
            className="overflow-hidden rounded-2xl bg-white/10 border border-white/20"
          >
            {place.photo_url ? (
              <div className="w-full h-40 bg-black/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.photo_url}
                  alt={place.name}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-white text-lg">
                  {place.name}
                </div>

                <button
                  onClick={() => remover(place)}
                  className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm"
                >
                  Remover
                </button>
              </div>

              {place.vicinity && (
                <div className="text-sm text-white/70">{place.vicinity}</div>
              )}

              <div className="text-sm text-white/70">
                {typeof place.rating === "number" ? (
                  <>
                    ⭐ {place.rating} ({place.user_ratings_total ?? 0})
                  </>
                ) : (
                  <>⭐ Sem avaliação</>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => abrirMapa(place)}
                  className="bg-white text-blue-900 px-3 py-2 rounded-xl font-semibold"
                  disabled={!place.lat || !place.lng}
                >
                  🗺 Mapa
                </button>

                <button
                  onClick={() => tracarRota(place)}
                  className="bg-emerald-400 text-emerald-950 px-3 py-2 rounded-xl font-semibold"
                  disabled={!geo || !place.lat || !place.lng}
                >
                  🚗 Rota
                </button>
              </div>

              {!geo && (
                <div className="text-xs text-white/60 pt-1">
                  Ative a localização para traçar rotas.
                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}