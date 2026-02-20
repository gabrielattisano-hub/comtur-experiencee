"use client";

import Link from "next/link";
import Topbar from "@/components/Topbar";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Topbar title="COMTUR EXPERIENCE -- Londrina" />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-2">Sua viagem, com IA.</h1>
          <p className="text-white/80">
            Compre pacotes, explore o mapa, receba recomendações por horário e poste no Feed.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/pacotes"
            className="bg-white text-blue-900 rounded-2xl p-4 font-semibold text-center"
          >
            🧳 Pacotes
          </Link>

          <Link
            href="/explorar"
            className="bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold text-center text-white"
          >
            🗺️ Explorar
          </Link>

          <Link
            href="/assistente"
            className="bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold text-center text-white"
          >
            🤖 Assistente IA
          </Link>

          <Link
            href="/feed"
            className="bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold text-center text-white"
          >
            📸 Feed
          </Link>

          <Link
            href="/mapa"
            className="col-span-2 bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold text-center text-white"
          >
            📍 Mapa (embed)
          </Link>

          <Link
            href="/perfil"
            className="col-span-2 bg-yellow-400 text-slate-900 rounded-2xl p-4 font-semibold text-center"
          >
            👤 Perfil (preferências da família)
          </Link>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/80">
            *Demo de apresentação: sem cobrança real. Próximo: deixar o app mais "startup"
            com ícones, onboarding e pacotes com checkout.
          </p>
        </div>
      </main>
    </div>
  );
}