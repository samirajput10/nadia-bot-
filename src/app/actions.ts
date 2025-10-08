'use server';

import { chat } from '@/ai/flows/chat';
import { z } from 'zod';

type Message = { id: string; role: 'user' | 'bot'; text: string };

type ActionState = {
  userMessage?: Message;
  botMessage?: Message;
  error?: string;
};

const MessageSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty.' }),
});

export async function sendMessageAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const validatedFields = MessageSchema.safeParse({
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return { error: 'Message cannot be empty.' };
  }

  const userMessageText = validatedFields.data.message;

  try {
    const botResponseText = await chat({ message: userMessageText });

    return {
      userMessage: {
        id: crypto.randomUUID(),
        role: 'user',
        text: userMessageText,
      },
      botMessage: {
        id: crypto.randomUUID(),
        role: 'bot',
        text: botResponseText,
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
