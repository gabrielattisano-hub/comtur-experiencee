"use client";

import { useState } from "react";
import Topbar from "../components/Topbar";

type Screen = "home" | "login" | "pacotes" | "mapa" | "ia" | "feed";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mensagem, setMensagem] = useState("");

  const goHome = () => {
    setScreen("home");
    setMensagem("");
  };

  const comprar = (pacote: string) => {
    setMensagem(`✅ Compra simulada do pacote: ${pacote}`);
  };

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
                🗺️ Mapa
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
                📸 Feed
              </button>
            </div>
          </main>
        </>
      )}

      {screen === "pacotes" && (
        <>
          <Topbar title="Pacotes" onBack={goHome} />
          <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">

            <div className="p-4 rounded-2xl bg-white text-blue-900 shadow-lg">
              <h2 className="font-bold text-lg">Foz do Iguaçu</h2>
              <p className="text-sm">3 dias • Hotel + Passeios</p>
              <p className="mt-2 font-semibold">R$ 1.299</p>

              <button
                onClick={() => comprar("Foz do Iguaçu")}
                className="mt-3 w-full bg-blue-900 text-white py-2 rounded-xl"
              >
                Comprar agora
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white text-blue-900 shadow-lg">
              <h2 className="font-bold text-lg">Olímpia</h2>
              <p className="text-sm">Thermas + Resort</p>
              <p className="mt-2 font-semibold">R$ 999</p>

              <button
                onClick={() => comprar("Olímpia")}
                className="mt-3 w-full bg-blue-900 text-white py-2 rounded-xl"
              >
                Comprar agora
              </button>
            </div>

            {mensagem && (
              <div className="mt-4 p-4 bg-green-600 rounded-xl text-white">
                {mensagem}
              </div>
            )}

          </main>
        </>
      )}

      {screen !== "home" && screen !== "pacotes" && (
        <>
          <Topbar
            title={
              screen === "login"
                ? "Login"
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