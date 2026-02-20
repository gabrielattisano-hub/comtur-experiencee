"use client";

import Link from "next/link";
import Card from "@/components/Card";
import { theme } from "@/styles/theme";

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
      <Link href="/explorar" style={buttonStyle}>
        📍 Explorar perto de mim
      </Link>

      <Link href="/guia-local" style={buttonStyle}>
        🤖 Guia inteligente
      </Link>

      <Link href="/pacotes" style={buttonStyle}>
        🎒 Pacotes recomendados
      </Link>

      <Link href="/roteiros" style={buttonStyle}>
        💾 Meus roteiros
      </Link>
    </main>
  );
}

const buttonStyle: React.CSSProperties = {
  display: "block",
  padding: "18px",
  borderRadius: theme.radius.lg,
  background: theme.colors.primary,
  color: "#fff",
  textDecoration: "none",
  textAlign: "center",
  fontWeight: 600,
  fontSize: 16,
};