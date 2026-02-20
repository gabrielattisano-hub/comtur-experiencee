import type { Metadata } from "next";
import BottomNav from "@/components/BottomNav";
import { theme } from "@/styles/theme";

export const metadata: Metadata = {
  title: "COMTUR Experience",
  description: "Turismo inteligente com IA integrada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          background: theme.colors.background,
          color: theme.colors.text,
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div
          style={{
            maxWidth: 430,
            margin: "0 auto",
            minHeight: "100vh",
            position: "relative",
            paddingBottom: 80,
          }}
        >
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}