"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* HERO */}
      <section className="p-6 rounded-3xl bg-white/10 border border-white/20">
        <div className="text-xs text-white/70">COMTUR EXPERIENCE • Londrina</div>
        <h1 className="mt-2 text-3xl font-extrabold text-white leading-tight">
          Sua viagem, com IA.
        </h1>
        <p className="mt-2 text-white/70">
          Explore o que está perto, salve favoritos e peça roteiros prontos para famílias.
        </p>

        <div className="mt-5 flex gap-2">
          <Link
            href="/assistente"
            className="flex-1 text-center bg-white text-blue-900 py-3 rounded-2xl font-semibold"
          >
            🤖 Abrir Assistente IA
          </Link>

          <Link
            href="/explorar"
            className="flex-1 text-center bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white"
          >
            📍 Explorar perto de mim
          </Link>
        </div>
      </section>

      {/* CARDS RÁPIDOS */}
      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/pacotes"
          className="p-4 rounded-3xl bg-white/10 border border-white/20"
        >
          <div className="text-2xl">🧳</div>
          <div className="mt-2 font-semibold text-white">Pacotes</div>
          <div className="text-sm text-white/70">
            Comprar e ver ofertas.
          </div>
        </Link>

        <Link
          href="/favoritos"
          className="p-4 rounded-3xl bg-white/10 border border-white/20"
        >
          <div className="text-2xl">⭐</div>
          <div className="mt-2 font-semibold text-white">Favoritos</div>
          <div className="text-sm text-white/70">
            Lugares salvos para depois.
          </div>
        </Link>

        <Link
          href="/mapa"
          className="p-4 rounded-3xl bg-white/10 border border-white/20"
        >
          <div className="text-2xl">🗺️</div>
          <div className="mt-2 font-semibold text-white">Mapa</div>
          <div className="text-sm text-white/70">
            Ver sua região.
          </div>
        </Link>

        <Link
          href="/perfil"
          className="p-4 rounded-3xl bg-white/10 border border-white/20"
        >
          <div className="text-2xl">👤</div>
          <div className="mt-2 font-semibold text-white">Perfil</div>
          <div className="text-sm text-white/70">
            Preferências e idioma.
          </div>
        </Link>
      </section>

      {/* DESTAQUE LONDRINA */}
      <section className="p-6 rounded-3xl bg-white/10 border border-white/20">
        <h2 className="text-white font-semibold">✨ Destaques de Londrina</h2>
        <p className="mt-1 text-sm text-white/70">
          Dica rápida para famílias (demo). Depois vamos puxar isso automaticamente.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="p-4 rounded-3xl bg-black/30 border border-white/10">
            <div className="font-semibold text-white">👨‍👩‍👧‍👦 Lago Igapó</div>
            <div className="text-sm text-white/70 mt-1">
              Caminhada leve, visual bonito e ótima opção para final de tarde com crianças.
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-black/30 border border-white/10">
            <div className="font-semibold text-white">🌳 Jardim Botânico</div>
            <div className="text-sm text-white/70 mt-1">
              Natureza, espaço aberto e passeio tranquilo. Ideal para manhã.
            </div>
          </div>
        </div>
      </section>

      {/* OBS */}
      <section className="p-4 rounded-3xl bg-white/5 border border-white/10">
        <div className="text-xs text-white/70">
          *Demo para apresentação. Sem cobrança real e sem compra final integrada ainda.
        </div>
      </section>
    </main>
  );
}