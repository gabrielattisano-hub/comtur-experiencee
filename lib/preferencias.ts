export type Preferencias = {
  nome: string;
  cidade: string;
  comCriancas: boolean;
};

const KEY = "comtur_preferencias";

export function getPreferencias(): Preferencias | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePreferencias(data: Preferencias) {
  if (typeof window === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(data));
}