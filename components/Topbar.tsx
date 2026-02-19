"use client";

export default function Topbar({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-blue-950 border-b border-white/10 px-4 py-3 flex items-center justify-between">
      {onBack ? (
        <button
          onClick={onBack}
          className="text-sm text-white/70 hover:text-white"
        >
          ← Voltar
        </button>
      ) : (
        <div className="w-16" />
      )}

      <div className="text-center font-bold tracking-wide">
        ✈️ COMTUR
      </div>

      <div className="w-16 text-right text-xs text-white/50">
        EXP
      </div>
    </header>
  );
}