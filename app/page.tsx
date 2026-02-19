"use client";

import { useState } from "react";
import Topbar from "../components/Topbar";
import PacoteCard from "../components/PacoteCard";
import { pacotes } from "../lib/pacotes";

type Screen = "home" | "login" | "pacotes";

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

            <div className="grid grid-cols-2 gap-3 mt-6">
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
            </div>
          </main>
        </>
      )}

      {screen === "login" && (
        <>
          <Topbar title="Login" onBack={goHome} />
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
              Tela de login (simulada)
            </div>
          </main>
        </>
      )}

      {screen === "pacotes" && (
        <>
          <Topbar title="Pacotes" onBack={goHome} />

          <main className="max-w-4xl mx-auto px-4 py-8 grid gap-4">
            {pacotes.map((pacote, index) => (
              <PacoteCard
                key={index}
                titulo={pacote.titulo}
                descricao={pacote.descricao}
                preco={pacote.preco}
                onComprar={() => alert("Compra simulada 🚀")}
              />
            ))}
          </main>
        </>
      )}
    </div>
  );
}