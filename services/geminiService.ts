import { GoogleGenAI, Chat, GenerateContentResponse, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION, MODEL_NAME } from '../constants';
import { Message, Role, Attachment } from '../types';

let chatSession: Chat | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = () => {
  try {
    const ai = getAiClient();
    chatSession = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly creative for the persona
      },
    });
  } catch (error) {
    console.error("Failed to initialize chat session:", error);
    chatSession = null;
  }
};

export const sendMessageStream = async (
  text: string, 
  attachment: Attachment | undefined,
  history: Message[],
  onChunk: (text: string) => void
): Promise<void> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  try {
    let resultStream;

    // If there is an attachment, we need to structure the content parts
    if (attachment) {
      const parts: Part[] = [];
      
      if (text && text.trim().length > 0) {
        parts.push({ text: text });
      }
      
      parts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data
        }
      });
      
      // Note: When sending images in a chat session, we pass the parts to 'message'.
      // The SDK handles the chat history context.
      resultStream = await chatSession.sendMessageStream({ 
        message: parts 
      });
    } else {
      // Text only
      resultStream = await chatSession.sendMessageStream({ message: text });
    }

    for await (const chunk of resultStream) {
        const responseChunk = chunk as GenerateContentResponse;
        const chunkText = responseChunk.text || '';
        onChunk(chunkText);
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    
    // CRITICAL FIX: If we hit a 500 or internal error, the session might be bricked.
    // Reset it so the user can try again (or next message works).
    chatSession = null;
    
    throw error;
  }
};