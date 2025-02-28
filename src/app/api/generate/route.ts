import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    // 🔥 สมมติว่านี่คือการ Generate จาก AI (แทนที่ด้วย API จริง เช่น OpenAI, Hugging Face)
    const aiGeneratedText = "This is an AI-generated response with many words.";

    return NextResponse.json({ text: aiGeneratedText }, { status: 200 });
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
