"use client";

import { useEffect, useMemo, useState } from "react";
import { montarContextoFamilias } from "@/lib/contexto";

type Place = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
};

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

  // Origem padrão (Londrina) -- depois ligamos na geolocalização real
  const coords = useMemo(() => ({ lat: -23.3045, lng: -51.1696 }), []);

  async function carregarRestaurantes() {
    try {
      setLugaresStatus("loading");

      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: coords.lat,
          lng: coords.lng,
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

  useEffect(() => {
    carregarRestaurantes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function enviar() {
    try {
      setStatus("loading");
      setErro("");
      setResposta("");

      const contexto = montarContextoFamilias();

      const res = await fetch("/api/ai-contexto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta,
          contexto,
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
          Pergunte algo e eu recomendarei opções para famílias com base no horário e locais próximos.
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white/10 border border-white/20 space-y-3">
        <textarea
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          placeholder="Ex: Estou com crianças e é hora do almoço. O que você recomenda perto de mim?"
          className="w-full min-h-[110px] p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
        />

        <button
          onClick={enviar}
          disabled={!pergunta || status === "loading"}
          className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold disabled:opacity-60"
        >
          {status === "loading" ? "Pensando..." : "Enviar"}
        </button>

        <div className="text-xs text-white/60">
          Restaurantes carregados:{" "}
          {lugaresStatus === "ready" ? lugares.length : lugaresStatus}
        </div>
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