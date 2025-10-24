
import { GoogleGenAI } from "@google/genai";

// IMPORTANT: Do NOT commit your API key to a public repository.
// The key is sourced from environment variables for security.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  // A check to ensure the API key is available.
  // In a real application, you might handle this more gracefully.
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateEventDescription = async function* (title: string, category: string) {
  if (!apiKey) {
    yield "API Key not configured. Please check the console for instructions.";
    return;
  }
  
  const prompt = `Create a compelling and exciting event description for a college event.
  The event is titled "${title}" and falls under the category of "${category}".
  The description should be around 3-4 sentences long, engaging for students, and highlight the key aspects of such an event.
  Do not use markdown or special formatting. Just provide the plain text description.`;

  try {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating description:", error);
    yield "Sorry, I couldn't generate a description at the moment. Please try again.";
  }
};
