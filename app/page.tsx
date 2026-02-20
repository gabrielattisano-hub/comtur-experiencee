"use client";

import Card from "@/components/Card";
import Button from "@/components/Button";

export default function HomePage() {
  return (
    <main
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* HERO */}
      <Card>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          COMTUR EXPERIENCE
        </div>

        <h1 style={{ fontSize: 26, marginTop: 8 }}>
          Turismo inteligente para famílias
        </h1>

        <p style={{ marginTop: 12, opacity: 0.7 }}>
          Descubra restaurantes, roteiros e experiências com ajuda da IA,
          adaptado ao seu momento e localização.
        </p>
      </Card>

      {/* BOTÕES PRINCIPAIS */}
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
    </main>
  );
}