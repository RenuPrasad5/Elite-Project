import { NextResponse } from 'next/server';

// TODO: When ready to use real AI, import the SDK here
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import OpenAI from 'openai';

export const runtime = 'edge';

// We use a strict JSON schema that the frontend expects
export interface AITradeReviewResponse {
  setupQuality: number; // 1-10
  setupQualityNotes: string;
  mistakes: string[];
  rrAnalysis: string;
  emotionalAnalysis: string;
  actionableAdvice: string;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const notes = formData.get('notes') as string | null;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // --- REAL AI IMPLEMENTATION BLUEPRINT ---
    /*
      // 1. Convert File to Buffer/Base64
      const arrayBuffer = await image.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');
      
      // 2. System Prompt
      const systemPrompt = `You are an elite, institutional trading coach. 
      Analyze the provided trading chart screenshot and the user's notes: "${notes || 'No notes provided'}".
      You MUST return your response as a raw JSON object matching this schema:
      {
        "setupQuality": <number 1-10>,
        "setupQualityNotes": "<string explaining the rating>",
        "mistakes": ["<string>", "<string>"],
        "rrAnalysis": "<string analyzing risk to reward ratio>",
        "emotionalAnalysis": "<string analyzing potential psychological errors>",
        "actionableAdvice": "<string with one clear directive>"
      }`;

      // 3. Call Vision API (e.g. Gemini 1.5 Pro)
      // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      // const result = await model.generateContent([
      //   systemPrompt,
      //   { inlineData: { data: base64Image, mimeType: image.type } }
      // ]);
      // const responseText = result.response.text();
      // const parsedJson = JSON.parse(responseText.replace(/```json|```/g, ''));
      // return NextResponse.json(parsedJson);
    */

    // --- MOCKED RESPONSE FOR UI TESTING ---
    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3500));

    // Analyze notes to give realistic mock responses
    const isFOMO = notes?.toLowerCase().includes('fomo');
    const isRevenge = notes?.toLowerCase().includes('revenge');
    const isFVG = notes?.toLowerCase().includes('fvg');

    const mockResponse: AITradeReviewResponse = {
      setupQuality: isFVG ? 8 : 4,
      setupQualityNotes: isFVG 
        ? "Excellent identification of institutional order flow. The Fair Value Gap (FVG) aligns perfectly with the higher timeframe bias."
        : "Setup appears forced. Price action was chopping in a low-probability consolidation zone prior to your entry.",
      mistakes: [
        isFOMO ? "Entered late due to fear of missing out" : "Slightly premature entry",
        "Stop loss was placed in a high-liquidity sweep zone",
      ],
      rrAnalysis: "Your assumed risk-to-reward was 1:3, but based on the nearest resistance level, the realistic R:R was only 1:1.2.",
      emotionalAnalysis: isRevenge 
        ? "Your notes indicate revenge trading. Trying to win back losses immediately severely clouds judgment and leads to oversized risk."
        : (isFOMO ? "You let emotion dictate your entry timing. The market will always offer another setup." : "Relatively neutral execution, but mechanical discipline wavered near the exit."),
      actionableAdvice: "For the next 3 trades, cut your position size in half and wait for the 5-minute candle to fully close before entering.",
    };

    return NextResponse.json(mockResponse);

  } catch (error: any) {
    console.error('AI Review Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process AI review' }, { status: 500 });
  }
}
