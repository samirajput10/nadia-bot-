'use client';

import { generateInitialPrompt } from '@/ai/flows/generate-initial-prompt';
import { sendMessageAction } from '@/app/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Bot, SendHorizonal, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

type Message = {
  id: string;
  role: 'user' | 'bot';
  text: string;
};

const initialState: {
  userMessage?: Message;
  botMessage?: Message;
  error?: string;
} = {};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(sendMessageAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    async function getInitialMessage() {
      const initialMessageText = await generateInitialPrompt({});
      setMessages([
        {
          id: 'initial-message',
          role: 'bot',
          text: initialMessageText,
        },
      ]);
    }
    getInitialMessage();
  }, []);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }

    if (state.userMessage && state.botMessage) {
      setMessages((prev) => [...prev, state.userMessage!, state.botMessage!]);
      formRef.current?.reset();
    }
  }, [state, toast]);

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTop =
        scrollAreaViewportRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto bg-card rounded-xl shadow-2xl h-full max-h-[700px] border">
      <header className="p-4 border-b flex items-center gap-3">
         <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
            <AvatarFallback>
              <Bot />
            </AvatarFallback>
          </Avatar>
        <h1 className="text-xl font-bold font-headline">nadia</h1>
      </header>

      <ScrollArea className="flex-1" viewportRef={scrollAreaViewportRef}>
        <div className="p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-4 animate-in fade-in',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'bot' && (
                <Avatar className="w-8 h-8 bg-secondary text-secondary-foreground">
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'p-3 rounded-lg max-w-[75%] shadow-sm',
                  msg.role === 'user'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                 <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    <User className="h-5 w-5"/>
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card/80 backdrop-blur-sm">
        <form
          ref={formRef}
          action={formAction}
          className="flex items-center gap-2"
        >
          <Input
            name="message"
            placeholder="Ask anything..."
            autoComplete="off"
            required
            className="flex-1"
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="icon"
      disabled={pending}
      aria-label="Send message"
      variant="ghost"
      className="text-accent hover:bg-accent/20"
    >
      {pending ? (
        <div className="h-5 w-5 border-2 border-border border-t-accent rounded-full animate-spin" />
      ) : (
        <SendHorizonal className="h-5 w-5" />
      )}
    </Button>
  );
}
