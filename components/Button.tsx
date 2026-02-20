import { theme } from "@/styles/theme";

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
    transition: "0.2s ease",
  };

  if (href) {
    return (
      <a href={href} style={style}>
        {children}
      </a>
    );
  }

  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
}