export type RoteiroSalvo = {
  id: string;
  titulo: string;
  cidade?: string;
  criadoEm: number;
  texto: string; // texto completo gerado pela IA
};

const KEY = "comtur_roteiros_v1";

export function getRoteiros(): RoteiroSalvo[] {
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

export function addRoteiro(roteiro: Omit<RoteiroSalvo, "id" | "criadoEm">) {
  if (typeof window === "undefined") return;

  const current = getRoteiros();
  const novo: RoteiroSalvo = {
    id: `rt_${Date.now()}`,
    criadoEm: Date.now(),
    ...roteiro,
  };

  const next = [novo, ...current];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function removeRoteiro(id: string) {
  if (typeof window === "undefined") return;

  const current = getRoteiros();
  const next = current.filter((r) => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearRoteiros() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}