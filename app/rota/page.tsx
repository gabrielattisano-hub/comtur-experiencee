export const dynamic = "force-dynamic";

"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

function RotaContent() {
  const sp = useSearchParams();

  const origem = useMemo(() => sp.get("origem") ?? "", [sp]);
  const destino = useMemo(() => sp.get("destino") ?? "", [sp]);

  const ok = origem.trim().length > 0 && destino.trim().length > 0;

  if (!ok) {
    return (
      <main style={{ padding: 16 }}>
        <h1>Rota</h1>
        <p>Faltou origem e/ou destino na URL.</p>
        <p style={{ opacity: 0.7 }}>
          Exemplo: ?origem=Av%20X&destino=Rua%20Y
        </p>
      </main>
    );
  }

  const link =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${encodeURIComponent(origem)}` +
    `&destination=${encodeURIComponent(destino)}` +
    `&travelmode=driving`;

  const embed =
    `https://www.google.com/maps?output=embed` +
    `&saddr=${encodeURIComponent(origem)}` +
    `&daddr=${encodeURIComponent(destino)}`;

  return (
    <main style={{ padding: 16 }}>
      <h1 style={{ marginBottom: 8 }}>Rota</h1>

      <p style={{ marginBottom: 12 }}>
        <strong>Origem:</strong> {origem}
        <br />
        <strong>Destino:</strong> {destino}
      </p>

      <div
        style={{
          width: "100%",
          height: "70vh",
          borderRadius: 14,
          overflow: "hidden",
          border: "1px solid #ddd",
          background: "#fff",
        }}
      >
        <iframe
          title="Rota no Google Maps"
          src={embed}
          width="100%"
          height="100%"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #ddd",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Abrir rota no Google Maps (externo)
        </a>
      </div>
    </main>
  );
}

export default function RotaPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: 16 }}>
          <h1>Rota</h1>
          <p>Carregando…</p>
        </main>
      }
    >
      <RotaContent />
    </Suspense>
  );
}