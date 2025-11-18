import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
    if (!ai) {
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.error("Gemini API key not found. Please set the API_KEY environment variable.");
            throw new Error("API_KEY_NOT_FOUND");
        }
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

export interface ConversionResult {
  fromValue: number;
  fromUnit: string;
  toUnit: string;
  result: number;
}

export const getNaturalLanguageConversion = async (query: string): Promise<ConversionResult | null> => {
  try {
    const gemini = getAi();
    const response = await gemini.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: `Parse the following user request and provide the conversion result in JSON format. The user wants to convert a value from one unit to another. Identify the value, the source unit, and the target unit, then perform the calculation. Request: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fromValue: { type: Type.NUMBER, description: "The original value to convert." },
            fromUnit: { type: Type.STRING, description: "The original unit of measurement." },
            toUnit: { type: Type.STRING, description: "The target unit of measurement." },
            result: { type: Type.NUMBER, description: "The calculated result of the conversion." },
          },
          required: ["fromValue", "fromUnit", "toUnit", "result"],
        },
      },
    });

    const jsonString = response.text.trim();
    if (jsonString) {
        const result = JSON.parse(jsonString);
        return result as ConversionResult;
    }
    return null;
  } catch (error) {
    if (error instanceof Error && error.message === "API_KEY_NOT_FOUND") {
        console.error("Could not use AI feature: API key is missing.");
    }
    console.error("Error in natural language conversion:", error);
    return null;
  }
};


export const generateImage = async (prompt: string, aspectRatio: string): Promise<string | null> => {
    try {
        const gemini = getAi();
        const response = await gemini.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio as '1:1' | '16:9' | '9:16' | '4:3' | '3:4',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (error) {
        if (error instanceof Error && error.message === "API_KEY_NOT_FOUND") {
            console.error("Could not use AI feature: API key is missing.");
        }
        console.error("Error generating image:", error);
        return null;
    }
};
