export const dynamic = "force-dynamic";

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FavPlace, isFavorito, toggleFavorito } from "@/lib/favoritos";

type PlaceDetailsBase = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
};

type PlaceDetailsReal = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text?: string[];
    open_now?: boolean;
  };
  rating?: number;
  user_ratings_total?: number;
  url?: string;
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

  const base: PlaceDetailsBase = useMemo(
    () => ({
      place_id: id,
      name: name || "Lugar",
      vicinity: vicinity || undefined,
      rating,
      user_ratings_total,
    }),
    [id, name, vicinity, rating, user_ratings_total]
  );

  const [fav, setFav] = useState<boolean>(() => isFavorito(base.place_id));

  const [real, setReal] = useState<PlaceDetailsReal | null>(null);
  const [realStatus, setRealStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [realError, setRealError] = useState("");

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoStatus, setPhotoStatus] = useState<
    "idle" | "loading" | "ready" | "none" | "error"
  >("idle");

  function handleFav() {
    const p: FavPlace = {
      place_id: base.place_id,
      name: base.name,
      vicinity: base.vicinity,
      rating: base.rating,
      user_ratings_total: base.user_ratings_total,
    };

    toggleFavorito(p);
    setFav(isFavorito(base.place_id));
  }

  async function carregarDetalhes() {
    try {
      setRealStatus("loading");
      setRealError("");

      const res = await fetch("/api/place-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: base.place_id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRealStatus("error");
        setRealError(data?.error || "Erro ao buscar detalhes do lugar.");
        return;
      }

      setReal(data?.result ?? null);
      setRealStatus("ready");
    } catch (e: any) {
      setRealStatus("error");
      setRealError(e?.message || "Erro inesperado.");
    }
  }

  async function carregarFoto() {
    try {
      setPhotoStatus("loading");
      setPhotoUrl(null);

      const res = await fetch("/api/place-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: base.place_id, maxwidth: 1400 }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPhotoStatus("error");
        return;
      }

      if (data?.hasPhoto && data?.photoUrl) {
        setPhotoUrl(String(data.photoUrl));
        setPhotoStatus("ready");
      } else {
        setPhotoStatus("none");
      }
    } catch {
      setPhotoStatus("error");
    }
  }

  useEffect(() => {
    if (base.place_id) {
      carregarDetalhes();
      carregarFoto();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.place_id]);

  const externalMaps = useMemo(() => {
    const q = `${base.name}${base.vicinity ? `, ${base.vicinity}` : ""}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      q
    )}`;
  }, [base.name, base.vicinity]);

  const originFallback = "-23.3045,-51.1696";
  const destinationParam = `${base.name}${base.vicinity ? `, ${base.vicinity}` : ""}`;
  const rotaHref = `/rota?origin=${encodeURIComponent(
    originFallback
  )}&destination=${encodeURIComponent(destinationParam)}`;

  const titleName = real?.name || base.name;
  const addr = real?.formatted_address || base.vicinity;

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* FOTO */}
      {photoStatus === "ready" && photoUrl && (
        <div className="rounded-3xl overflow-hidden border border-white/20 bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={`Foto de ${titleName}`}
            className="w-full h-56 object-cover"
          />
        </div>
      )}

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">
              {titleName}
            </h1>

            {addr && <p className="text-white/70 mt-1">{addr}</p>}

            <div className="flex gap-2 mt-3 text-xs text-white/70 flex-wrap">
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                ⭐ {real?.rating ?? base.rating ?? "-"}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                🗣 {real?.user_ratings_total ?? base.user_ratings_total ?? 0} avaliações
              </span>
              {typeof real?.opening_hours?.open_now === "boolean" && (
                <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15">
                  {real.opening_hours.open_now ? "✅ Aberto agora" : "❌ Fechado agora"}
                </span>
              )}
            </div>

            {photoStatus === "loading" && (
              <div className="mt-2 text-xs text-white/60">Carregando foto...</div>
            )}
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

      {/* AÇÕES */}
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h2 className="text-white font-semibold">Ações rápidas</h2>

        <div className="mt-4 flex gap-2">
          <a
            href={real?.url || externalMaps}
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

        {real?.website && (
          <a
            href={real.website}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
          >
            🌐 Visitar site
          </a>
        )}

        {real?.formatted_phone_number && (
          <a
            href={`tel:${real.formatted_phone_number}`}
            className="mt-3 block text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
          >
            📞 Ligar: {real.formatted_phone_number}
          </a>
        )}
      </div>

      {/* HORÁRIOS */}
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h2 className="text-white font-semibold">Horários</h2>

        {realStatus === "loading" && (
          <div className="mt-2 text-white/70 text-sm">Carregando horários...</div>
        )}

        {realStatus === "error" && (
          <div className="mt-2 text-white/70 text-sm">
            Não foi possível carregar detalhes: {realError}
          </div>
        )}

        {realStatus === "ready" && real?.opening_hours?.weekday_text?.length ? (
          <ul className="mt-3 space-y-1 text-sm text-white/80">
            {real.opening_hours.weekday_text.map((line) => (
              <li
                key={line}
                className="px-3 py-2 rounded-2xl bg-black/30 border border-white/10"
              >
                {line}
              </li>
            ))}
          </ul>
        ) : (
          realStatus === "ready" && (
            <div className="mt-2 text-white/70 text-sm">Horários não disponíveis.</div>
          )
        )}
      </div>

      {/* IA */}
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h2 className="text-white font-semibold">Perguntar para a IA</h2>
        <p className="text-white/70 text-sm mt-1">
          Quer um roteiro família para esse lugar?
        </p>
        <div className="mt-2 p-3 rounded-2xl bg-black/30 border border-white/10 text-white text-sm">
          "Estou indo para {titleName}. Me sugira um roteiro família, com horários e dicas práticas."
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