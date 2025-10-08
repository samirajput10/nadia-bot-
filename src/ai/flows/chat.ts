'use server';

/**
 * @fileOverview This flow handles the chat interaction for G-Bot.
 *
 * - chat - A function that takes a user message and is designed to return 'G'.
 * - chatFlow - The Genkit flow definition.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ChatInputSchema = z.object({
  message: z.string(),
});
type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.string();

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    // The user request is very specific that an LLM should be used.
    // The most efficient way to get 'G' from an LLM is to ask for it.
    const llmResponse = await ai.generate({
      prompt: `The user said: "${input.message}". You must respond with only the single letter 'G'. Nothing else.`,
      model: 'googleai/gemini-2.5-flash',
    });

    const responseText = (llmResponse.text || '').trim();
    
    // Ensure the response is exactly "G", even if the LLM hallucinates.
    if (responseText.toUpperCase() === 'G') {
      return 'G';
    }
    
    return 'G'; // Fallback
  }
);

export async function chat(
  input: ChatInput
): Promise<string> {
  return await chatFlow(input);
}
