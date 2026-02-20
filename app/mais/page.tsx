"use client";

import Link from "next/link";

export default function MaisPage() {
  const items = [
    { href: "/ofertas", title: "💥 Ofertas", desc: "Notificações (demo) + promoções" },
    { href: "/feed", title: "📸 Feed", desc: "Rede social (demo) com posts locais" },
    { href: "/mapa", title: "🗺️ Mapa", desc: "Mapa embutido (Google embed)" },
    { href: "/rota", title: "🧭 Rota", desc: "Base de rotas (demo)" },
    { href: "/favoritos", title: "⭐ Favoritos", desc: "Itens salvos e acesso rápido" },
    { href: "/checkout", title: "🧾 Checkout", desc: "Carrinho + finalização (demo)" },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">➕ Mais</h1>
        <p className="text-white/70 mt-1">
          Acesso rápido às funções do app (demo).
        </p>
      </div>

      <div className="grid gap-3">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="p-5 rounded-3xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
          >
            <div className="text-white font-semibold text-lg">{it.title}</div>
            <div className="text-white/70 text-sm mt-1">{it.desc}</div>
          </Link>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-sm">
        Próximo: colocar "Mais" no BottomNav para liberar espaço e manter o app completo.
      </div>
    </main>
  );
}