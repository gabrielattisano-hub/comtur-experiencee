export const dynamic = "force-dynamic";

"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RotaInner() {
  const searchParams = useSearchParams();

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Rota</h1>

      <div className="p-4 rounded-2xl border">
        <div className="text-sm opacity-70">Origem</div>
        <div className="font-semibold">{origin || "--"}</div>
      </div>

      <div className="p-4 rounded-2xl border">
        <div className="text-sm opacity-70">Destino</div>
        <div className="font-semibold">{destination || "--"}</div>
      </div>

      {!origin || !destination ? (
        <div className="p-4 rounded-2xl border bg-yellow-50">
          Informe <b>origin</b> e <b>destination</b> na URL para montar a rota.
          <div className="mt-2 text-sm opacity-70">
            Exemplo: <code>/rota?origin=Londrina&destination=Curitiba</code>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border bg-green-50">
          Pronto ✅ Agora você pode usar esses dados para chamar uma API de rotas
          depois (Google Directions, por exemplo).
        </div>
      )}
    </main>
  );
}

export default function RotaPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando rota...</div>}>
      <RotaInner />
    </Suspense>
  );
}