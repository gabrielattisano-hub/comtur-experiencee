"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar";

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

function saveSession(s: Session) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export default function LoginPage() {
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    setSession(loadSession());
  }, []);

  function entrarGoogleDemo() {
    setStatus("loading");

    const demo: Session = {
      nome: "Usuário Google (demo)",
      email: "usuario.demo@gmail.com",
      createdAt: Date.now(),
      provider: "google-demo",
    };

    saveSession(demo);
    setSession(demo);

    setTimeout(() => {
      setStatus("idle");
      router.push("/perfil");
    }, 500);
  }

  function entrarEmailDemo() {
    const n = nome.trim();
    const e = email.trim();

    if (!n || !e || !e.includes("@")) {
      alert("Preencha nome e um e-mail válido.");
      return;
    }

    setStatus("loading");

    const s: Session = {
      nome: n,
      email: e,
      createdAt: Date.now(),
      provider: "email-demo",
    };

    saveSession(s);
    setSession(s);

    setTimeout(() => {
      setStatus("idle");
      router.push("/perfil");
    }, 500);
  }

  function sair() {
    clearSession();
    setSession(null);
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Login (demo)" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
          <h1 className="text-2xl font-bold text-white">🔐 Entrar</h1>
          <p className="text-white/70 mt-1">
            Demo para apresentação -- sessão salva no aparelho (localStorage).
          </p>
        </div>

        {session ? (
          <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
            <div className="text-white font-semibold">Você já está logado ✅</div>
            <div className="text-white/80 text-sm">
              <b>Nome:</b> {session.nome}
              <br />
              <b>E-mail:</b> {session.email}
            </div>

            <div className="flex gap-2">
              <Link
                href="/perfil"
                className="flex-1 text-center bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold"
              >
                Ir para Perfil
              </Link>

              <button
                onClick={sair}
                className="flex-1 bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white"
              >
                Sair
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={entrarGoogleDemo}
              disabled={status === "loading"}
              className="w-full bg-white text-blue-900 py-3 rounded-2xl font-semibold disabled:opacity-60"
            >
              {status === "loading" ? "Entrando..." : "Entrar com Google (demo)"}
            </button>

            <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
              <div className="text-white font-semibold">Ou entrar com e-mail (demo)</div>

              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
              />

              <button
                onClick={entrarEmailDemo}
                disabled={status === "loading"}
                className="w-full bg-yellow-400 text-slate-900 py-3 rounded-2xl font-semibold disabled:opacity-60"
              >
                Entrar (demo)
              </button>

              <div className="text-xs text-white/60">
                *No futuro: login real com Supabase/Google OAuth.
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}