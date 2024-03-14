import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  console.log("made it to api/game");

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

    // creating a game on our database
    console.log("This is the amount of questions", amount);
    console.log(session.user.id, "my session id");

    // accounting for the existing delay created
    let time = new Date();
    time.setSeconds(time.getSeconds() + 5);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: time,
        userId: session.user.id,
        topic,
      },
    });

    console.log("this is the game");
    // making a post request to get the questions

    console.log("before data");
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });

    console.log(data.status);
    if (data.status === 422) {
      console.log("in error mode");
      //   return NextResponse.json({
      //     message:
      //       "AI failed to understand topic, please be more specific or try a different topic",
      //     status: 422,
      //   });
      throw new Error("Ai Could not understand");
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
    } else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };

      let manyData = data.questions.map((question: openQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          gameId: game.id,
          questionType: "open_ended",
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
