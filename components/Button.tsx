"use client";

import { theme } from "@/styles/theme";
import { useState } from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  fullWidth?: boolean;
};

export default function Button({
  children,
  onClick,
  href,
  fullWidth = true,
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);

  const style: React.CSSProperties = {
    display: "block",
    width: fullWidth ? "100%" : "auto",
    padding: "18px",
    borderRadius: theme.radius.lg,
    background: theme.colors.primary,
    color: "#fff",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    border: "none",
    transition: "0.15s ease",
    transform: pressed ? "scale(0.97)" : "scale(1)",
    opacity: pressed ? 0.9 : 1,
  };

  const commonProps = {
    style,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
  };

  if (href) {
    return (
      <a href={href} {...commonProps}>
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps} onClick={onClick}>
      {children}
    </button>
  );
}