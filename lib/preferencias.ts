export type Preferencias = {
  modoFamilia: boolean;
  orcamento: "baixo" | "medio" | "alto";
  idioma: "pt" | "en" | "es";
};

const KEY = "comtur_preferencias_v1";

export function getPreferencias(): Preferencias {
  if (typeof window === "undefined") {
    return { modoFamilia: true, orcamento: "medio", idioma: "pt" };
  }

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { modoFamilia: true, orcamento: "medio", idioma: "pt" };
    const p = JSON.parse(raw);

    return {
      modoFamilia: !!p.modoFamilia,
      orcamento: p.orcamento ?? "medio",
      idioma: p.idioma ?? "pt",
    };
  } catch {
    return { modoFamilia: true, orcamento: "medio", idioma: "pt" };
  }
}