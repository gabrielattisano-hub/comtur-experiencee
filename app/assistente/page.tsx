"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GuiaResponse = {
  city?: string;
  country?: string;
  summary?: string;
  safety_notes?: string[];
  itinerary?: Array<{
    day: number;
    title?: string;
    items: Array<{
      time?: string;
      title: string;
      description?: string;
      neighborhood?: string;
      tips?: string[];
      maps_query?: string;
    }>;
  }>;
  food_suggestions?: Array<{
    title: string;
    description?: string;
    maps_query?: string;
  }>;
  extra_tips?: string[];
};

export default function AssistentePage() {
  const router = useRouter();

  const [city, setCity] = useState("Londrina");
  const [country, setCountry] = useState("Brasil");
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState<"baixo" | "medio" | "alto">("medio");
  const [interestsText, setInterestsText] = useState(
    "gastronomia, cultura, natureza"
  );
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [error, setError] = useState("");
  const [data, setData] = useState<GuiaResponse | null>(null);

  function parseInterests(text: string) {
    return text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  async function gerarGuia() {
    try {
      setStatus("loading");
      setError("");
      setData(null);

      const res = await fetch("/api/assistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          country,
          days,
          budget,
          interests: parseInterests(interestsText),
          notes,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError(json?.error || "Erro ao gerar guia.");
        return;
      }

      setData(json);
      setStatus("ready");
    } catch (e: any) {
      setStatus("error");
      setError(e?.message || "Erro inesperado.");
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={() => router.back()}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "white",
            cursor: "pointer",
          }}
        >
          ← Voltar
        </button>

        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
          Assistente IA (Guia)
        </h1>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.12)",
          background: "white",
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 700 }}>Cidade</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Londrina"
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 700 }}>País</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Ex: Brasil"
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 700 }}>Dias</label>
              <input
                type="number"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 700 }}>Orçamento</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as any)}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                }}
              >
                <option value="baixo">baixo</option>
                <option value="medio">medio</option>
                <option value="alto">alto</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 700 }}>Interesses (separe por vírgula)</label>
            <input
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
              placeholder="Ex: gastronomia, cultura, natureza"
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 700 }}>Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: viagem em família, evitar lugares lotados..."
              rows={3}
              style={{
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            />
          </div>

          <button
            onClick={gerarGuia}
            disabled={status === "loading"}
            style={{
              padding: 14,
              borderRadius: 14,
              border: "none",
              background: "#111827",
              color: "white",
              fontWeight: 800,
              cursor: status === "loading" ? "not-allowed" : "pointer",
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "Gerando..." : "Gerar guia"}
          </button>
        </div>
      </div>

      {status === "error" && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            border: "1px solid rgba(239,68,68,0.35)",
            background: "rgba(239,68,68,0.08)",
            color: "#991b1b",
            fontWeight: 700,
          }}
        >
          Erro: {error}
        </div>
      )}

      {status === "ready" && data && (
        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "white",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {data.city || city} • {data.country || country}
            </h2>
            {data.summary && <p style={{ marginBottom: 0 }}>{data.summary}</p>}
          </div>

          {Array.isArray(data.safety_notes) && data.safety_notes.length > 0 && (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Notas de segurança</h3>
              <ul style={{ marginBottom: 0 }}>
                {data.safety_notes.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          {Array.isArray(data.itinerary) && data.itinerary.length > 0 && (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Roteiro</h3>

              {data.itinerary.map((dayBlock) => (
                <div key={dayBlock.day} style={{ marginTop: 14 }}>
                  <h4 style={{ margin: "8px 0" }}>
                    Dia {dayBlock.day} {dayBlock.title ? `-- ${dayBlock.title}` : ""}
                  </h4>

                  <div style={{ display: "grid", gap: 10 }}>
                    {dayBlock.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 12,
                          borderRadius: 14,
                          border: "1px solid rgba(0,0,0,0.12)",
                          background: "rgba(17,24,39,0.03)",
                        }}
                      >
                        <div style={{ fontWeight: 900 }}>
                          {item.time ? `${item.time} • ` : ""}
                          {item.title}
                        </div>

                        {item.description && (
                          <div style={{ marginTop: 6, opacity: 0.85 }}>
                            {item.description}
                          </div>
                        )}

                        {item.neighborhood && (
                          <div style={{ marginTop: 6, fontSize: 13, opacity: 0.75 }}>
                            📍 {item.neighborhood}
                          </div>
                        )}

                        {Array.isArray(item.tips) && item.tips.length > 0 && (
                          <ul style={{ marginTop: 8, marginBottom: 0 }}>
                            {item.tips.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        )}

                        {item.maps_query && (
                          <div style={{ marginTop: 10 }}>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                item.maps_query
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontWeight: 800 }}
                            >
                              Abrir no Google Maps →
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(data.food_suggestions) && data.food_suggestions.length > 0 && (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Sugestões de comida</h3>
              <div style={{ display: "grid", gap: 10 }}>
                {data.food_suggestions.map((f, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(0,0,0,0.12)",
                    }}
                  >
                    <div style={{ fontWeight: 900 }}>{f.title}</div>
                    {f.description && (
                      <div style={{ marginTop: 6, opacity: 0.85 }}>{f.description}</div>
                    )}
                    {f.maps_query && (
                      <div style={{ marginTop: 10 }}>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            f.maps_query
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontWeight: 800 }}
                        >
                          Ver no Maps →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(data.extra_tips) && data.extra_tips.length > 0 && (
            <div
              style={{
                padding: 16,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Dicas extras</h3>
              <ul style={{ marginBottom: 0 }}>
                {data.extra_tips.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}