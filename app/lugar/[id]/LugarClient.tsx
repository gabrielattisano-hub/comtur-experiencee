"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FavPlace, isFavorito, toggleFavorito } from "@/lib/favoritos";

export default function LugarClient() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    if (!id) return;
    setFavorito(isFavorito(id));
  }, [id]);

  function handleFavorito() {
    if (!id) return;

    const fakePlace: FavPlace = {
      place_id: id,
      name: "Lugar selecionado",
    };

    const updated = toggleFavorito(fakePlace);
    setFavorito(updated.some((p) => p.place_id === id));
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <button
        onClick={() => router.back()}
        className="text-sm underline"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold">Detalhes do Lugar</h1>

      <div className="p-4 border rounded-2xl space-y-3">
        <div>ID: {id}</div>

        <button
          onClick={handleFavorito}
          className="px-4 py-2 rounded-xl border"
        >
          {favorito ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        </button>
      </div>

      <Link href="/" className="text-sm underline">
        Ir para Home
      </Link>
    </main>
  );
}