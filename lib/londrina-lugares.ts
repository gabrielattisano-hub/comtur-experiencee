export type LocalSpot = {
  id: string;
  nome: string;
  tipo: "rua" | "praca" | "museu" | "parque" | "teatro" | "outro";
  cidade: "Londrina";
  // ponto aproximado (serve para "perto de mim")
  lat: number;
  lng: number;

  // conteúdo curto (startup style)
  historiaCurta: string;
  curiosidades: string[];
  dicaFamilia: string;
};

export const LONDRINA_SPOTS: LocalSpot[] = [
  {
    id: "rua-sergipe",
    nome: "Rua Sergipe",
    tipo: "rua",
    cidade: "Londrina",
    lat: -23.3105,
    lng: -51.1627,
    historiaCurta:
      "A Rua Sergipe é uma das vias mais tradicionais de Londrina, conectando áreas centrais e marcando a expansão urbana e comercial da cidade ao longo das décadas.",
    curiosidades: [
      "É uma região com forte presença de comércio e serviços.",
      "Fica perto de pontos de referência do centro e áreas históricas.",
      "É uma rua ‘clássica’ para quem quer sentir a Londrina urbana de verdade.",
    ],
    dicaFamilia:
      "Boa para passeio rápido no centro, com paradas curtas (sorveteria/café) e acesso fácil a outras atrações.",
  },
  {
    id: "bosque-central",
    nome: "Bosque Central (Bosque Marechal Cândido Rondon)",
    tipo: "parque",
    cidade: "Londrina",
    lat: -23.3109,
    lng: -51.1592,
    historiaCurta:
      "O Bosque Central é um dos espaços verdes mais conhecidos da região central, servindo como refúgio urbano e ponto de encontro para caminhadas e lazer.",
    curiosidades: [
      "Área verde no meio da cidade -- ótimo ‘respiro’ no calor.",
      "Ambiente de caminhada leve e descanso.",
    ],
    dicaFamilia:
      "Perfeito para ir com crianças e idosos em horários mais frescos (manhã/tarde).",
  },
  {
    id: "praca-sete",
    nome: "Praça 7 de Setembro",
    tipo: "praca",
    cidade: "Londrina",
    lat: -23.3100,
    lng: -51.1620,
    historiaCurta:
      "Uma das praças centrais mais tradicionais, ligada ao cotidiano do centro e aos encontros clássicos da cidade.",
    curiosidades: [
      "Ponto de passagem e encontro.",
      "Fácil acesso a comércio e cafés por perto.",
    ],
    dicaFamilia:
      "Boa para uma pausa curta no centro, especialmente se estiver passeando pela região.",
  },
];