import BottomNav from "@/components/BottomNav";

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
      <body className="bg-black flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md min-h-screen bg-gradient-to-b from-blue-900 to-slate-950 text-white relative pb-16 transition-all duration-300 ease-in-out shadow-2xl rounded-3xl overflow-hidden">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}