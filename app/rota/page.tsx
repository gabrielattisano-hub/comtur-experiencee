"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Topbar from "../../components/Topbar";

export default function RotaPage() {
  const router = useRouter();
  const params = useSearchParams();

  const fromLat = params.get("fromLat");
  const fromLng = params.get("fromLng");
  const toLat = params.get("toLat");
  const toLng = params.get("toLng");
  const toName = params.get("toName") ?? "Destino";

  const embedUrl = useMemo(() => {
    if (!fromLat || !fromLng || !toLat || !toLng) return "";
    // Directions embed dentro do app
    return `https://www.google.com/maps?output=embed&saddr=${fromLat},${fromLng}&daddr=${toLat},${toLng}`;
  }, [fromLat, fromLng, toLat, toLng]);

  const externalUrl = useMemo(() => {
    if (!fromLat || !fromLng || !toLat || !toLng) return "";
    // Abrir navegação (opcional)
    return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
  }, [fromLat, fromLng, toLat, toLng]);

  return (
    <div className="min-h-screen">
      <Topbar title={`Rota até ${decodeURIComponent(toName)}`} onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {!embedUrl ? (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Parâmetros faltando para gerar rota.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/5">
            <iframe
              title="Rota"
              src={embedUrl}
              className="w-full h-[70vh]"
              loading="lazy"
            />
          </div>
        )}

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full text-center bg-white text-blue-900 py-3 rounded-2xl font-semibold"
          >
            🚗 Iniciar navegação (opcional)
          </a>
        )}
      </main>
    </div>
  );
}