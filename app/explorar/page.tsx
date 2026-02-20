"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";

type GeoState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "denied" }
  | { status: "error"; message: string }
  | { status: "ready"; lat: number; lng: number; accuracy?: number; at: string };

export default function ExplorarPage() {
  const router = useRouter();
  const [geo, setGeo] = useState<GeoState>({ status: "idle" });

  async function pegarLocalizacao() {
    if (!("geolocation" in navigator)) {
      setGeo({ status: "error", message: "Seu navegador não suporta geolocalização." });
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
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setGeo({ status: "denied" });
        } else {
          setGeo({ status: "error", message: err.message || "Erro ao obter localização." });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  useEffect(() => {
    // opcional: tenta pegar automaticamente ao abrir
    pegarLocalizacao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen">
      <Topbar title="Explorar (Perto de Mim)" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <p className="text-white/90">
            Aqui vamos usar sua localização + horário para sugerir lugares próximos.
          </p>
          <p className="text-white/60 text-sm mt-1">
            (Por enquanto: só capturamos latitude/longitude para provar que funciona.)
          </p>
        </div>

        <button
          onClick={pegarLocalizacao}
          className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold"
        >
          📍 Atualizar localização
        </button>

        {geo.status === "loading" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Obtendo localização...
          </div>
        )}

        {geo.status === "denied" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            <p className="font-semibold">Permissão negada.</p>
            <p className="text-white/70 text-sm mt-1">
              Para funcionar, permita localização no navegador.
            </p>
          </div>
        )}

        {geo.status === "error" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            <p className="font-semibold">Erro:</p>
            <p className="text-white/70 text-sm mt-1">{geo.message}</p>
          </div>
        )}

        {geo.status === "ready" && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-2">
            <div className="text-sm text-white/70">Capturado em: {geo.at}</div>
            <div className="text-white">
              <b>Latitude:</b> {geo.lat}
            </div>
            <div className="text-white">
              <b>Longitude:</b> {geo.lng}
            </div>
            {geo.accuracy != null && (
              <div className="text-sm text-white/70">
                Precisão aprox.: {Math.round(geo.accuracy)}m
              </div>
            )}

            <div className="pt-2 text-sm text-white/70">
              Próximo passo: buscar restaurantes perto (via API de lugares) e pedir a IA para
              recomendar os melhores para o seu momento do dia.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}