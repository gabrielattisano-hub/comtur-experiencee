"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";

type Localizacao = {
  lat: number;
  lng: number;
};

export default function GuiaLocalPage() {
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null);
  const [resposta, setResposta] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [erro, setErro] = useState("");

  useEffect(() => {
    pegarLocalizacao();
    // eslint-disable-next-line
  }, []);

  function pegarLocalizacao() {
    if (!("geolocation" in navigator)) {
      setErro("Geolocalização não suportada.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setLocalizacao({ lat, lng });
        chamarGuia(lat, lng);
      },
      () => {
        // fallback para cidade padrão
        chamarGuia(null, null);
      }
    );
  }

  async function chamarGuia(lat: number | null, lng: number | null) {
    try {
      setStatus("loading");

      const res = await fetch("/api/guia-local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat,
          lng,
          cidade: "Londrina PR",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data?.error || "Erro ao chamar guia.");
        setStatus("error");
        return;
      }

      setResposta(data?.resposta || "Sem resposta.");
      setStatus("ready");
    } catch (e: any) {
      setErro(e?.message || "Erro inesperado.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Guia Local Inteligente" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <h1 className="text-2xl font-bold text-white">
            🧭 Guia Local COMTUR
          </h1>
          <p className="text-white/70 mt-1">
            Descubra onde você está e o que fazer ao redor com sua família.
          </p>

          <button
            onClick={pegarLocalizacao}
            className="mt-4 w-full bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
          >
            📍 Atualizar localização
          </button>
        </div>

        {status === "loading" && (
          <div className="p-5 rounded-3xl bg-white/10 border border-white/20 text-white">
            Carregando informações do local...
          </div>
        )}

        {status === "error" && (
          <div className="p-5 rounded-3xl bg-red-500/20 border border-red-400/30 text-white">
            Erro: {erro}
          </div>
        )}

        {status === "ready" && (
          <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
            <div className="text-white whitespace-pre-wrap">
              {resposta}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}