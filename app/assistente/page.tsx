"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";

export default function AssistentePage() {
  const router = useRouter();
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);

  async function perguntar() {
    if (!pergunta) return;

    setLoading(true);
    setResposta("");

    try {
      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pergunta }),
      });

      const data = await res.json();

      if (data.error) {
        setResposta("Erro: " + data.error);
      } else {
        setResposta(data.resposta);
      }
    } catch (error) {
      setResposta("Erro ao conectar com o servidor.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Assistente IA" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="p-4 rounded-2xl bg-white text-blue-900 shadow-lg space-y-3">
          <label className="font-semibold">Pergunte algo:</label>

          <textarea
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl border border-gray-200"
            placeholder="Ex: Monte um roteiro de 2 dias em Foz do Iguaçu para família."
          />

          <button
            onClick={perguntar}
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Pensando..." : "Perguntar"}
          </button>
        </div>

        {resposta && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 whitespace-pre-wrap">
            {resposta}
          </div>
        )}
      </main>
    </div>
  );
}