"use client";

import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";

export default function PacotesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title="Pacotes" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
          <p className="text-white/90">
            Tela <b>Pacotes</b> criada. Próximo passo: listar os pacotes aqui.
          </p>
        </div>
      </main>
    </div>
  );
}