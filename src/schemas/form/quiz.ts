import { z } from "zod"; // zod allows us to validate input types by defininf schemas

// defining the z object validators for our forms
export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, { message: "Topic must be at least 4 characters long" })
    .max(50),
  type: z.enum(["mcq", "open_ended"]), // there are two type of questions
  amount: z.number().min(1).max(10), // the amount of questions is defined here
});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});
