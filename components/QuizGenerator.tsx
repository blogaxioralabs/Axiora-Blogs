"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit } from "lucide-react";
import { QuizModal } from "./QuizModal";
import { toast } from "sonner";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizGeneratorProps {
  postContent: string;
  postTitle: string;
}

export default function QuizGenerator({ postContent, postTitle }: QuizGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setQuizData(null);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: postContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz. The server responded with an error.");
      }

      const data = await response.json();
      
      // Basic validation of the received data
      if (!Array.isArray(data) || data.length === 0 || !data[0].question) {
        throw new Error("Received an invalid quiz format from the server.");
      }

      setQuizData(data);
      setIsModalOpen(true);
      toast.success("Quiz generated successfully!");

    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="my-8 p-6 bg-secondary/50 border-2 border-dashed rounded-lg text-center">
      <h3 className="text-xl font-semibold mb-2">Test Your Knowledge!</h3>
      <p className="text-muted-foreground mb-4">
        Click the button below to generate an AI-powered quiz based on this article.
      </p>
      <Button onClick={handleGenerateQuiz} disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <BrainCircuit className="mr-2 h-4 w-4" />
            Generate Quiz
          </>
        )}
      </Button>

      {quizData && (
        <QuizModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          quizData={quizData}
          postTitle={postTitle}
          onRetry={handleGenerateQuiz}
        />
      )}
    </div>
  );
}