"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/styles/theme";

type Item = {
  href: string;
  label: string;
  icon: string;
};

export default function BottomNav() {
  const pathname = usePathname();

  const items: Item[] = [
    { href: "/", label: "Início", icon: "🏠" },
    { href: "/explorar", label: "Explorar", icon: "📍" },
    { href: "/assistente", label: "IA", icon: "🤖" },
    { href: "/mais", label: "Mais", icon: "➕" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 14,
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 430,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 12px",
          borderRadius: 999,
          background: "rgba(15, 23, 42, 0.75)",
          border: `1px solid ${theme.colors.border}`,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        }}
      >
        {items.map((it) => {
          const active =
            pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));

          return (
            <Link
              key={it.href}
              href={it.href}
              style={{
                flex: 1,
                textDecoration: "none",
                color: active ? "#fff" : "rgba(255,255,255,0.7)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "8px 6px",
                borderRadius: 14,
                transition: "0.15s ease",
                background: active ? "rgba(37, 99, 235, 0.25)" : "transparent",
                border: active ? "1px solid rgba(37, 99, 235, 0.35)" : "1px solid transparent",
              }}
            >
              <div style={{ fontSize: 18, lineHeight: 1 }}>{it.icon}</div>
              <div style={{ fontSize: 11, fontWeight: active ? 700 : 600 }}>
                {it.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}