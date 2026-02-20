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
      {/* HERO PREMIUM COM IMAGEM */}
      <div
        style={{
          position: "relative",
          borderRadius: theme.radius.xl,
          overflow: "hidden",
          minHeight: 210,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        {/* imagem */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/hero.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.1)",
          }}
        />

        {/* overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, rgba(37,99,235,0.92), rgba(30,64,175,0.92))",
          }}
        />

        {/* conteúdo */}
        <div style={{ position: "relative", padding: 26, color: "#fff" }}>
          <div style={{ fontSize: 12, opacity: 0.85 }}>COMTUR EXPERIENCE</div>

          <h1 style={{ fontSize: 28, marginTop: 8, lineHeight: 1.2 }}>
            Descubra o melhor da cidade com IA
          </h1>

          <p style={{ marginTop: 12, opacity: 0.92 }}>
            Roteiros inteligentes, lugares próximos e experiências personalizadas
            para famílias.
          </p>

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              📍 Perto de mim
            </span>

            <span
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              🤖 IA integrada
            </span>

            <span
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.22)",
              }}
            >
              👨‍👩‍👧 Famílias
            </span>
          </div>
        </div>
      </div>

      {/* AÇÕES */}
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Button href="/explorar">📍 Explorar perto de mim</Button>
          <Button href="/guia-local">🤖 Guia inteligente</Button>
          <Button href="/pacotes">🎒 Pacotes recomendados</Button>
          <Button href="/roteiros">💾 Meus roteiros</Button>
        </div>
      </Card>
    </main>
  );
}