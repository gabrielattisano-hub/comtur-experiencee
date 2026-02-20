import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ContextoApp = {
  horaLocal: string;
  periodo: string;
  saudacao: string;
  foco: string;
};

type Lugar = {
  name: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pergunta: string = body?.pergunta ?? "";
    const contexto: ContextoApp | undefined = body?.contexto;
    const lugares: Lugar[] = Array.isArray(body?.lugares)
      ? body.lugares
      : [];

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    if (!pergunta) {
      return Response.json(
        { error: "Campo 'pergunta' é obrigatório." },
        { status: 400 }
      );
    }

    const resumoLugares =
      lugares.length > 0
        ? lugares
            .slice(0, 5)
            .map(
              (l) =>
                `- ${l.name} (nota ${l.rating ?? "-"}, ${
                  l.user_ratings_total ?? 0
                } avaliações)`
            )
            .join("\n")
        : "Nenhum restaurante próximo disponível.";

    const contextoTexto = contexto
      ? `
Horário local: ${contexto.horaLocal}
Período do dia: ${contexto.periodo}
Foco: ${contexto.foco}
`
      : "";

    const prompt = `
Você é o assistente inteligente da COMTUR EXPERIENCE.

Regras:
- Responder em português.
- Focar em famílias.
- Sugerir roteiro por horários quando fizer sentido.
- Nunca mencionar crimes, violência ou notícias negativas.
- Ser objetivo e estratégico.

${contextoTexto}

Restaurantes próximos disponíveis:
${resumoLugares}

Pergunta do usuário:
${pergunta}
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    return Response.json({
      resposta: response.output_text,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido." },
      { status: 500 }
    );
  }
}