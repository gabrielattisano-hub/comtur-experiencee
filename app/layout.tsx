import BottomNav from "../components/BottomNav";

export const metadata = {
  title: "COMTUR Experience",
  description: "App completo de turismo com IA integrada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="bg-gray-50 text-gray-900 pb-16">
        {/* O Topbar será usado nas páginas individuais */}
        {children}

        {/* Bottom Navigation fixa */}
        <BottomNav />
      </body>
    </html>
  );
}