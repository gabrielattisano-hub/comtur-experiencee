"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { getRoteiros, removeRoteiro, clearRoteiros, RoteiroSalvo } from "@/lib/roteiros";

function formatData(ts: number) {
  try {
    return new Date(ts).toLocaleString("pt-BR");
  } catch {
    return "";
  }
}

export default function RoteirosPage() {
  const [roteiros, setRoteiros] = useState<RoteiroSalvo[]>([]);
  const [abertoId, setAbertoId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  function refresh() {
    setRoteiros(getRoteiros());
  }

  useEffect(() => {
    refresh();
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 1400);
  }

  function apagar(id: string) {
    removeRoteiro(id);
    refresh();
    showToast("🗑️ Roteiro removido");
    if (abertoId === id) setAbertoId(null);
  }

  function apagarTudo() {
    clearRoteiros();
    refresh();
    showToast("🧹 Todos os roteiros apagados");
    setAbertoId(null);
  }

  const aberto = roteiros.find((r) => r.id === abertoId) ?? null;

  return (
    <div className="min-h-screen">
      <Topbar title="Roteiros salvos" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white">💾 Roteiros</h1>
              <p className="text-white/70 mt-1">
                Tudo o que você salvou no app (demo).
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                href="/guia-local"
                className="bg-white text-blue-900 px-4 py-2 rounded-2xl font-semibold"
              >
                + Guia Local
              </Link>

              <button
                onClick={apagarTudo}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-2xl font-semibold"
              >
                Limpar
              </button>
            </div>
          </div>

          {toast && (
            <div className="mt-3 p-3 rounded-2xl bg-black/30 border border-white/10 text-white">
              {toast}
            </div>
          )}
        </div>

        {roteiros.length === 0 ? (
          <div className="p-5 rounded-3xl bg-white/10 border border-white/20 text-white/80">
            Nenhum roteiro salvo ainda. Vá no <b>Guia Local</b> e clique em{" "}
            <b>Salvar como roteiro</b>.
          </div>
        ) : (
          <div className="grid gap-3">
            {roteiros.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-3xl bg-white/10 border border-white/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-white font-semibold text-lg truncate">
                      {r.titulo}
                    </div>
                    <div className="text-white/70 text-sm">
                      {r.cidade ?? "--"} • {formatData(r.criadoEm)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setAbertoId((prev) => (prev === r.id ? null : r.id))
                      }
                      className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-2xl font-semibold"
                    >
                      {abertoId === r.id ? "Fechar" : "Abrir"}
                    </button>

                    <button
                      onClick={() => apagar(r.id)}
                      className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-2xl font-semibold"
                    >
                      Apagar
                    </button>
                  </div>
                </div>

                {abertoId === r.id && (
                  <div className="mt-4 p-4 rounded-2xl bg-black/30 border border-white/10 text-white whitespace-pre-wrap">
                    {r.texto}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-sm">
          Próximo: criar "Compartilhar roteiro" (link) e converter texto em cards
          por horários (manhã/tarde/noite).
        </div>
      </main>
    </div>
  );
}