import { GoogleGenAI } from "@google/genai";
import { DesignStyle, RoomType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using the specific model requested for image editing capabilities
const MODEL_NAME = 'gemini-2.5-flash-image';

export const renovateRoom = async (
  imageBase64: string,
  roomType: RoomType,
  style: DesignStyle
): Promise<string> => {
  try {
    // Remove the data URL prefix if present (e.g., "data:image/png;base64,")
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';')) || 'image/jpeg';

    const prompt = `
      You are an expert interior architect.
      Task: Redesign this ${roomType} in the "${style.name}" style.
      Style Details: ${style.promptDescription}.
      
      CRITICAL INSTRUCTIONS:
      1. PRESERVE THE EXACT SPATIAL STRUCTURE. Do not move walls, windows, doors, or change the camera angle. The geometry of the room must remain identical to the original image.
      2. APPLY THE STYLE. Change the materials, colors, furniture, lighting, and decor to match the ${style.name} aesthetic perfectly.
      3. REALISM. The output must be a photorealistic image indistinguishable from a real photograph.
      4. LIGHTING. Ensure the lighting is natural and consistent with the scene.
      
      Input Image: The provided image is the base structure.
      Output: A fully rendered renovation.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
            {
                text: prompt
            },
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content generated.");

    const imagePart = parts.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
      return `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
    }

    throw new Error("The model did not return an image.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to renovate image");
  }
};
