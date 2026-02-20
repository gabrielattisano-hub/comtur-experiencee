"use client";

import { theme } from "@/styles/theme";

type TopbarProps = {
  title: string;
  onBack?: () => void;
};

export default function Topbar({ title, onBack }: TopbarProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(15, 23, 42, 0.75)",
        borderBottom: `1px solid ${theme.colors.border}`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "transparent",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: 12,
            padding: "6px 10px",
            cursor: "pointer",
            color: theme.colors.text,
          }}
        >
          ←
        </button>
      )}

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.text,
        }}
      >
        {title}
      </div>
    </div>
  );
}