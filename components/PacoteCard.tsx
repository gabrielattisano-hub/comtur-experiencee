type Props = {
  titulo: string;
  descricao: string;
  preco: string;
  onComprar: () => void;
};

export default function PacoteCard({
  titulo,
  descricao,
  preco,
  onComprar,
}: Props) {
  return (
    <div className="p-4 rounded-2xl bg-white text-blue-900 shadow-lg">
      <h2 className="font-bold text-lg">{titulo}</h2>
      <p className="text-sm">{descricao}</p>
      <p className="mt-2 font-semibold">{preco}</p>

      <button
        onClick={onComprar}
        className="mt-3 w-full bg-blue-900 text-white py-2 rounded-xl"
      >
        Comprar agora
      </button>
    </div>
  );
}