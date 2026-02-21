// app/rota/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import RotaClient from "./RotaClient";

export default function RotaPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando rota...</div>}>
      <RotaClient />
    </Suspense>
  );
}