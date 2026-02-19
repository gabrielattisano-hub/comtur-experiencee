"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const itemClass = (path: string) =>
    `flex flex-col items-center text-xs ${
      pathname === path ? "text-white" : "text-white/60"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-blue-950 border-t border-white/10 py-2">
      <div className="max-w-4xl mx-auto flex justify-around">
        <Link href="/" className={itemClass("/")}>
          🏠
          <span>Home</span>
        </Link>

        <Link href="/pacotes" className={itemClass("/pacotes")}>
          🧳
          <span>Pacotes</span>
        </Link>

        <Link href="/assistente" className={itemClass("/assistente")}>
          🤖
          <span>IA</span>
        </Link>
      </div>
    </nav>
  );
}