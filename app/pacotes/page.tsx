"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { pacotesLondrinaFamilias } from "@/lib/pacotes";

type CartItem = {
  id: string;
  titulo: string;
  cidade: string;
  dias: number;
  preco: number;
  qtd: number;
};

const CART_KEY = "comtur_cart_v1";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

export default function PacotesPage() {
  const [toast, setToast] = useState<string>("");

  const itensCarrinho = useMemo(() => loadCart(), [toast]);
  const qtdTotal = useMemo(
    () => itensCarrinho.reduce((acc, it) => acc + (it.qtd ?? 0), 0),
    [itensCarrinho]
  );

  function addToCart(p: any) {
    const current = loadCart();

    const exists = current.find((c) => c.id === p.id);
    const next = exists
      ? current.map((c) => (c.id === p.id ? { ...c, qtd: c.qtd + 1 } : c))
      : [
          ...current,
          {
            id: p.id,
            titulo: p.titulo,
            cidade: p.cidade,
            dias: p.dias,
            preco: p.preco,
            qtd: 1,
          } as CartItem,
        ];

    saveCart(next);

    setToast(`✅ Adicionado: ${p.titulo}`);
    setTimeout(() => setToast(""), 1300);
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Pacotes (Famílias) -- Londrina" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">🧳 Pacotes</h1>
              <p className="text-white/70 mt-1">
                Seleção para famílias -- demo para apresentação.
              </p>
            </div>

            <Link
              href="/checkout"
              className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-2xl font-semibold"
            >
              🧾 Checkout ({qtdTotal})
            </Link>
          </div>

          {toast && (
            <div className="mt-3 p-3 rounded-2xl bg-black/30 border border-white/10 text-white">
              {toast}
            </div>
          )}
        </div>

        <div className="grid gap-3">
          {pacotesLondrinaFamilias.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-3xl bg-white/10 border border-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-white font-semibold text-lg truncate">
                    {p.titulo}
                  </div>
                  <div className="text-white/70 text-sm">
                    {p.cidade} • {p.dias} dias • {p.publico}
                  </div>

                  <div className="mt-3 text-white/80 text-sm">
                    {p.descricao}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.destaques.map((d: string) => (
                      <span
                        key={d}
                        className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 text-white font-bold text-lg">
                    {formatBRL(p.preco)}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(p)}
                  className="bg-white text-blue-900 px-4 py-2 rounded-2xl font-semibold"
                >
                  + Carrinho
                </button>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href="/assistente"
                  className="flex-1 text-center bg-white/10 border border-white/20 py-2 rounded-2xl font-semibold text-white"
                >
                  Perguntar IA
                </Link>

                <Link
                  href="/checkout"
                  className="flex-1 text-center bg-yellow-400 text-slate-900 py-2 rounded-2xl font-semibold"
                >
                  Ir para checkout
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/80">
            *Checkout é demo: sem pagamento real. Próximo: login + pedidos.
          </p>
        </div>
      </main>
    </div>
  );
}