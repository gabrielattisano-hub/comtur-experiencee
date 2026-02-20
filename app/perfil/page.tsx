"use client";

import { useEffect, useState } from "react";

type Preferencias = {
  modoFamilia: boolean;
  orcamento: "baixo" | "medio" | "alto";
  idioma: "pt" | "en" | "es";
};

const KEY = "comtur_preferencias_v1";

function loadPrefs(): Preferencias {
  if (typeof window === "undefined") {
    return { modoFamilia: true, orcamento: "medio", idioma: "pt" };
  }
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { modoFamilia: true, orcamento: "medio", idioma: "pt" };
    const p = JSON.parse(raw);
    return {
      modoFamilia: !!p.modoFamilia,
      orcamento: p.orcamento ?? "medio",
      idioma: p.idioma ?? "pt",
    };
  } catch {
    return { modoFamilia: true, orcamento: "medio", idioma: "pt" };
  }
}

function savePrefs(p: Preferencias) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export default function PerfilPage() {
  const [prefs, setPrefs] = useState<Preferencias>({
    modoFamilia: true,
    orcamento: "medio",
    idioma: "pt",
  });

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  function update(next: Partial<Preferencias>) {
    const novo = { ...prefs, ...next };
    setPrefs(novo);
    savePrefs(novo);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">👤 Perfil</h1>
        <p className="text-white/70 mt-1">
          Preferências para personalizar sua experiência com IA.
        </p>
      </div>

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-white font-semibold">Modo Família</div>
            <div className="text-sm text-white/70">
              Recomendações mais seguras e adequadas para crianças.
            </div>
          </div>

          <button
            onClick={() => update({ modoFamilia: !prefs.modoFamilia })}
            className={`px-4 py-2 rounded-2xl font-semibold ${
              prefs.modoFamilia
                ? "bg-yellow-400 text-slate-900"
                : "bg-white/10 border border-white/20 text-white"
            }`}
          >
            {prefs.modoFamilia ? "Ativado" : "Desativado"}
          </button>
        </div>

        <div>
          <div className="text-white font-semibold mb-2">Orçamento</div>
          <div className="grid grid-cols-3 gap-2">
            {(["baixo", "medio", "alto"] as const).map((o) => (
              <button
                key={o}
                onClick={() => update({ orcamento: o })}
                className={`py-2 rounded-2xl font-semibold ${
                  prefs.orcamento === o
                    ? "bg-white text-blue-900"
                    : "bg-white/10 border border-white/20 text-white"
                }`}
              >
                {o === "baixo" ? "Baixo" : o === "medio" ? "Médio" : "Alto"}
              </button>
            ))}
          </div>
          <div className="text-xs text-white/60 mt-2">
            *Depois vamos usar isso na IA (ex: custo-benefício).
          </div>
        </div>

        <div>
          <div className="text-white font-semibold mb-2">Idioma do app</div>
          <div className="grid grid-cols-3 gap-2">
            {(["pt", "en", "es"] as const).map((i) => (
              <button
                key={i}
                onClick={() => update({ idioma: i })}
                className={`py-2 rounded-2xl font-semibold ${
                  prefs.idioma === i
                    ? "bg-white text-blue-900"
                    : "bg-white/10 border border-white/20 text-white"
                }`}
              >
                {i === "pt" ? "Português" : i === "en" ? "English" : "Español"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h2 className="text-white font-semibold">Login</h2>
        <p className="text-white/70 text-sm mt-1">
          *Placeholder de apresentação. Depois plugamos Supabase/Google login.
        </p>
        <button className="mt-3 w-full bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white">
          🔐 Entrar com Google (em breve)
        </button>
      </div>
    </main>
  );
}