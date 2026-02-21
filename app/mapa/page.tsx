// app/mapa/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import MapaClient from "./MapaClient";

export default function MapaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Carregando mapa...</div>}>
      <MapaClient />
    </Suspense>
  );
}