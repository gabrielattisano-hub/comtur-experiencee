"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Topbar from "@/components/Topbar";
import { getPreferencias, savePreferencias } from "@/lib/preferencias";

type Session = {
  nome: string;
  email: string;
  createdAt: number;
  provider: "google-demo" | "email-demo";
};

const SESSION_KEY = "comtur_session_v1";

function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export default function PerfilPage() {
  const [session, setSession] = useState<Session | null>(null);

  const [prefer, setPrefer] = useState(() => getPreferencias());
  const [salvo, setSalvo] = useState("");

  useEffect(() => {
    setSession(loadSession());
  }, []);

  function salvar() {
    savePreferencias(prefer);
    setSalvo("✅ Preferências salvas!");
    setTimeout(() => setSalvo(""), 1200);
  }

  function sair() {
    clearSession();
    setSession(null);
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Perfil" />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <h1 className="text-2xl font-bold text-white">👤 Perfil</h1>
          <p className="text-white/70 mt-1">
            Preferências da família + sessão (demo).
          </p>
        </div>

        {/* Sessão */}
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
          <div className="text-white font-semibold">Sessão</div>

          {session ? (
            <>
              <div className="text-white/80 text-sm">
                <b>Nome:</b> {session.nome}
                <br />
                <b>E-mail:</b> {session.email}
                <br />
                <b>Provider:</b> {session.provider}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={sair}
                  className="flex-1 bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white"
                >
                  Sair
                </button>

                <Link
                  href="/checkout"
                  className="flex-1 text-center bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
                >
                  Meus pedidos (demo)
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-white/70 text-sm">
                Você não está logado ainda.
              </div>

              <Link
                href="/login"
                className="w-full block text-center bg-white text-blue-900 py-3 rounded-2xl font-semibold"
              >
                Entrar
              </Link>

              <div className="text-xs text-white/60">
                *Em produção: login real e histórico de compras.
              </div>
            </>
          )}
        </div>

        {/* Preferências */}
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
          <div className="text-white font-semibold">Preferências da família</div>

          <label className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/30 border border-white/10">
            <div className="text-white/90">Com crianças</div>
            <input
              type="checkbox"
              checked={!!prefer.comCriancas}
              onChange={(e) =>
                setPrefer({ ...prefer, comCriancas: e.target.checked })
              }
            />
          </label>

          <label className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/30 border border-white/10">
            <div className="text-white/90">Acessibilidade</div>
            <input
              type="checkbox"
              checked={!!prefer.acessibilidade}
              onChange={(e) =>
                setPrefer({ ...prefer, acessibilidade: e.target.checked })
              }
            />
          </label>

          <label className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/30 border border-white/10">
            <div className="text-white/90">Evitar lugares muito cheios</div>
            <input
              type="checkbox"
              checked={!!prefer.evitarCheio}
              onChange={(e) =>
                setPrefer({ ...prefer, evitarCheio: e.target.checked })
              }
            />
          </label>

          <label className="block p-3 rounded-2xl bg-black/30 border border-white/10">
            <div className="text-white/70 text-sm mb-2">
              Observações (ex: restrições alimentares)
            </div>
            <input
              value={prefer.obs ?? ""}
              onChange={(e) => setPrefer({ ...prefer, obs: e.target.value })}
              className="w-full p-3 rounded-2xl bg-black/20 border border-white/10 text-white outline-none"
              placeholder="Ex: sem lactose, sem glúten..."
            />
          </label>

          <button
            onClick={salvar}
            className="w-full bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
          >
            Salvar preferências
          </button>

          {salvo && (
            <div className="text-sm text-white/80 p-3 rounded-2xl bg-black/30 border border-white/10">
              {salvo}
            </div>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/80">
            Próximo: "Pedidos" (mock) e notificação de ofertas (demo).
          </p>
        </div>
      </main>
    </div>
  );
}