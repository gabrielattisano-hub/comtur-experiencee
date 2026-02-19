"use client";

import { useRouter } from "next/navigation";
import Topbar from "../../../components/Topbar";
import { pacotes } from "../../../lib/pacotes";

function slugify(titulo: string) {
  return titulo.toLowerCase().trim().replace(/\s+/g, "-");
}

export default function PacoteDetalhe({ params }: { params: { id: string } }) {
  const router = useRouter();

  const pacote = pacotes.find((p) => slugify(p.titulo) === params.id);

  if (!pacote) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
        <Topbar title="Pacote não encontrado" onBack={() => router.back()} />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20">
            Esse pacote não existe.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title={pacote.titulo} onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-white text-blue-900 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{pacote.titulo}</h1>
          <p className="mb-4">{pacote.descricao}</p>
          <p className="text-xl font-semibold">{pacote.preco}</p>

          <button
            onClick={() => alert("Checkout (demo) ✅")}
            className="mt-6 w-full bg-blue-900 text-white py-3 rounded-xl"
          >
            Comprar agora
          </button>
        </div>
      </main>
    </div>
  );
}