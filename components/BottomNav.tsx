"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getFavoritos } from "@/lib/favoritos";

export default function BottomNav() {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState<number>(0);

  function atualizar() {
    try {
      setFavCount(getFavoritos().length);
    } catch {
      setFavCount(0);
    }
  }

  useEffect(() => {
    atualizar();

    // atualiza quando muda de aba ou quando salvar/remover
    const onStorage = () => atualizar();
    window.addEventListener("storage", onStorage);

    // fallback: atualiza a cada troca de rota
    // (pathname muda quando troca de página)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    atualizar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/explorar", label: "Explorar" },
    { href: "/favoritos", label: "Favoritos", badge: favCount },
    { href: "/assistente", label: "IA" },
    { href: "/perfil", label: "Perfil" },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700">
      <nav className="max-w-md mx-auto flex justify-around py-3">
        {navItems.map((item) => {
          const ativo = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-sm transition-all duration-200 ${
                ativo ? "text-blue-400 font-semibold" : "text-gray-400"
              }`}
            >
              {item.label}

              {"badge" in item && typeof item.badge === "number" && item.badge > 0 && (
                <span className="absolute -top-2 -right-3 text-[10px] bg-yellow-400 text-slate-900 font-bold px-2 py-[2px] rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}