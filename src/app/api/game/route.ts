import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";

/*
    TYPE: POST
    ENDPOINT: /api/game
*/
export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "You must be logged in",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { amount, topic, type } = quizCreationSchema.parse(body);

    // Calculating time to account for delay
    let time = new Date();
    time.setSeconds(time.getSeconds() + 5);

    // Taking form data, and creating new game on database
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: time,
        userId: session.user.id,
        topic,
      },
    });

    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    if (data.status === 422) {
      throw new Error("AI Could not understand");
    }

    if (type == "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      let manyData = data.questions.map((question: mcqQuestion) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];

        options = options.sort(() => Math.random() - 0.5);

        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "mcq",
        };
      });

      await prisma.question.createMany({
        data: manyData,
      });
    }

    return NextResponse.json({
      gameId: game.id,
      status: 200,
    });
  } catch (error) {
    console.log("In error catching");
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: "Something Went Wrong",
      },
      {
        status: 500,
      }
    );
  }
}
