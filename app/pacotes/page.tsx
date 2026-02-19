import Link from "next/link";
import Topbar from "../../components/Topbar";
import { PACOTES } from "../../lib/pacotes";
import PacoteCard from "../../components/PacoteCard";

export default function PacotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title="Pacotes" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Pacotes disponíveis</h1>

          <Link
            href="/"
            className="px-3 py-2 rounded-lg border border-white/20 text-sm bg-white/10"
          >
            ← Voltar
          </Link>
        </div>

        <div className="grid gap-4">
          {PACOTES.map((p) => (
            <PacoteCard key={p.id} pacote={p} />
          ))}
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/80">
            *Compra simulada (demo). Próximo passo: integrar checkout e pagamento.
          </p>
        </div>
      </main>
    </div>
  );
}