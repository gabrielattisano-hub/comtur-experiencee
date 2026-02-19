"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Topbar from "../../components/Topbar";
import { pacotes } from "../../lib/pacotes";

function slugify(titulo: string) {
  return titulo.toLowerCase().trim().replace(/\s+/g, "-");
}

export default function PacotesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title="Pacotes" onBack={() => router.back()} />

      <main className="max-w-4xl mx-auto px-4 py-8 grid gap-4">
        {pacotes.map((p) => (
          <Link
            key={p.titulo}
            href={`/pacotes/${slugify(p.titulo)}`}
            className="block p-4 rounded-2xl bg-white text-blue-900 shadow-lg"
          >
            <h2 className="font-bold text-lg">{p.titulo}</h2>
            <p className="text-sm">{p.descricao}</p>
            <p className="mt-2 font-semibold">{p.preco}</p>

            <div className="mt-3 inline-block bg-blue-900 text-white px-4 py-2 rounded-xl">
              Ver detalhes
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}