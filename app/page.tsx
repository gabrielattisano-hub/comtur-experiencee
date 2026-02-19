"use client";

import { useState } from "react";
import Topbar from "../components/Topbar";

type Screen = "home" | "login" | "pacotes" | "mapa" | "ia" | "feed";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");

  const goHome = () => setScreen("home");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      {screen === "home" && (
        <>
          <Topbar title="COMTUR EXPERIENCE -- Londrina" />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Sua viagem, com IA.</h1>
            <p className="text-white/80 mb-8">
              Compre pacotes, explore o mapa, traduza por voz/imagem e receba recomendações locais.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScreen("login")}
                className="bg-white text-blue-900 rounded-2xl p-4 font-semibold"
              >
                🔐 Login
              </button>

              <button
                onClick={() => setScreen("pacotes")}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold"
              >
                🧳 Pacotes
              </button>

              <button
                onClick={() => setScreen("mapa")}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold"
              >
                🗺️ Mapa & Perto de Mim
              </button>

              <button
                onClick={() => setScreen("ia")}
                className="bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold"
              >
                🤖 Assistente IA
              </button>

              <button
                onClick={() => setScreen("feed")}
                className="col-span-2 bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold"
              >
                📸 Feed (Rede Social)
              </button>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/80">
                *Demo de apresentação: telas simuladas (sem cobrança real).
              </p>
            </div>
          </main>
        </>
      )}

      {screen !== "home" && (
        <>
          <Topbar
            title={
              screen === "login"
                ? "Login"
                : screen === "pacotes"
                ? "Pacotes"
                : screen === "mapa"
                ? "Mapa"
                : screen === "ia"
                ? "Assistente IA"
                : "Feed"
            }
            onBack={goHome}
          />

          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
              <p className="text-white/90">
                Tela <b>{screen}</b> criada. Próximo passo: montar o conteúdo dessa tela.
              </p>
            </div>
          </main>
        </>
      )}
    </div>
  );
}