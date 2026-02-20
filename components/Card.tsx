import { theme } from "@/styles/theme";

type CardProps = {
  children: React.ReactNode;
  padding?: number;
};

export default function Card({ children, padding = 20 }: CardProps) {
  return (
    <div
      style={{
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.xl,
        padding,
      }}
    >
      {children}
    </div>
  );
}