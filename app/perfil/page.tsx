"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import {
  getPreferencias,
  savePreferencias,
  type Preferencias,
} from "@/lib/preferencias";

export default function PerfilPage() {
  const [prefer, setPrefer] = useState<Preferencias>({
    nome: "",
    cidade: "",
    comCriancas: false,
  });

  const [salvo, setSalvo] = useState("");

  useEffect(() => {
    const dados = getPreferencias();
    if (dados) {
      setPrefer(dados);
    }
  }, []);

  function salvar() {
    savePreferencias(prefer);
    setSalvo("✅ Preferências salvas!");
    setTimeout(() => setSalvo(""), 1200);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Topbar title="Meu Perfil" />

      <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Preferências do usuário</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              value={prefer.nome}
              onChange={(e) =>
                setPrefer({ ...prefer, nome: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Cidade</label>
            <input
              type="text"
              value={prefer.cidade}
              onChange={(e) =>
                setPrefer({ ...prefer, cidade: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-700"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={prefer.comCriancas}
              onChange={(e) =>
                setPrefer({ ...prefer, comCriancas: e.target.checked })
              }
            />
            <label>Viajar com crianças</label>
          </div>

          <button
            onClick={salvar}
            className="bg-white text-black px-4 py-2 rounded-lg font-medium"
          >
            Salvar
          </button>

          {salvo && (
            <div className="text-green-400 text-sm">{salvo}</div>
          )}
        </div>
      </div>
    </div>
  );
}