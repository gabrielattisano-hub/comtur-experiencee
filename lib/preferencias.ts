export type Preferencias = {
  nome?: string;
  cidadeBase?: string; // ex: "Londrina - PR"
  estiloViagem?: "familia" | "casal" | "solo" | "amigos";
  interesses?: string[]; // ex: ["parques", "praia", "gastronomia"]
  orcamento?: "economico" | "medio" | "premium";
};

const KEY = "comtur_preferencias_v1";

/**
 * Lê as preferências do usuário (localStorage).
 * Retorna {} se não existir ou se estiver no servidor.
 */
export function getPreferencias(): Preferencias {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Preferencias) : {};
  } catch {
    return {};
  }
}

/**
 * Salva preferências (merge): mantém o que já existe e atualiza com o que vier.
 */
export function savePreferencias(next: Preferencias): Preferencias {
  if (typeof window === "undefined") return next;
  const current = getPreferencias();
  const merged = { ...current, ...next };
  localStorage.setItem(KEY, JSON.stringify(merged));
  return merged;
}

/**
 * Limpa preferências salvas.
 */
export function clearPreferencias() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}