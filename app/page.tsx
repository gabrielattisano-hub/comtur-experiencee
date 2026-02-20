"use client";

import Card from "@/components/Card";
import Button from "@/components/Button";
import { theme } from "@/styles/theme";

export default function HomePage() {
  return (
    <main
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* HERO PREMIUM */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          borderRadius: theme.radius.xl,
          padding: 28,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          COMTUR EXPERIENCE
        </div>

        <h1 style={{ fontSize: 28, marginTop: 8, lineHeight: 1.2 }}>
          Descubra o melhor da cidade com IA
        </h1>

        <p style={{ marginTop: 14, opacity: 0.9 }}>
          Roteiros inteligentes, restaurantes próximos e experiências
          personalizadas para famílias.
        </p>
      </div>

      {/* AÇÕES */}
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Button href="/explorar">
            📍 Explorar perto de mim
          </Button>

          <Button href="/guia-local">
            🤖 Guia inteligente
          </Button>

          <Button href="/pacotes">
            🎒 Pacotes recomendados
          </Button>

          <Button href="/roteiros">
            💾 Meus roteiros
          </Button>
        </div>
      </Card>
    </main>
  );
}