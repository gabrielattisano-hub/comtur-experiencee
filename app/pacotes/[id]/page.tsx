import { notFound } from "next/navigation";
import Topbar from "../../../components/Topbar";
import { pacotes } from "../../../lib/pacotes";

type Props = {
  params: {
    id: string;
  };
};

export default function PacoteDetalhe({ params }: Props) {
  const pacote = pacotes.find(
    (p) => p.titulo.toLowerCase().replace(/\s/g, "-") === params.id
  );

  if (!pacote) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title={pacote.titulo} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="p-6 rounded-2xl bg-white text-blue-900 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">{pacote.titulo}</h1>
          <p className="mb-4">{pacote.descricao}</p>
          <p className="text-xl font-semibold">{pacote.preco}</p>

          <button className="mt-6 w-full bg-blue-900 text-white py-3 rounded-xl">
            Comprar agora
          </button>
        </div>
      </main>
    </div>
  );
}