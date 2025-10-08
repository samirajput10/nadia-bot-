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
    return 'G';
  }
);

export async function chat(
  input: ChatInput
): Promise<string> {
  return await chatFlow(input);
}
