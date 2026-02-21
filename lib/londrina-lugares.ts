export type Spot = {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  destaque?: boolean;
};

export const LONDRINA_SPOTS: Spot[] = [
  {
    id: "igapo",
    nome: "Lago Igapó",
    categoria: "Natureza",
    descricao:
      "Cartão postal de Londrina, ideal para caminhada, pedal e pôr do sol.",
    destaque: true,
  },
  {
    id: "jardim-botanico",
    nome: "Jardim Botânico",
    categoria: "Natureza",
    descricao:
      "Ótimo para passeio em família, contato com natureza e fotos.",
  },
  {
    id: "zerão",
    nome: "Zerão",
    categoria: "Esporte",
    descricao:
      "Pista de caminhada e corrida muito popular na cidade.",
  },
  {
    id: "catedral",
    nome: "Catedral Metropolitana",
    categoria: "Cultura",
    descricao:
      "Marco arquitetônico da cidade, localizada no centro.",
  },
];