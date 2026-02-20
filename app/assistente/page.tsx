"use client";

import { useEffect, useMemo, useState } from "react";
import { montarContextoFamilias } from "@/lib/contexto";
import { getPreferencias } from "@/lib/preferencias";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
};

type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ready"; lat: number; lng: number; accuracy?: number; at: string };

function sugestaoPorHorario(): string {
  const h = new Date().getHours();
  if (h >= 6 && h <= 10) {
    return "Estou com a família e quero uma sugestão de café da manhã perto de mim. Recomende 3 opções com ambiente tranquilo e bom custo-benefício.";
  }
  if (h >= 11 && h <= 14) {
    return "É hora do almoço e estou com crianças. Recomende 3 restaurantes perto de mim com boa avaliação e pratos que agradam família.";
  }
  if (h >= 15 && h <= 18) {
    return "Quero um passeio leve com a família agora à tarde. Sugira 3 ideias perto de mim (parque, praça, atração tranquila).";
  }
  return "Quero uma sugestão para o início da noite com a família. Recomende 3 lugares perto de mim (jantar, sobremesa ou passeio) e explique rapidamente.";
}

export default function AssistentePage() {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [erro, setErro] = useState("");

  const [lugares, setLugares] = useState<Place[]>([]);
  const [lugaresStatus, setLugaresStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  const fallbackCoords = useMemo(() => ({ lat: -23.3045, lng: -51.1696 }), []);

  async function carregarRestaurantes(lat: number, lng: number) {
    try {
      setLugaresStatus("loading");

      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat,
          lng,
          type: "restaurant",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setLugaresStatus("error");
        return;
      }

      setLugares(Array.isArray(data?.results) ? data.results : []);
      setLugaresStatus("ready");
    } catch {
      setLugaresStatus("error");
    }
  }

  async function usarMinhaLocalizacao() {
    if (!("geolocation" in navigator)) {
      setGeo({
        status: "error",
        message: "Seu navegador não suporta geolocalização.",
      });
      return;
    }

    setGeo({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        const at = new Date().toLocaleString("pt-BR");

        setGeo({ status: "ready", lat, lng, accuracy, at });

        carregarRestaurantes(lat, lng);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeo({ status: "denied" });
        } else {
          setGeo({
            status: "error",
            message: err.message || "Erro ao obter localização.",
          });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  useEffect(() => {
    carregarRestaurantes(fallbackCoords.lat, fallbackCoords.lng);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enviar(texto?: string) {
    try {
      const perguntaFinal = (texto ?? pergunta).trim();
      if (!perguntaFinal) return;

      setStatus("loading");
      setErro("");
      setResposta("");

      const contexto = montarContextoFamilias();
      const preferencias = getPreferencias();

      const res = await fetch("/api/ai-contexto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: perguntaFinal,
          contexto,
          preferencias,
          lugares: lugares.slice(0, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErro(data?.error || "Erro ao chamar IA.");
        return;
      }

      setResposta(data?.resposta || "");
      setStatus("ready");
    } catch (e: any) {
      setStatus("error");
      setErro(e?.message || "Erro inesperado.");
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">🤖 Assistente IA</h1>
        <p className="text-white/70 mt-1">
          Sugestões automáticas por horário + recomendações para famílias.
        </p>
      </div>

      {/* Sugestões rápidas */}
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
        <div className="text-white font-semibold">⚡ Sugestões rápidas</div>

        <button
          onClick={() => enviar(sugestaoPorHorario())}
          className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold"
        >
          🎯 Me sugira algo agora (por horário)
        </button>

        <button
          onClick={usarMinhaLocalizacao}
          className="w-full bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white"
        >
          📍 Usar minha localização
        </button>

        {geo.status === "denied" && (
          <div className="text-sm text-white/70">
            Permissão negada. Ative a localização no navegador.
          </div>
        )}
        {geo.status === "error" && (
          <div className="text-sm text-white/70">Erro: {geo.message}</div>
        )}

        <div className="text-xs text-white/60">
          Restaurantes carregados:{" "}
          {lugaresStatus === "ready" ? lugares.length : lugaresStatus}
        </div>
      </div>

      {/* Pergunta manual */}
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
        <div className="text-white font-semibold">✍️ Perguntar manualmente</div>

        <textarea
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex: Estou com crianças e é hora do almoço. O que você recomenda perto de mim?"
          className="w-full min-h-[110px] p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
        />

        <button
          onClick={() => enviar()}
          disabled={!pergunta || status === "loading"}
          className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold disabled:opacity-60"
        >
          {status === "loading" ? "Pensando..." : "Enviar"}
        </button>
      </div>

      {status === "error" && (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/80">
          <b>Erro:</b> {erro}
        </div>
      )}

      {resposta && (
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20 text-white whitespace-pre-wrap">
          {resposta}
        </div>
      )}
    </main>
  );
}