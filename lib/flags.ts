// lib/flags.ts
export const FLAGS = {
  guiaLocal: true,
  favoritos: true,
  pacotes: true,
  iaAssistente: true,
  mapas: true,
  rotas: true,
  imagensPlaces: false, // vamos ligar depois
  monetizacao: false,   // vamos ligar depois
} as const;

export type FlagKey = keyof typeof FLAGS;

export function isEnabled(key: FlagKey) {
  return FLAGS[key] === true;
}