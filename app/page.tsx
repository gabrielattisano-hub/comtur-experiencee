import Link from "next/link";
import Topbar from "../components/Topbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white">
      <Topbar title="COMTUR EXPERIENCE -- Londrina" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Sua viagem, com IA.</h1>

        <p className="text-white/80 mb-8">
          Compre pacotes, explore destinos e receba recomendações inteligentes.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/pacotes"
            className="bg-white text-blue-900 rounded-2xl p-4 font-semibold text-center"
          >
            🧳 Pacotes
          </Link>

          <Link
            href="/assistente"
            className="bg-white/10 border border-white/20 rounded-2xl p-4 font-semibold text-center"
          >
            🤖 Assistente IA
          </Link>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-sm text-white/80">
            *Projeto demo em evolução.
          </p>
        </div>
      </main>
    </div>
  );
}