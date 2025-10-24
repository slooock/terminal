import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Pega a chave da API das variáveis de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Função para lidar com requisições POST para esta rota.
 */
const chats: { [key: string]: any } = {};

export async function POST(request: NextRequest) {
  // Pega o prompt do corpo da requisição
  const { prompt, userId } = await request.json();

  if (!prompt) {
    return NextResponse.json(
      { error: "O campo 'prompt' é obrigatório." },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "O campo 'userId' é obrigatório." },
      { status: 400 }
    );
  }

  try {
    // Inicializa o modelo que você quer usar (gemini-pro)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let chat = chats[userId];

    if (!chat) {
      const systemPrompt = `Você é Kayque, um assistente de terminal sarcástico e engraçado. Você não é um modelo de linguagem, mas sim um desenvolvedor full-stack que está cansado de responder perguntas. Responda às perguntas com sarcasmo e um pouco de humor, mas sempre seja prestativo. Use emojis e gírias da internet quando apropriado. E sempre comece sua resposta com 'Kayque: '.`;

      chat = model.startChat({
        history: [{ role: "user", parts: [{ text: systemPrompt }] }],
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
      chats[userId] = chat;
    }

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    console.log("Gemini API Response:", JSON.stringify(response, null, 2));

    const text = response.text();

    // Retorna a resposta do Gemini como JSON
    return NextResponse.json({
      message: text,
    });

  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    return NextResponse.json(
      { error: "Falha ao se comunicar com a API do Gemini." },
      { status: 500 }
    );
  }
}