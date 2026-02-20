export const dynamic = "force-dynamic";

"use client";

import { Suspense, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FavPlace, isFavorito, toggleFavorito } from "@/lib/favoritos";

type PlaceDetails = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
};

function LugarInner() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sp = useSearchParams();

  const id = params?.id ? String(params.id) : "";

  const name = sp.get("name") ?? "";
  const vicinity = sp.get("vicinity") ?? "";
  const rating = sp.get("rating") ? Number(sp.get("rating")) : undefined;
  const user_ratings_total = sp.get("urt")
    ? Number(sp.get("urt"))
    : undefined;

  const place: PlaceDetails = useMemo(
    () => ({
      place_id: id,
      name: name || "Lugar",
      vicinity: vicinity || undefined,
      rating,
      user_ratings_total,
    }),
    [id, name, vicinity, rating, user_ratings_total]
  );

  const [fav, setFav] = useState<boolean>(() => isFavorito(place.place_id));

  function handleFav() {
    const p: FavPlace = {
      place_id: place.place_id,
      name: place.name,
      vicinity: place.vicinity,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
    };

    toggleFavorito(p);
    setFav(isFavorito(place.place_id));
  }

  const externalMaps = useMemo(() => {
    const q = `${place.name}${place.vicinity ? `, ${place.vicinity}` : ""}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      q
    )}`;
  }, [place.name, place.vicinity]);

  const originFallback = "-23.3045,-51.1696";
  const destinationParam = `${place.name}${
    place.vicinity ? `, ${place.vicinity}` : ""
  }`;
  const rotaHref = `/rota?origin=${encodeURIComponent(
    originFallback
  )}&destination=${encodeURIComponent(destinationParam)}`;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">
              {place.name}
            </h1>

            {place.vicinity && (
              <p className="text-white/70 mt-1">{place.vicinity}</p>
            )}

            <div className="flex gap-2 mt-3 text-xs text-white/70 flex-wrap">
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                ⭐ {place.rating ?? "-"}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                🗣 {place.user_ratings_total ?? 0} avaliações
              </span>
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                🆔 {place.place_id}
              </span>
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="bg-white/10 border border-white/20 px-4 py-2 rounded-2xl font-semibold text-white"
          >
            Voltar
          </button>
        </div>

        <button
          onClick={handleFav}
          className={`mt-4 w-full py-3 rounded-2xl font-semibold ${
            fav
              ? "bg-yellow-400 text-slate-900"
              : "bg-white/10 border border-white/20 text-white"
          }`}
        >
          {fav ? "★ Salvo nos favoritos" : "☆ Salvar nos favoritos"}
        </button>
      </div>

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h2 className="text-white font-semibold">Ações rápidas</h2>

        <div className="mt-4 flex gap-2">
          <a
            href={externalMaps}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center bg-white text-blue-900 py-2 rounded-2xl font-semibold"
          >
            Abrir no Maps
          </a>

          <Link
            href={rotaHref}
            className="flex-1 text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
          >
            Traçar rota
          </Link>
        </div>

        <div className="mt-4 text-xs text-white/60">
          *Próximo passo: buscar detalhes reais do Google Places (telefone, fotos, horário, site).
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h2 className="text-white font-semibold">Perguntar para a IA</h2>
        <p className="text-white/70 text-sm mt-1">
          Quer um roteiro família para esse lugar?
        </p>
        <div className="mt-2 p-3 rounded-2xl bg-black/30 border border-white/10 text-white text-sm">
          "Estou indo para {place.name}. Me sugira um roteiro família, com horários e dicas práticas."
        </div>

        <Link
          href="/assistente"
          className="mt-3 inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-2xl font-semibold text-white"
        >
          Ir para Assistente IA
        </Link>
      </div>
    </main>
  );
}

export default function LugarPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Carregando...</div>}>
      <LugarInner />
    </Suspense>
  );
}