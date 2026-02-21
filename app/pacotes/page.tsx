"use client";

import Link from "next/link";
import Topbar from "@/components/Topbar";
import { pacotesLondrinaFamilias } from "@/lib/pacotes";

export default function PacotesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Topbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">
          Pacotes para Famílias -- Londrina
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {pacotesLondrinaFamilias.map((pacote) => (
            <div
              key={pacote.id}
              className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-zinc-600 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {pacote.titulo}
              </h2>

              {pacote.subtitulo && (
                <p className="text-zinc-400 mb-3">
                  {pacote.subtitulo}
                </p>
              )}

              {pacote.duracao && (
                <p className="text-sm text-zinc-500 mb-2">
                  Duração: {pacote.duracao}
                </p>
              )}

              {pacote.preco && (
                <p className="text-green-400 font-medium mb-4">
                  {pacote.preco}
                </p>
              )}

              <div className="flex gap-3 mt-4">
                <Link
                  href={`/pacotes/${pacote.id}`}
                  className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition"
                >
                  Ver detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}