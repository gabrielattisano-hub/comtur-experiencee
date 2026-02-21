export type Preferencias = {
  nome?: string;
  cidadeBase?: string; // ex: "Londrina"
  estiloViagem?: string; // ex: "Família", "Casal", "Aventura"
  orcamento?: string; // ex: "Econômico", "Médio", "Premium"
  interesses?: string[]; // ex: ["parques", "cafés", "passeios"]
};

const KEY = "comtur_preferencias_v1";

export function getPreferencias(): Preferencias | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Preferencias;
  } catch {
    return null;
  }
}

export function savePreferencias(data: Preferencias): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearPreferencias(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}