"use client";

import Link from "next/link";
import Topbar from "@/components/Topbar";
import { pacotesLondrinaFamilias } from "@/lib/pacotes";

export default function PacotesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Topbar title="Pacotes em Londrina (Família)" />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">
          Pacotes especiais para família
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {pacotesLondrinaFamilias.map((pacote) => (
            <Link
              key={pacote.id}
              href={`/pacotes/${pacote.id}`}
              className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 hover:border-zinc-600 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {pacote.titulo}
              </h2>

              {pacote.subtitulo && (
                <p className="text-zinc-400 text-sm mb-3">
                  {pacote.subtitulo}
                </p>
              )}

              <div className="flex gap-4 text-sm text-zinc-300">
                {pacote.duracao && <span>⏱ {pacote.duracao}</span>}
                {pacote.preco && <span>💰 {pacote.preco}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}