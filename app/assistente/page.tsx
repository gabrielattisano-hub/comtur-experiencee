"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";

export default function AssistentePage() {
  const router = useRouter();
  const [pergunta, setPergunta] = useState(
    "Monte um roteiro de 1 dia em Londrina para família com crianças."
  );
  const [resposta, setResposta] = useState<string>("");

  async function perguntar() {
    setResposta("Pensando...");

    // DEMO local (sem API)
    const demo =
      "🧠 COMTUR IA (DEMO) -- Roteiro família em Londrina:\n\n" +
      "Manhã:\n" +
      "• Calçadão de Londrina (passeio leve) + pausa para lanche\n" +
      "• Catedral Metropolitana (parada rápida para foto)\n\n" +
      "Tarde:\n" +
      "• Lago Igapó (caminhada leve + fotos)\n" +
      "• Pausas a cada 60–90 min (banheiro/água)\n\n" +
      "Dica:\n" +
      "• Leve protetor solar, garrafinha e algo para as crianças brincarem.\n";

    // Simula resposta após 800ms
    setTimeout(() => setResposta(demo), 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title="Assistente IA" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <p className="text-white/80 text-sm">
            Este é um modo <b>DEMO</b>. Próximo passo: integrar OpenAI para
            respostas reais.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white text-blue-900 shadow-lg space-y-3">
          <label className="font-semibold">Sua pergunta</label>
          <textarea
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl border border-gray-200"
          />

          <button
            onClick={perguntar}
            className="w-full bg-blue-900 text-white py-3 rounded-xl font-semibold"
          >
            Perguntar
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