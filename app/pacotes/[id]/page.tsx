"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Topbar from "@/components/Topbar";
import { pacotesLondrinaFamilias } from "@/lib/pacotes";

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function PacoteDetalhePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const pacote = useMemo(() => {
    if (!id) return null;

    const byId = pacotesLondrinaFamilias.find((p) => p.id === id);
    if (byId) return byId;

    const bySlug = pacotesLondrinaFamilias.find(
      (p) => slugify(p.titulo) === id
    );

    return bySlug ?? null;
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Topbar title="Detalhe do pacote" />

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <Link href="/pacotes" className="text-sm text-zinc-300 underline">
          ← Voltar para pacotes
        </Link>

        {!pacote ? (
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900">
            <h1 className="text-2xl font-bold mb-2">Pacote não encontrado</h1>
            <p className="text-zinc-400">
              Esse pacote não existe (ou o ID/slug está diferente).
            </p>
          </div>
        ) : (
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
            <h1 className="text-3xl font-bold">{pacote.titulo}</h1>

            {pacote.subtitulo && (
              <p className="text-zinc-400">{pacote.subtitulo}</p>
            )}

            <div className="flex flex-wrap gap-3 text-sm">
              {pacote.duracao && (
                <span className="px-3 py-1 rounded-full bg-zinc-800">
                  ⏱ {pacote.duracao}
                </span>
              )}
              {pacote.preco && (
                <span className="px-3 py-1 rounded-full bg-zinc-800">
                  💰 {pacote.preco}
                </span>
              )}
            </div>

            {pacote.inclui?.length ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">Inclui</h2>
                <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                  {pacote.inclui.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {pacote.naoInclui?.length ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">Não inclui</h2>
                <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                  {pacote.naoInclui.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {pacote.observacoes ? (
              <div className="text-zinc-400 text-sm border-t border-zinc-800 pt-4">
                {pacote.observacoes}
              </div>
            ) : null}

            {pacote.linkWhatsApp ? (
              <a
                href={pacote.linkWhatsApp}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-white text-black px-4 py-2 rounded-lg text-sm font-medium"
              >
                Falar no WhatsApp
              </a>
            ) : (
              <button
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium opacity-60 cursor-not-allowed"
                disabled
              >
                WhatsApp (não configurado)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}