export type FavPlace = {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  user_ratings_total?: number;
  open_now?: boolean;
  lat?: number;
  lng?: number;
  maps_url?: string;
  photo_url?: string;
};

const KEY = "comtur_favoritos_v1";

export function getFavoritos(): FavPlace[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorito(placeId: string): boolean {
  return getFavoritos().some((p) => p.place_id === placeId);
}

export function toggleFavorito(place: FavPlace): FavPlace[] {
  const current = getFavoritos();
  const exists = current.some((p) => p.place_id === place.place_id);

  const next = exists
    ? current.filter((p) => p.place_id !== place.place_id)
    : [place, ...current];

  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearFavoritos() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}