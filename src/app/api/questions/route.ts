import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
//POST /api/questions
export const POST = async (req: Request, res: Response) => {
  function checkDuplicates(questions: any[]): boolean {
    for (const question of questions) {
      if (
        question.answer === question.option1 ||
        question.answer === question.option2 ||
        question.answer === question.option3 ||
        question.option1 === question.option2 ||
        question.option1 === question.option3 ||
        question.option2 === question.option3
      ) {
        return true;
      }
    }
    return false;
  }

  console.log("made it to the /api/questions");
  try {
    // const session = await getAuthSession();

    // if (!session?.user) {
    //   return NextResponse.json(
    //     {
    //       error: "You must be logged in to create a quiz",
    //     },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();

    // we are making sure that the input is valid, and then we can destructure the variables we want
    const { amount, topic, type } = quizCreationSchema.parse(body);
    let questions: any;
    if (type === "open_ended") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate a pair of trivia question and answers about anime, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard question about ${topic} `
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output(
        "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
        new Array(amount).fill(
          `You are to generate a random hard question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    }

    if (checkDuplicates(questions) || questions.length === 0) {
      console.log("Error in generating quetions please retry");
      return NextResponse.json({
        message: "AI did not understand topic or quesiton",
        status: 422,
      });
    }

    console.log(questions);
    return NextResponse.json(
      {
        questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }
  }
};
