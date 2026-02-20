"use client";

import { useEffect, useMemo, useState } from "react";

type Post = {
  id: string;
  createdAt: number;
  texto: string;
  imagemDataUrl?: string; // base64 local
  local?: string;
};

const KEY = "comtur_feed_posts_v1";

function loadPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePosts(posts: Post[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(posts));
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [texto, setTexto] = useState("");
  const [local, setLocal] = useState("Londrina - PR");
  const [imagemDataUrl, setImagemDataUrl] = useState<string | undefined>(
    undefined
  );
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  const total = useMemo(() => posts.length, [posts]);

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // limite simples (demo)
    if (file.size > 3 * 1024 * 1024) {
      alert("Imagem muito grande. Use até 3MB.");
      return;
    }

    setStatus("loading");
    try {
      const b64 = await toBase64(file);
      setImagemDataUrl(b64);
    } finally {
      setStatus("idle");
    }
  }

  function publicar() {
    const t = texto.trim();
    if (!t && !imagemDataUrl) return;

    const novo: Post = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      texto: t || "(sem texto)",
      imagemDataUrl,
      local: local.trim() || "Londrina - PR",
    };

    const next = [novo, ...posts];
    setPosts(next);
    savePosts(next);

    setTexto("");
    setImagemDataUrl(undefined);
  }

  function limpar() {
    if (!confirm("Apagar todos os posts?")) return;
    setPosts([]);
    savePosts([]);
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20">
        <h1 className="text-2xl font-bold text-white">📸 Feed</h1>
        <p className="text-white/70 mt-1">
          Postagem demo (salva no seu aparelho). Total: {total}
        </p>
      </div>

      {/* CRIAR POST */}
      <div className="p-5 rounded-3xl bg-white/10 border border-white/20 space-y-3">
        <div className="text-white font-semibold">Criar post</div>

        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className="w-full p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
          placeholder="Local (ex: Rua Sergipe, Londrina)"
        />

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="w-full min-h-[110px] p-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
          placeholder="Escreva algo (ex: Passeio em família hoje!)"
        />

        <div className="flex items-center gap-3">
          <label className="flex-1 text-center bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold text-white cursor-pointer">
            {status === "loading" ? "Carregando imagem..." : "📷 Adicionar foto"}
            <input
              type="file"
              accept="image/*"
              onChange={onPickImage}
              className="hidden"
            />
          </label>

          <button
            onClick={publicar}
            disabled={(!texto.trim() && !imagemDataUrl) || status === "loading"}
            className="flex-1 bg-white text-blue-900 py-3 rounded-2xl font-semibold disabled:opacity-60"
          >
            Publicar
          </button>
        </div>

        {imagemDataUrl && (
          <div className="rounded-3xl overflow-hidden border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagemDataUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <button
          onClick={limpar}
          className="w-full bg-white/5 border border-white/10 py-3 rounded-2xl font-semibold text-white/80"
        >
          Limpar posts (demo)
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-3">
        {posts.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-3xl bg-white/10 border border-white/20"
          >
            <div className="text-xs text-white/60">
              {new Date(p.createdAt).toLocaleString("pt-BR")} • {p.local}
            </div>

            <div className="mt-2 text-white whitespace-pre-wrap">{p.texto}</div>

            {p.imagemDataUrl && (
              <div className="mt-3 rounded-3xl overflow-hidden border border-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imagemDataUrl}
                  alt="Imagem do post"
                  className="w-full h-56 object-cover"
                />
              </div>
            )}
          </div>
        ))}

        {posts.length === 0 && (
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-white/70">
            Nenhum post ainda. Faça o primeiro 😊
          </div>
        )}
      </div>
    </main>
  );
}