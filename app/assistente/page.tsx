"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";

type Geo =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "ready"; lat: number; lng: number; at: string }
  | { status: "error"; message: string };

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
};

export default function AssistentePage() {
  const router = useRouter();

  const [geo, setGeo] = useState<Geo>({ status: "idle" });

  const [pergunta, setPergunta] = useState(
    "Estou com minha família em Londrina agora. O que você recomenda perto de mim para almoço?"
  );

  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState("");
  const [erro, setErro] = useState("");

  async function pegarLocalizacao() {
    if (!("geolocation" in navigator)) {
      setGeo({ status: "error", message: "Navegador sem geolocalização." });
      return;
    }

    setGeo({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeo({
          status: "ready",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          at: new Date().toLocaleString("pt-BR"),
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeo({ status: "denied" });
        else setGeo({ status: "error", message: err.message || "Erro na geo." });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  useEffect(() => {
    pegarLocalizacao();
  }, []);

  async function perguntarComContexto() {
    try {
      setLoading(true);
      setErro("");
      setResposta("");

      let lat: number | null = null;
      let lng: number | null = null;

      if (geo.status === "ready") {
        lat = geo.lat;
        lng = geo.lng;
      }

      // 1) Busca lugares (se tiver geo)
      let lugares: Place[] = [];
      if (lat != null && lng != null) {
        const r = await fetch("/api/places", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng, type: "restaurant", radius: 1500 }),
        });
        const d = await r.json();
        if (r.ok && Array.isArray(d?.results)) {
          lugares = d.results.slice(0, 10);
        }
      }

      // 2) Envia para a IA com contexto
      const agora = new Date().toLocaleString("pt-BR");

      const res = await fetch("/api/ai-contexto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta,
          lat,
          lng,
          agora,
          lugares,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data?.error || "Erro ao consultar IA.");
        return;
      }

      setResposta(data?.resposta || "Sem resposta.");
    } catch (e: any) {
      setErro(e?.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Assistente IA" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <div className="font-semibold text-white">
            IA com contexto (localização + horário)
          </div>
          <div className="text-sm text-white/70 mt-1">
            A IA usa sua localização e os lugares próximos para recomendar melhor.
          </div>

          <button
            onClick={pegarLocalizacao}
            className="mt-4 w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold"
          >
            📍 Atualizar localização
          </button>

          {geo.status === "ready" && (
            <div className="text-xs text-white/70 mt-2">
              Localização ok ({geo.lat.toFixed(4)}, {geo.lng.toFixed(4)}) • {geo.at}
            </div>
          )}

          {geo.status === "denied" && (
            <div className="text-xs text-red-200 mt-2">
              Permissão negada. Ative a localização no navegador.
            </div>
          )}

          {geo.status === "error" && (
            <div className="text-xs text-red-200 mt-2">{geo.message}</div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-3">
          <label className="text-sm text-white/80 font-semibold">
            Sua pergunta
          </label>

          <textarea
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            className="w-full min-h-[110px] bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none"
          />

          <button
            onClick={perguntarComContexto}
            disabled={loading}
            className="w-full bg-emerald-400 text-emerald-950 py-3 rounded-2xl font-semibold disabled:opacity-60"
          >
            {loading ? "Pensando..." : "Perguntar com contexto"}
          </button>
        </div>

        {erro && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-100">
            {erro}
          </div>
        )}

        {resposta && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 whitespace-pre-wrap">
            {resposta}
          </div>
        )}
      </main>
    </div>
  );
}