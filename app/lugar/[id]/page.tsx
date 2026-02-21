import { Suspense } from "react";
import LugarClient from "./LugarClient";

export const dynamic = "force-dynamic";

export default function LugarPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Carregando lugar...</div>}>
      <LugarClient />
    </Suspense>
  );
}