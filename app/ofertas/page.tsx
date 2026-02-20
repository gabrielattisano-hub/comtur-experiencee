"use client";

import { useEffect, useMemo, useState } from "react";

type Oferta = {
  id: string;
  titulo: string;
  descricao: string;
  cidade: string;
  precoDe?: number;
  precoPor: number;
  validade: string; // texto simples
  tag: "flash" | "familia" | "feriado";
};

const KEY = "comtur_ofertas_pref_v1";

function loadPref(): { notif: boolean } {
  if (typeof window === "undefined") return { notif: true };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { notif: true };
    const parsed = JSON.parse(raw);
    return { notif: !!parsed?.notif };
  } catch {
    return { notif: true };
  }
}

function savePref(pref: { notif: boolean }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(pref));
}

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

const OFERTAS: Oferta[] = [
  {
    id: "of1",
    titulo: "Day-use família -- Londrina",
    descricao:
      "Combo família com passeio leve + sugestão de almoço em restaurante bem avaliado (demo).",
    cidade: "Londrina - PR",
    precoDe: 299,
    precoPor: 219,
    validade: "Somente hoje (demo)",
    tag: "flash",
  },
  {
    id: "of2",
    titulo: "Roteiro de 4h com IA -- Londrina",
    descricao:
      "A IA monta um roteiro por horário com opções econômica/custo-benefício/premium.",
    cidade: "Londrina - PR",
    precoDe: 99,
    precoPor: 59,
    validade: "Semana COMTUR (demo)",
    tag: "familia",
  },
  {
    id: "of3",
    titulo: "Pacote feriado (demo)",
    descricao:
      "Condições especiais para famílias: cancelamento flexível e suporte 24h (demo).",
    cidade: "Londrina - PR",
    precoDe: 899,
    precoPor: 749,
    validade: "Até domingo (demo)",
    tag: "feriado",
  },
];

export default function OfertasPage() {
  const [pref, setPref] = useState({ notif: true });
  const [banner, setBanner] = useState<string>("");

  useEffect(() => {
    setPref(loadPref());
  }, []);

  const total = useMemo(() => OFERTAS.length, []);

  function toggleNotif() {
    const next = { notif: !pref.notif };
    setPref(next);
    savePref(next);
  }

  function simularNotificacao() {
    if (!pref.notif) {
      setBanner("🔕 Notificações desligadas. Ative para receber ofertas.");
      setTimeout(() => setBanner(""), 2000);
      return;
    }
    const pick = OFERTAS[Math.floor(Math.random() * OFERTAS.length)];
    setBanner(`🔔 Oferta: ${pick.titulo} • ${formatBRL(pick.precoPor)}`);
    setTimeout(() => setBanner(""), 3000);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">💥 Ofertas</h1>
        <p className="text-white/70 mt-1">
          Demo de notificações + lista de ofertas (Total: {total})
        </p>
      </div>

      {banner && (
        <div className="p-4 rounded-2xl bg-yellow-400 text-slate-900 font-semibold">
          {banner}
        </div>
      )}

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
        <div className="text-white font-semibold">Notificações (demo)</div>

        <button
          onClick={toggleNotif}
          className={`w-full py-3 rounded-2xl font-semibold ${
            pref.notif
              ? "bg-white text-blue-900"
              : "bg-white/10 border border-white/20 text-white"
          }`}
        >
          {pref.notif ? "🔔 Ligadas" : "🔕 Desligadas"}
        </button>

        <button
          onClick={simularNotificacao}
          className="w-full bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
        >
          Simular notificação agora
        </button>

        <div className="text-xs text-white/60">
          *Em produção: push notifications reais + segmentação por cidade/interesse.
        </div>
      </div>

      <div className="grid gap-3">
        {OFERTAS.map((o) => (
          <div
            key={o.id}
            className="p-5 rounded-3xl bg-white/10 border border-white/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-white font-semibold text-lg truncate">
                  {o.titulo}
                </div>
                <div className="text-white/70 text-sm">
                  {o.cidade} • {o.validade}
                </div>

                <div className="mt-2 text-white/80 text-sm">{o.descricao}</div>

                <div className="mt-3 flex items-center gap-2">
                  {o.precoDe != null && (
                    <div className="text-white/60 line-through text-sm">
                      {formatBRL(o.precoDe)}
                    </div>
                  )}
                  <div className="text-white font-bold text-lg">
                    {formatBRL(o.precoPor)}
                  </div>
                  <span className="px-2 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-white/80">
                    {o.tag}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-white/60">demo</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}