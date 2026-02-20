"use client";

import Link from "next/link";

type Item = {
  href: string;
  title: string;
  desc: string;
  status: "ATIVO" | "DEMO";
  badge?: string;
};

export default function MaisPage() {
  const items: Item[] = [
    {
      href: "/ofertas",
      title: "💥 Ofertas",
      desc: "Notificações (demo) + promoções segmentadas por família.",
      status: "DEMO",
      badge: "Monetização",
    },
    {
      href: "/feed",
      title: "📸 Feed",
      desc: "Postagens locais (demo). Inspire outras famílias.",
      status: "DEMO",
      badge: "Comunidade",
    },
    {
      href: "/favoritos",
      title: "⭐ Favoritos",
      desc: "Itens salvos: lugares, rotas e ideias rápidas.",
      status: "ATIVO",
      badge: "Pessoal",
    },
    {
      href: "/mapa",
      title: "🗺️ Mapa",
      desc: "Mapa embutido (Google embed) para navegação rápida.",
      status: "DEMO",
      badge: "Exploração",
    },
    {
      href: "/rota",
      title: "🧭 Rota",
      desc: "Base de rotas (demo) -- pronto para Directions no futuro.",
      status: "DEMO",
      badge: "Mobilidade",
    },
    {
      href: "/checkout",
      title: "🧾 Checkout",
      desc: "Carrinho + finalização (demo) para apresentação.",
      status: "ATIVO",
      badge: "Vendas",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
        <div className="text-xs text-white/70">COMTUR EXPERIENCE</div>
        <h1 className="text-2xl font-bold text-white mt-1">
          ➕ Mais recursos (modo startup)
        </h1>
        <p className="text-white/70 mt-2">
          Um hub com tudo que a família precisa: ofertas, comunidade, mapa,
          favoritos e checkout -- com IA integrada.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/assistente"
            className="text-center bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
          >
            🤖 Abrir Assistente IA
          </Link>
          <Link
            href="/explorar"
            className="text-center bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white"
          >
            🗺️ Perto de mim
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-3">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="p-5 rounded-3xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-white font-semibold text-lg truncate">
                  {it.title}
                </div>
                <div className="text-white/70 text-sm mt-1">{it.desc}</div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
                    {it.status}
                  </span>
                  {it.badge && (
                    <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
                      {it.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-white/70 text-sm">›</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Rodapé */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-sm">
        Próximo upgrade: "Mais" vira um painel com <b>métricas</b> (cliques,
        favoritos, conversão) + <b>ofertas inteligentes</b> por horário/local.
      </div>
    </main>
  );
}