"use client";

import { useEffect, useMemo, useState } from "react";
import Topbar from "@/components/Topbar";
import { addRoteiro } from "@/lib/roteiros";
import { toggleFavorito, isFavorito, FavPlace } from "@/lib/favoritos";

type Localizacao = {
  lat: number;
  lng: number;
};

export default function GuiaLocalPage() {
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null);
  const [resposta, setResposta] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [erro, setErro] = useState("");

  const [toast, setToast] = useState("");

  useEffect(() => {
    pegarLocalizacao();
    // eslint-disable-next-line
  }, []);

  function mostrarToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 1400);
  }

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
        setLocalizacao(null);
        chamarGuia(null, null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  async function chamarGuia(lat: number | null, lng: number | null) {
    try {
      setStatus("loading");

      const res = await fetch("/api/guia-local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const favId = useMemo(() => {
    if (!localizacao) return "guia_londrina_default";
    return `guia_${localizacao.lat.toFixed(4)}_${localizacao.lng.toFixed(4)}`;
  }, [localizacao]);

  const favoritoAgora = useMemo(() => isFavorito(favId), [favId, toast]);

  function salvarComoRoteiro() {
    if (!resposta) {
      mostrarToast("Sem conteúdo para salvar.");
      return;
    }

    const titulo = localizacao
      ? "Guia Local (perto de mim)"
      : "Guia Local (Londrina)";

    addRoteiro({
      titulo,
      cidade: "Londrina PR",
      texto: resposta,
    });

    mostrarToast("✅ Roteiro salvo!");
  }

  function favoritarLocal() {
    const place: FavPlace = {
      place_id: favId,
      name: localizacao
        ? "Guia Local (perto de mim)"
        : "Guia Local (Londrina)",
      vicinity: "Resumo gerado pela IA",
      rating: undefined,
      user_ratings_total: undefined,
      open_now: undefined,
      lat: localizacao?.lat,
      lng: localizacao?.lng,
      maps_url: localizacao
        ? `https://www.google.com/maps?q=${localizacao.lat},${localizacao.lng}`
        : `https://www.google.com/maps?q=${encodeURIComponent("Londrina PR")}`,
    };

    toggleFavorito(place);

    mostrarToast(favoritoAgora ? "⭐ Removido dos favoritos" : "⭐ Adicionado aos favoritos");
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Guia Local Inteligente" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <h1 className="text-2xl font-bold text-white">🧭 Guia Local COMTUR</h1>
          <p className="text-white/70 mt-1">
            Descubra onde você está e o que fazer ao redor com sua família.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={pegarLocalizacao}
              className="bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white"
            >
              📍 Atualizar localização
            </button>

            <button
              onClick={favoritarLocal}
              className={`py-3 rounded-2xl font-semibold ${
                favoritoAgora
                  ? "bg-yellow-400 text-slate-900"
                  : "bg-white text-blue-900"
              }`}
            >
              {favoritoAgora ? "⭐ Favorito" : "☆ Favoritar"}
            </button>
          </div>

          <button
            onClick={salvarComoRoteiro}
            className="mt-2 w-full bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
          >
            💾 Salvar como roteiro
          </button>

          {toast && (
            <div className="mt-3 p-3 rounded-2xl bg-black/30 border border-white/10 text-white">
              {toast}
            </div>
          )}
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
            <div className="text-white whitespace-pre-wrap">{resposta}</div>

            <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-sm">
              Próximo: transformar isso em "Roteiro estruturado" (manhã / tarde /
              noite) e salvar como cards.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}