
import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerativePart } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateTryOnImage(
  personPart: GenerativePart,
  outfitPart: GenerativePart,
  prompt: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          personPart,
          outfitPart,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart?.inlineData) {
      const base64ImageBytes: string = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
    
    // If no image, check for a text part which might contain a refusal reason.
    const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
    if (textPart?.text) {
        // This gives a more specific error if the model explains itself.
        throw new Error(`Model refused: ${textPart.text}`);
    }

    throw new Error("No image was generated. This can happen due to safety policies or if the request is unclear. Please try using different images.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Check for specific safety-related blocks in the error message itself
        if (error.message.includes('SAFETY') || error.message.toLowerCase().includes('policy')) {
            throw new Error('Image generation was blocked due to safety policies. Please try different images.');
        }
        // Don't re-wrap the error if it's already one of ours
        if (error.message.startsWith('Model refused:') || error.message.startsWith('No image was generated')) {
            throw error;
        }
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
}
