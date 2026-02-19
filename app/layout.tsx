import Topbar from "@/components/Topbar";

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
      <body className="bg-gray-50 text-gray-900">
        <Topbar />
        {children}
      </body>
    </html>
  );
}