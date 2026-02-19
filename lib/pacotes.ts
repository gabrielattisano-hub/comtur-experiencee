export type Pacote = {
  titulo: string;
  descricao: string;
  preco: string;
};

export const pacotes: Pacote[] = [
  {
    titulo: "Foz do Iguaçu",
    descricao: "3 dias com hotel + passeio nas cataratas",
    preco: "R$ 1.299",
  },
  {
    titulo: "Olímpia",
    descricao: "2 dias no Thermas dos Laranjais",
    preco: "R$ 899",
  },
  {
    titulo: "Balneário Camboriú",
    descricao: "Final de semana com vista para o mar",
    preco: "R$ 1.499",
  },
];