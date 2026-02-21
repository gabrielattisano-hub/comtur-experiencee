type Props = {
  titulo: string;
  descricao?: string;
  preco?: string;
  onComprar?: () => void;
};

export default function PacoteCard({
  titulo,
  descricao,
  preco,
  onComprar,
}: Props) {
  return (
    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-3">
      <h2 className="text-xl font-semibold">{titulo}</h2>

      {descricao && (
        <p className="text-zinc-400 text-sm">{descricao}</p>
      )}

      {preco && (
        <p className="text-zinc-300 text-sm font-medium">
          💰 {preco}
        </p>
      )}

      {onComprar && (
        <button
          onClick={onComprar}
          className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium"
        >
          Comprar
        </button>
      )}
    </div>
  );
}