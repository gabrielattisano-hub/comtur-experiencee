import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const nome = String(body?.nome ?? "");
    const historiaCurta = String(body?.historiaCurta ?? "");
    const curiosidades = Array.isArray(body?.curiosidades) ? body.curiosidades : [];
    const dicaFamilia = String(body?.dicaFamilia ?? "");

    if (!nome || !historiaCurta) {
      return Response.json(
        { error: "Envie { nome, historiaCurta, curiosidades, dicaFamilia }" },
        { status: 400 }
      );
    }

    const prompt = `
Você é o Guia Local da COMTUR EXPERIENCE.
Responda em português (Brasil).
Evite qualquer menção a crimes, violência, tragédias, acidentes ou notícias.
Foque em história urbana/cultural e curiosidades leves.

Tarefa:
Crie um texto de até 30 segundos de leitura sobre o local, com tom envolvente e familiar.
Formato:
- 1 parágrafo curto
- final com 1 sugestão prática para famílias (criança/idoso)

DADOS:
Nome: ${nome}
História curta: ${historiaCurta}
Curiosidades: ${curiosidades.join(" | ")}
Dica família: ${dicaFamilia}
`.trim();

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: "Você é um guia turístico local." },
        { role: "user", content: prompt },
      ],
    });

    return Response.json({ texto: response.output_text });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido" },
      { status: 500 }
    );
  }
}