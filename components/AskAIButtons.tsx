// components/AskAIButtons.tsx
'use client';

import { useState } from 'react'; // <-- useState import කරගන්න
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { SiGooglegemini, SiOpenai } from 'react-icons/si';
import { GeminiChatModal } from './GeminiChatModal'; // <-- අලුත් component එක import කරගන්න

interface AIQueryButtonsProps {
  title: string;
  url: string;
  content: string; // <-- blog content එක ලබාගැනීමට prop එකක්
}

export function AIQueryButtons({ title, url, content }: AIQueryButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal එකේ තත්ත්වය (state)

  const chatGptPrompt = `Tell me more about the following article titled "${title}". What are the key takeaways, and can you explain some of the more complex concepts in simpler terms? Here is the link for context: ${url}`;
  const chatGptUrl = `https://chat.openai.com/?q=${encodeURIComponent(chatGptPrompt)}`;

  return (
    <>
      <motion.div
        className="mt-8 pt-8 border-t"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Want to dive deeper?</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            Continue the conversation about this article with your favorite AI assistant.
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Gemini Button: Modal එක trigger කරන ලෙස වෙනස් කළා */}
          <Button
            variant="outline"
            className="w-full sm:w-auto transition-transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <SiGooglegemini className="h-4 w-4" />
            <span className="ml-2">More with Gemini</span>
          </Button>

          {/* ChatGPT Button: আগের মতোই আছে */}
          <Link href={chatGptUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full transition-transform hover:scale-105">
              <SiOpenai className="h-4 w-4" />
              <span className="ml-2">Ask ChatGPT</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Modal Component එක render කිරීම */}
      <GeminiChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blogTitle={title}
        blogContext={content} // <-- blog content එක modal එකට ලබා දෙනවා
      />
    </>
  );
}