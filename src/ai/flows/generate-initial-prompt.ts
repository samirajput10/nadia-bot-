'use server';

/**
 * @fileOverview This flow generates an initial prompt for the G-Bot.
 *
 * - generateInitialPrompt - A function that returns a canned initial prompt.
 * - GenerateInitialPromptInput - The input type for the generateInitialPrompt function (empty object).
 * - GenerateInitialPromptOutput - The return type for the generateInitialPrompt function (string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPromptInputSchema = z.object({});
export type GenerateInitialPromptInput = z.infer<typeof GenerateInitialPromptInputSchema>;

const GenerateInitialPromptOutputSchema = z.string();
export type GenerateInitialPromptOutput = z.infer<typeof GenerateInitialPromptOutputSchema>;

export async function generateInitialPrompt(
  _input: GenerateInitialPromptInput
): Promise<GenerateInitialPromptOutput> {
  return generateInitialPromptFlow({});
}

const initialPrompt = ai.definePrompt({
  name: 'initialPrompt',
  prompt: `Hello! Try asking me anything, and I will respond with 'G'.`,
});

const generateInitialPromptFlow = ai.defineFlow(
  {
    name: 'generateInitialPromptFlow',
    inputSchema: GenerateInitialPromptInputSchema,
    outputSchema: GenerateInitialPromptOutputSchema,
  },
  async () => {
    return "Hello! Try asking me anything, and I will respond with 'G'.";
  }
);
