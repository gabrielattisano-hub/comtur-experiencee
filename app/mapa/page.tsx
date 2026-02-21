import { Suspense } from "react";
import MapaClient from "./MapaClient";

export const dynamic = "force-dynamic";

export default function MapaPage() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>Carregando mapa...</div>}>
      <MapaClient />
    </Suspense>
  );
}