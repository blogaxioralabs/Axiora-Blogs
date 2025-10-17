// components/GeminiChatModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { SendHorizonal, Bot, User, LoaderCircle, X, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

// --- Functional logic remains unchanged ---
interface Message {
  role: 'user' | 'model';
  text: string;
}

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogTitle: string;
  blogContext: string;
}

const initialPrompt = (title: string) => 
  `Hello! I'm Axiora AI, your personal guide for this article. What would you like to explore or clarify about **"${title}"**?`;

export function GeminiChatModal({ isOpen, onClose, blogTitle, blogContext }: GeminiChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && isFirstRender.current) {
      setMessages([{ role: 'model', text: initialPrompt(blogTitle) }]);
      isFirstRender.current = false;
    } else if (!isOpen) {
      setTimeout(() => {
        setMessages([]);
        isFirstRender.current = true;
      }, 300);
    }
  }, [isOpen, blogTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: messages
            .filter((msg, index) => !(index === 0 && msg.role === 'model'))
            .map(msg => ({
              role: msg.role,
              parts: [{ text: msg.text }]
            })),
          message: input,
          context: blogContext,
        }),
      });

      if (!response.ok || !response.body) {
         const errorData = await response.json();
         throw new Error(errorData.error || 'API request failed');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let modelResponse = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        modelResponse += decoder.decode(value, { stream: true });
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage) {
                lastMessage.text = modelResponse;
                return [...prev.slice(0, -1), lastMessage];
            }
            return prev;
        });
      }

    } catch (error: any) {
      const errorMessage: Message = { role: 'model', text: `Sorry, an error occurred: ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-3xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 shadow-2xl rounded-2xl border-border/20 bg-background/50 backdrop-blur-xl"
        showCloseButton={false} 
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-gradient-to-br from-primary via-blue-500 to-green-400 rounded-full shadow-lg flex-shrink-0">
                    <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="overflow-hidden">
                    <h2 className="font-bold text-lg text-foreground truncate">Axiora AI</h2>
                    <p className="text-xs text-muted-foreground truncate">
                      Discussing: {blogTitle}
                    </p>
                </div>
            </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground flex-shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex items-start gap-3 w-full',
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                >
                    {msg.role === 'model' && (
                        <div className="bg-card/50 border border-white/10 p-2 rounded-full flex-shrink-0">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                    )}
                    <div className={cn(
                        'prose prose-sm dark:prose-invert max-w-full lg:max-w-[80%] break-words p-3 px-4 rounded-2xl text-sm leading-relaxed',
                        'prose-p:m-0 prose-pre:bg-foreground/5 prose-pre:p-3 prose-pre:rounded-md prose-code:bg-foreground/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-blockquote:border-primary',
                        msg.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-blue-600 text-primary-foreground rounded-br-none shadow-md'
                            : 'bg-card/60 border border-white/10 rounded-bl-none shadow-sm'
                    )}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.text || '...'}
                        </ReactMarkdown>
                    </div>
                    {msg.role === 'user' && (
                        <div className="bg-card/50 border border-white/10 p-2 rounded-full flex-shrink-0">
                            <User className="h-5 w-5 text-secondary-foreground" />
                        </div>
                    )}
                </motion.div>
            ))}
             {isLoading && messages[messages.length - 1]?.role === 'user' && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3"
                 >
                    <div className="bg-card/50 border border-white/10 p-2 rounded-full flex-shrink-0">
                       <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="bg-card/60 border border-white/10 p-3 px-4 rounded-2xl rounded-bl-none flex items-center gap-2 shadow-sm">
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                        <span className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                </motion.div>
            )}
        </div>

        {/* ===== CORRECTED FOOTER / INPUT AREA ===== */}
        <footer className="p-4 border-t border-white/10 bg-transparent">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-card/50 border border-white/10 rounded-full p-1.5 pr-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 resize-none bg-transparent border-0 focus-visible:ring-0 py-2 pl-4 text-base min-h-0"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isLoading}
              style={{ maxHeight: '100px', overflowY: 'auto' }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full shrink-0 w-9 h-9 bg-primary hover:bg-primary/90">
              {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
            </Button>
          </form>
        </footer>
        {/* ========================================= */}
      </DialogContent>
    </Dialog>
  );
}