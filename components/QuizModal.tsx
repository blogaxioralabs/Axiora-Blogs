"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // REMOVED: We don't need DialogClose here as the default X button handles it.
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
// REMOVED: 'X' icon is no longer needed as we use the default.
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizModalProps {
  quizData: QuizQuestion[];
  postTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export function QuizModal({ quizData, postTitle, isOpen, onClose, onRetry }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  }

  const handleRetry = () => {
    resetQuiz();
    onRetry();
  }

  const score = Object.keys(userAnswers).reduce((acc, index) => {
    const questionIndex = parseInt(index, 10);
    if (userAnswers[questionIndex] === quizData[questionIndex].correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          {/* The default 'X' button will occupy the top right, so adding padding to the right (pr-8) prevents title overlap */}
          <DialogTitle className="text-2xl font-bold text-center pr-8">
            Quiz: {postTitle}
          </DialogTitle>
        </DialogHeader>
        
        {/* REMOVED: The manually added 'X' button to prevent duplication. The DialogContent component provides one by default. */}

        {!showResults ? (
          <div className="py-4">
            <p className="text-muted-foreground text-center mb-4">
              Question {currentQuestionIndex + 1} of {quizData.length}
            </p>
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="leading-relaxed">
                  {quizData[currentQuestionIndex].question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={userAnswers[currentQuestionIndex]}
                  onValueChange={handleAnswerSelect}
                  className="space-y-3"
                >
                  {quizData[currentQuestionIndex].options.map((option, i) => (
                    <Label
                      key={i}
                      className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary"
                    >
                      <RadioGroupItem value={option} id={`option-${i}`} />
                      <span>{option}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} disabled={!userAnswers[currentQuestionIndex]}>
                {currentQuestionIndex < quizData.length - 1 ? "Next" : "Finish Quiz"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Your Score:{" "}
              <span className="font-bold text-primary text-2xl">
                {score} / {quizData.length}
              </span>
            </p>

            <div className="space-y-4 text-left max-h-[40vh] overflow-y-auto pr-2">
                {quizData.map((q, index) => (
                    <Card key={index} className={userAnswers[index] === q.correctAnswer ? 'border-green-500' : 'border-red-500'}>
                        <CardHeader>
                            <CardTitle className="text-base">{index + 1}. {q.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <p>Your answer: <span className="font-semibold">{userAnswers[index] || "Not answered"}</span></p>
                            <p>Correct answer: <span className="font-semibold">{q.correctAnswer}</span></p>
                            {userAnswers[index] === q.correctAnswer ? (
                                <p className="text-green-600 font-bold flex items-center mt-2"><CheckCircle className="h-4 w-4 mr-1"/> Correct</p>
                            ) : (
                                <p className="text-red-600 font-bold flex items-center mt-2"><XCircle className="h-4 w-4 mr-1"/> Incorrect</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Button onClick={resetQuiz} variant="outline">
                    Try Again
                </Button>
                <Button onClick={handleRetry}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Generate New Quiz
                </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}