"use client";

import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";
import PacoteCard from "../../components/PacoteCard";
import { pacotes } from "../../lib/pacotes";

export default function PacotesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title="Pacotes" onBack={() => router.back()} />

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
    </div>
  );
}