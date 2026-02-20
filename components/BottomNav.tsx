"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "🏠", label: "Início" },
    { href: "/explorar", icon: "🗺️", label: "Explorar" },
    { href: "/assistente", icon: "🤖", label: "IA" },
    { href: "/feed", icon: "📸", label: "Feed" },
    { href: "/perfil", icon: "👤", label: "Perfil" },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 ${
                active ? "text-blue-400" : "text-gray-400"
              }`}
            >
              <div className="text-lg leading-none">{item.icon}</div>
              <div className={`text-[11px] ${active ? "font-semibold" : ""}`}>
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}