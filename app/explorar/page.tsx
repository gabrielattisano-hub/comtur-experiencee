async function buscarRestaurantes(lat: number, lng: number) {
  try {
    setPlacesStatus("loading");
    setPlacesError("");

    const res = await fetch("/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat,
        lng,
        type: "restaurant",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setPlacesStatus("error");
      setPlacesError(data?.error || "Erro ao buscar lugares.");
      return;
    }

    setPlaces(Array.isArray(data?.results) ? data.results : []);
    setPlacesStatus("ready");
  } catch (e: any) {
    setPlacesStatus("error");
    setPlacesError(e?.message || "Erro inesperado.");
  }
}