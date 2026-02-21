export type Pacote = {
  id: string;
  titulo: string;
  subtitulo?: string;
  duracao?: string; // ex: "2 dias / 1 noite"
  preco?: string; // ex: "R$ 899"
  destaque?: boolean;
  inclui?: string[];
  naoInclui?: string[];
  observacoes?: string;
  imagem?: string; // ex: "/images/hero.jpg" ou "/images/pacotes/xxx.jpg"
  linkWhats?: string; // se quiser apontar para WhatsApp
};

export const pacotesLondrinaFamilias: Pacote[] = [
  {
    id: "ldn-parque-01",
    titulo: "Fim de semana em Londrina (Família)",
    subtitulo: "Roteiro leve com parque + gastronomia + atrações para crianças",
    duracao: "2 dias",
    preco: "Sob consulta",
    destaque: true,
    inclui: [
      "Sugestão de roteiro por períodos (manhã/tarde/noite)",
      "Parques e atrações family-friendly",
      "Lista de restaurantes e cafés",
    ],
    naoInclui: ["Transporte", "Ingressos", "Hospedagem"],
    observacoes:
      "Esse é um pacote DEMO. Você pode ajustar conforme sua operação (hospedagem, traslados, ingressos, etc).",
    imagem: "/images/hero.jpg",
  },
  {
    id: "ldn-gastro-01",
    titulo: "Gastronomia & Passeios (Família)",
    subtitulo: "Opções de restaurantes + lugares tranquilos para ir com crianças",
    duracao: "1 dia",
    preco: "Sob consulta",
    inclui: ["Curadoria de lugares", "Sugestão de horários", "Mapa com pontos"],
    naoInclui: ["Consumo nos locais", "Transporte"],
    imagem: "/images/hero.jpg",
  },
];