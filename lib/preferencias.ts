export type Pacote = {
  id: string;
  titulo: string;
  subtitulo?: string;
  dias?: number;
  inclui?: string[];
  naoInclui?: string[];
  preco?: number; // opcional (modo demo)
  moeda?: "BRL" | "USD";
  imagem?: string; // ex: "/images/hero.jpg"
  destaque?: boolean;
};

/**
 * Lista DEMO: Pacotes para famílias saindo de Londrina (PR)
 * Ajuste os textos/valores como quiser.
 */
export const pacotesLondrinaFamilias: Pacote[] = [
  {
    id: "olimpia-family-3d",
    titulo: "Olímpia (Thermas) -- Família",
    subtitulo: "3 dias / 2 noites • ideal com crianças",
    dias: 3,
    inclui: ["Hospedagem", "Sugestão de roteiro", "Dicas para família"],
    naoInclui: ["Ingressos (quando aplicável)", "Alimentação"],
    moeda: "BRL",
    imagem: "/images/hero.jpg",
    destaque: true,
  },
  {
    id: "foz-family-4d",
    titulo: "Foz do Iguaçu -- Família",
    subtitulo: "4 dias / 3 noites • cataratas + passeios",
    dias: 4,
    inclui: ["Hospedagem", "Sugestão de roteiro", "Dicas de deslocamento"],
    naoInclui: ["Ingressos", "Alimentação"],
    moeda: "BRL",
    imagem: "/images/hero.jpg",
  },
  {
    id: "curitiba-family-2d",
    titulo: "Curitiba -- Família",
    subtitulo: "2 dias • bate-volta estendido",
    dias: 2,
    inclui: ["Roteiro", "Sugestões de restaurantes family-friendly"],
    naoInclui: ["Transporte", "Alimentação"],
    moeda: "BRL",
    imagem: "/images/hero.jpg",
  },
];