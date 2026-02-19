"use client";

import { useState } from "react";
import Topbar from "../components/Topbar";

type Screen = "home" | "login" | "pacotes" | "mapa" | "ia" | "feed";

type Pacote = {
  id: number;
  titulo: string;
  descricao: string;
  preco: string;
};

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [mensagem, setMensagem] = useState("");

  const pacotes: Pacote[] = [
    {
      id: 1,
      titulo: "Foz do Iguaçu",
      descricao: "3 dias • Hotel + Passeios",
      preco: "R$ 1.299",
    },
    {
      id: 2,
      titulo: "Olímpia",
      descricao: "Thermas + Resort",
      preco: "R$ 999",
    },
  ];

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

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setScreen("pacotes")}
                className="bg-white text-blue-900 rounded-2xl p-4 font-semibold"
              >
                🧳 Pacotes
              </button>
            </div>
          </main>
        </>
      )}

      {screen === "pacotes" && (
        <>
          <Topbar title="Pacotes" onBack={goHome} />
          <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">

            {pacotes.map((pacote) => (
              <div
                key={pacote.id}
                className="p-4 rounded-2xl bg-white text-blue-900 shadow-lg"
              >
                <h2 className="font-bold text-lg">{pacote.titulo}</h2>
                <p className="text-sm">{pacote.descricao}</p>
                <p className="mt-2 font-semibold">{pacote.preco}</p>

                <button
                  onClick={() => comprar(pacote.titulo)}
                  className="mt-3 w-full bg-blue-900 text-white py-2 rounded-xl"
                >
                  Comprar agora
                </button>
              </div>
            ))}

            {mensagem && (
              <div className="mt-4 p-4 bg-green-600 rounded-xl text-white">
                {mensagem}
              </div>
            )}

          </main>
        </>
      )}
    </div>
  );
}