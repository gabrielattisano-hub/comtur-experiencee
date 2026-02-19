"use client";

export default function Topbar({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
          >
            ← Voltar
          </button>
        ) : (
          <div className="w-[78px]" />
        )}

        <div className="flex-1 text-center font-semibold">{title}</div>
        <div className="w-[78px]" />
      </div>
    </header>
  );
}