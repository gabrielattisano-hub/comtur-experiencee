"use client";

import Topbar from "@/components/Topbar";
import { LONDRINA_SPOTS } from "@/lib/londrina-lugares";

export default function GuiaLocalPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Topbar title="Guia Local de Londrina" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">
          Pontos turísticos e experiências
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {LONDRINA_SPOTS.map((spot) => (
            <div
              key={spot.id}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900"
            >
              <h2 className="text-xl font-semibold mb-2">
                {spot.nome}
              </h2>

              <p className="text-sm text-zinc-400 mb-2">
                {spot.categoria}
              </p>

              <p className="text-zinc-300 text-sm">
                {spot.descricao}
              </p>

              {spot.destaque && (
                <div className="mt-3 text-xs text-yellow-400">
                  ⭐ Destaque
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}