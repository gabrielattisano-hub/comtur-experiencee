export const dynamic = "force-dynamic";

"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function RotaInner() {
  const sp = useSearchParams();

  const origin = useMemo(() => sp.get("origin") ?? "", [sp]);
  const destination = useMemo(() => sp.get("destination") ?? "", [sp]);

  const ok = origin.trim().length > 0 && destination.trim().length > 0;

  const externalUrl = useMemo(() => {
    if (!ok) return "";
    return (
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&travelmode=driving`
    );
  }, [ok, origin, destination]);

  // Embed: funciona bem para "visualizar", e o botão abre no Maps externo.
  const embedUrl = useMemo(() => {
    if (!ok) return "";
    return (
      `https://www.google.com/maps?output=embed` +
      `&saddr=${encodeURIComponent(origin)}` +
      `&daddr=${encodeURIComponent(destination)}`
    );
  }, [ok, origin, destination]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">🚗 Rota</h1>
        <p className="text-white/70 mt-1">
          Visualize a rota e abra no Google Maps quando quiser.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
          <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
            <div className="text-white/60 text-xs">Origem</div>
            <div className="text-white font-semibold break-words">
              {origin || "--"}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 border border-white/15">
            <div className="text-white/60 text-xs">Destino</div>
            <div className="text-white font-semibold break-words">
              {destination || "--"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            href="/explorar"
            className="flex-1 text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
          >
            Voltar
          </Link>

          {ok ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center bg-white text-blue-900 py-2 rounded-2xl font-semibold"
            >
              Abrir no Maps
            </a>
          ) : (
            <button
              disabled
              className="flex-1 bg-white/30 text-blue-900 py-2 rounded-2xl font-semibold opacity-60"
            >
              Abrir no Maps
            </button>
          )}
        </div>
      </div>

      {!ok ? (
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/80">
          Faltou <b>origin</b> ou <b>destination</b> na URL.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/5">
          <iframe
            title="Rota"
            src={embedUrl}
            className="w-full h-[70vh]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </main>
  );
}

export default function RotaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-white">Carregando rota...</div>}>
      <RotaInner />
    </Suspense>
  );
}