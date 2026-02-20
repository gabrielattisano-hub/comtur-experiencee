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
      href: "/roteiros",
      title: "💾 Roteiros",
      desc: "Roteiros salvos pelo Guia Inteligente.",
      status: "ATIVO",
      badge: "Retenção",
    },
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
      desc: "Itens salvos: lugares e ideias rápidas.",
      status: "ATIVO",
      badge: "Pessoal",
    },
    {
      href: "/mapa",
      title: "🗺️ Mapa",
      desc: "Mapa embutido para navegação rápida.",
      status: "DEMO",
      badge: "Exploração",
    },
    {
      href: "/rota",
      title: "🧭 Rota",
      desc: "Base de rotas (demo).",
      status: "DEMO",
      badge: "Mobilidade",
    },
    {
      href: "/checkout",
      title: "🧾 Checkout",
      desc: "Carrinho + finalização (demo).",
      status: "ATIVO",
      badge: "Vendas",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-6 rounded-3xl bg-white/10 border border-white/20">
        <div className="text-xs text-white/70">COMTUR EXPERIENCE</div>
        <h1 className="text-2xl font-bold text-white mt-1">
          ➕ Central do App
        </h1>
        <p className="text-white/70 mt-2">
          Recursos avançados da plataforma com IA integrada.
        </p>
      </div>

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
                <div className="text-white/70 text-sm mt-1">
                  {it.desc}
                </div>

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

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-sm">
        App pronto para apresentação: IA + Localização + Monetização + Retenção.
      </div>
    </main>
  );
}