"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";

type Preferencias = {
  comCriancas?: boolean;
  acessibilidade?: boolean;
  evitarCheio?: boolean;
  obs?: string;
};

type Localizacao = {
  lat: number;
  lng: number;
  accuracy?: number;
};

const PREF_KEY = "comtur_preferencias_v1";

function loadPreferencias(): Preferencias {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default function AssistentePage() {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [erro, setErro] = useState("");

  const [preferencias, setPreferencias] = useState<Preferencias>({});
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null);
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "denied" | "ready" | "error"
  >("idle");

  useEffect(() => {
    setPreferencias(loadPreferencias());
    pegarLocalizacao(); // tenta automaticamente
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pegarLocalizacao() {
    if (!("geolocation" in navigator)) {
      setGeoStatus("error");
      return;
    }

    setGeoStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalizacao({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGeoStatus("ready");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) setGeoStatus("denied");
        else setGeoStatus("error");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  async function enviar() {
    const p = pergunta.trim();
    if (!p) return;

    setStatus("loading");
    setErro("");
    setResposta("");

    try {
      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pergunta: p,
          preferencias,
          localizacao,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErro(data?.error || "Erro ao chamar a IA.");
        return;
      }

      setResposta(data?.resposta || "Sem resposta.");
      setStatus("idle");
    } catch (e: any) {
      setStatus("error");
      setErro(e?.message || "Erro inesperado.");
    }
  }

  function perguntaRapida(texto: string) {
    setPergunta(texto);
    setTimeout(() => enviar(), 50);
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Assistente IA" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <h1 className="text-2xl font-bold text-white">🤖 Assistente COMTUR</h1>
          <p className="text-white/70 mt-1">
            A IA usa <b>preferências</b> + <b>horário</b> + <b>localização</b>{" "}
            (se permitida) para recomendar experiências para famílias.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
              Preferências: {Object.keys(preferencias).length ? "OK" : "vazio"}
            </span>
            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
              Localização:{" "}
              {geoStatus === "ready"
                ? "OK"
                : geoStatus === "denied"
                ? "negada"
                : geoStatus}
            </span>
          </div>

          <button
            onClick={pegarLocalizacao}
            className="mt-3 w-full bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white"
          >
            📍 Atualizar localização
          </button>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() =>
              perguntaRapida(
                "Monte um roteiro de 3 horas para família perto de mim, com almoço e um passeio tranquilo."
              )
            }
            className="bg-white/10 border border-white/20 rounded-2xl p-3 font-semibold text-white text-sm"
          >
            ⏱ Roteiro 3h
          </button>

          <button
            onClick={() =>
              perguntaRapida(
                "Sugira 5 restaurantes bem avaliados para almoço em família e o que pedir em cada um."
              )
            }
            className="bg-white/10 border border-white/20 rounded-2xl p-3 font-semibold text-white text-sm"
          >
            🍽 Almoço
          </button>

          <button
            onClick={() =>
              perguntaRapida(
                "Quero um passeio econômico para hoje com criança, evitando lugares muito cheios."
              )
            }
            className="bg-white/10 border border-white/20 rounded-2xl p-3 font-semibold text-white text-sm"
          >
            💸 Econômico
          </button>

          <button
            onClick={() =>
              perguntaRapida(
                "Crie um roteiro premium em Londrina para família, com experiências marcantes e horários."
              )
            }
            className="bg-white/10 border border-white/20 rounded-2xl p-3 font-semibold text-white text-sm"
          >
            ✨ Premium
          </button>
        </div>

        {/* Input */}
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
          <textarea
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Digite sua pergunta... Ex: Estou na Rua Sergipe e quero um almoço com criança + passeio."
            className="w-full min-h-[120px] p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
          />

          <button
            onClick={enviar}
            disabled={status === "loading"}
            className="w-full bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold disabled:opacity-60"
          >
            {status === "loading" ? "Pensando..." : "Enviar para IA"}
          </button>

          {status === "error" && (
            <div className="p-4 rounded-2xl bg-red-500/20 border border-red-400/30 text-white">
              Erro: {erro}
            </div>
          )}
        </div>

        {/* Resposta */}
        {resposta && (
          <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
            <div className="text-white font-semibold mb-2">Resposta</div>
            <div className="text-white/90 whitespace-pre-wrap">{resposta}</div>
          </div>
        )}
      </main>
    </div>
  );
}