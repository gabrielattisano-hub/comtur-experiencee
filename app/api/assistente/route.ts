import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getMomentoDoDia() {
  const hora = new Date().getHours();

  if (hora < 6) return "madrugada";
  if (hora < 12) return "manhã";
  if (hora < 18) return "tarde";
  return "noite";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const pergunta = body?.pergunta ?? "";
    const preferencias = body?.preferencias ?? {};
    const localizacao = body?.localizacao ?? null;

    if (!pergunta || typeof pergunta !== "string") {
      return Response.json(
        { error: "Campo 'pergunta' é obrigatório" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OPENAI_API_KEY não configurada" },
        { status: 500 }
      );
    }

    const momento = getMomentoDoDia();

    const contexto = `
Contexto do usuário:
- Momento do dia: ${momento}
- Preferências: ${JSON.stringify(preferencias)}
- Localização: ${
      localizacao
        ? `Lat ${localizacao.lat}, Lng ${localizacao.lng}`
        : "Não informada"
    }

Regras importantes:
- Sempre responder em português.
- Evitar citar crimes, violência ou notícias negativas.
- Focar em experiências positivas e familiares.
- Se for hora de almoço ou jantar, sugerir restaurantes.
- Se for manhã ou tarde, sugerir passeios adequados ao horário.
- Estruturar resposta em tópicos claros.
`;

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "Você é o assistente oficial da COMTUR EXPERIENCE, especialista em turismo familiar.",
        },
        {
          role: "system",
          content: contexto,
        },
        {
          role: "user",
          content: pergunta,
        },
      ],
    });

    return Response.json({
      resposta: response.output_text,
    });
  } catch (err: any) {
    return Response.json(
      { error: err?.message ?? "Erro desconhecido" },
      { status: 500 }
    );
  }
}