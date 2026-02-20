"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Topbar from "../../components/Topbar";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
  lat?: number;
  lng?: number;
  maps_url?: string;
  photo_url?: string;
};

export default function MapaPage() {
  const router = useRouter();
  const params = useSearchParams();

  const qLat = params.get("lat");
  const qLng = params.get("lng");
  const qName = params.get("name");

  const [userGeo, setUserGeo] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "ready">(
    "idle"
  );
  const [error, setError] = useState<string>("");

  const [selected, setSelected] = useState<{
    lat: number;
    lng: number;
    name?: string;
  } | null>(null);

  // 1) Define ponto inicial do mapa (query ou geo)
  useEffect(() => {
    const lat = qLat ? Number(qLat) : NaN;
    const lng = qLng ? Number(qLng) : NaN;

    // Se veio por query (?lat=&lng=), usa como "selecionado"
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      setSelected({ lat, lng, name: qName ?? undefined });
    }

    // Sempre tenta pegar geolocalização do usuário
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const g = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserGeo(g);

        // Se não veio query, centraliza no usuário
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          setSelected({ lat: g.lat, lng: g.lng, name: "Você está aqui" });
        }
      },
      () => {
        // sem permissão -> segue sem geo
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Busca lugares perto do usuário (ou do ponto selecionado caso não tenha geo)
  useEffect(() => {
    async function loadPlaces() {
      const base = userGeo ?? selected;
      if (!base) return;

      try {
        setStatus("loading");
        setError("");

        const res = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: base.lat,
            lng: base.lng,
            type: "restaurant",
            radius: 1500,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setError(data?.error || "Erro ao buscar lugares.");
          return;
        }

        setPlaces(Array.isArray(data?.results) ? data.results : []);
        setStatus("ready");
      } catch (e: any) {
        setStatus("error");
        setError(e?.message || "Erro inesperado.");
      }
    }

    loadPlaces();
  }, [userGeo, selected]);

  // 3) URL do mapa embutido (muda quando seleciona um lugar)
  const embedUrl = useMemo(() => {
    if (!selected) return "";
    return `https://www.google.com/maps?q=${selected.lat},${selected.lng}&z=16&output=embed`;
  }, [selected]);

  function OpenBadge({ open }: { open?: boolean }) {
    if (open === true) return <span className="text-emerald-300">🟢 Aberto</span>;
    if (open === false) return <span className="text-red-300">🔴 Fechado</span>;
    return <span className="text-white/60">⏱</span>;
  }

  return (
    <div className="min-h-screen">
      <Topbar
        title={qName ? `Mapa: ${qName}` : "Mapa (no app)"}
        onBack={() => router.back()}
      />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {!selected && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Obtendo localização para abrir o mapa...
          </div>
        )}

        {selected && (
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/5">
            <iframe
              title="Mapa"
              src={embedUrl}
              className="w-full h-[55vh]"
              loading="lazy"
            />
          </div>
        )}

        {selected?.name && (
          <div className="text-sm text-white/80">
            📍 Foco atual: <b>{selected.name}</b>
          </div>
        )}

        {status === "loading" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Carregando lugares próximos...
          </div>
        )}

        {status === "error" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Erro: {error}
          </div>
        )}

        {status === "ready" && places.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white">
              📌 Lugares próximos (toque para "pin" no mapa)
            </h2>

            {places.slice(0, 10).map((p) => (
              <button
                key={p.place_id}
                onClick={() => {
                  if (typeof p.lat === "number" && typeof p.lng === "number") {
                    setSelected({ lat: p.lat, lng: p.lng, name: p.name });
                  }
                }}
                className="w-full text-left p-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold text-white">{p.name}</div>
                  <div className="text-sm">
                    <OpenBadge open={p.open_now} />
                  </div>
                </div>

                {p.vicinity && (
                  <div className="text-sm text-white/70 mt-1">{p.vicinity}</div>
                )}

                <div className="text-sm text-white/70 mt-1">
                  {typeof p.rating === "number" ? (
                    <>
                      ⭐ {p.rating} ({p.user_ratings_total ?? 0})
                    </>
                  ) : (
                    <>⭐ Sem avaliação</>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}