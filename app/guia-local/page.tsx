"use client";

import { useEffect, useState } from "react";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

export default function GuiaLocalPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "ready">(
    "idle"
  );
  const [error, setError] = useState("");

  async function carregar() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Geolocalização não suportada.");
      return;
    }

    setStatus("loading");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch("/api/guia-local", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat,
              lng,
              radius: 2500,
              type: "tourist_attraction",
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            setStatus("error");
            setError(data?.error || "Erro ao buscar locais.");
            return;
          }

          setPlaces(Array.isArray(data?.results) ? data.results : []);
          setStatus("ready");
        } catch (e: any) {
          setStatus("error");
          setError(e?.message || "Erro inesperado.");
        }
      },
      (err) => {
        setStatus("error");
        setError(err?.message || "Permissão negada / erro ao obter localização.");
      }
    );
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-2">📍 Guia Local (Perto de Mim)</h1>
      <p className="text-white/70 mb-6">
        Mostrando pontos turísticos próximos usando sua localização.
      </p>

      <button
        onClick={carregar}
        className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold mb-6"
      >
        🔄 Atualizar
      </button>

      {status === "loading" && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          Carregando locais próximos...
        </div>
      )}

      {status === "error" && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <b>Erro:</b> {error}
        </div>
      )}

      {status === "ready" && places.length === 0 && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          Nenhum lugar encontrado por perto.
        </div>
      )}

      {status === "ready" && places.length > 0 && (
        <div className="space-y-3">
          {places.map((p) => (
            <div
              key={p.place_id}
              className="p-4 rounded-2xl bg-white/10 border border-white/20"
            >
              <div className="font-semibold">{p.name}</div>

              {p.vicinity && (
                <div className="text-sm text-white/70">{p.vicinity}</div>
              )}

              <div className="text-sm text-white/70 mt-2">
                {typeof p.rating === "number" && (
                  <div>
                    ⭐ {p.rating} ({p.user_ratings_total ?? 0} avaliações)
                  </div>
                )}
                {typeof p.open_now === "boolean" && (
                  <div>{p.open_now ? "✅ Aberto agora" : "❌ Fechado agora"}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}