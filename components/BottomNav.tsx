"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/explorar", label: "Explorar" },
    { href: "/assistente", label: "IA" },
    { href: "/feed", label: "Feed" },
  ];

  return (
    <div className="absolute bottom-0 left-0 w-full bg-slate-900 border-t border-slate-700 flex justify-around py-3">
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm transition-all duration-200 ${
              active ? "text-blue-400 font-semibold" : "text-gray-400"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}