// app/api/assistente/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { COMTUR_SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";

type InputBody = {
  city?: string;
  country?: string;
  days?: number;
  budget?: "baixo" | "medio" | "alto" | string;
  interests?: string[]; // ex: ["gastronomia", "natureza", "cultura"]
  notes?: string; // qualquer detalhe extra do usuário
};

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function stripCodeFences(s: string) {
  return s
    .replace(/```json/gi, "```")
    .replace(/```/g, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada na Vercel." },
        { status: 500 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as InputBody;

    const city = (body.city || "Londrina").trim();
    const country = (body.country || "Brasil").trim();
    const days = Number.isFinite(body.days) ? Number(body.days) : 1;
    const budget = (body.budget || "medio").toString();
    const interests = Array.isArray(body.interests) ? body.interests : [];
    const notes = (body.notes || "").toString().trim();

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const userPrompt = `
Monte um roteiro para:
- Cidade: ${city}
- País: ${country}
- Duração: ${days} dia(s)
- Orçamento: ${budget}
- Interesses: ${interests.length ? interests.join(", ") : "geral"}
- Observações do usuário: ${notes || "nenhuma"}

IMPORTANTE:
- Evitar crimes/notícias violentas e qualquer conteúdo sensacionalista.
- Entregar no JSON EXATO do formato especificado no system prompt.
`.trim();

    // Chamando OpenAI sem SDK (somente fetch)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: COMTUR_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return Response.json(
        {
          error: "Falha ao chamar OpenAI",
          details: data?.error?.message ?? data,
        },
        { status: 500 }
      );
    }

    const text =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      "";

    const cleaned = stripCodeFences(String(text));
    const parsed = safeJsonParse(cleaned);

    if (!parsed) {
      // fallback: devolve algo válido pra não quebrar o front
      return Response.json(
        {
          error: "A IA não retornou JSON válido.",
          raw: cleaned,
        },
        { status: 502 }
      );
    }

    return Response.json(parsed, { status: 200 });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro inesperado" },
      { status: 500 }
    );
  }
}