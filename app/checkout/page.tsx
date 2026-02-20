"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  titulo: string;
  cidade: string;
  dias: number;
  preco: number; // em reais
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

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const total = useMemo(() => {
    return items.reduce((acc, it) => acc + it.preco * it.qtd, 0);
  }, [items]);

  function atualizarQtd(id: string, delta: number) {
    const next = items
      .map((it) =>
        it.id === id ? { ...it, qtd: Math.max(1, it.qtd + delta) } : it
      )
      .filter(Boolean);
    setItems(next);
    saveCart(next);
  }

  function remover(id: string) {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    saveCart(next);
  }

  function limparCarrinho() {
    if (!confirm("Limpar carrinho?")) return;
    setItems([]);
    saveCart([]);
  }

  function finalizar() {
    // Checkout DEMO: sem pagamento real
    if (!nome.trim() || !email.trim()) {
      alert("Preencha nome e e-mail.");
      return;
    }
    if (items.length === 0) {
      alert("Carrinho vazio.");
      return;
    }

    setStatus("success");
    setItems([]);
    saveCart([]);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">🧾 Checkout (demo)</h1>
        <p className="text-white/70 mt-1">
          Simulação para apresentação -- sem cobrança real.
        </p>
      </div>

      {status === "success" && (
        <div className="p-5 rounded-3xl bg-green-500/15 border border-green-400/30 text-white">
          <div className="text-lg font-semibold">Compra simulada com sucesso ✅</div>
          <div className="text-white/80 mt-1 text-sm">
            Em um app real, aqui entraria pagamento + emissão + confirmação por e-mail/WhatsApp.
          </div>

          <Link
            href="/pacotes"
            className="mt-4 inline-block bg-white text-blue-900 px-4 py-2 rounded-2xl font-semibold"
          >
            Voltar para Pacotes
          </Link>
        </div>
      )}

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
        <div className="text-white font-semibold">Itens no carrinho</div>

        {items.length === 0 ? (
          <div className="text-white/70 text-sm">
            Carrinho vazio. Vá em{" "}
            <Link className="underline" href="/pacotes">
              Pacotes
            </Link>{" "}
            para adicionar.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="p-4 rounded-2xl bg-black/30 border border-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-white truncate">
                      {it.titulo}
                    </div>
                    <div className="text-sm text-white/70">
                      {it.cidade} • {it.dias} dias
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      {formatBRL(it.preco)} / pacote
                    </div>
                  </div>

                  <button
                    onClick={() => remover(it.id)}
                    className="px-3 py-2 rounded-2xl bg-white/10 border border-white/20 text-white text-sm"
                  >
                    Remover
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => atualizarQtd(it.id, -1)}
                      className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white text-lg"
                    >
                      −
                    </button>
                    <div className="min-w-[40px] text-center font-semibold text-white">
                      {it.qtd}
                    </div>
                    <button
                      onClick={() => atualizarQtd(it.id, 1)}
                      className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-white text-lg"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-semibold text-white">
                    {formatBRL(it.preco * it.qtd)}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/10">
              <div className="text-white/80">Total</div>
              <div className="text-white font-bold text-lg">{formatBRL(total)}</div>
            </div>

            <button
              onClick={limparCarrinho}
              className="w-full bg-white/5 border border-white/10 py-3 rounded-2xl font-semibold text-white/80"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
        <div className="text-white font-semibold">Dados (demo)</div>

        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome completo"
          className="w-full p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="w-full p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
        />

        <button
          onClick={finalizar}
          className="w-full bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
        >
          ✅ Finalizar compra (demo)
        </button>

        <div className="text-xs text-white/60">
          *Em produção: integrar pagamento (Pix/cartão), envio de confirmação e
          painel de pedidos.
        </div>
      </div>
    </main>
  );
}