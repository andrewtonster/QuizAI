import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/QuizCreation";

export const metadata = {
  title: "Quiz",
};

type Props = {};

const QuizPage = async (props: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div>
      <QuizCreation />
    </div>
  );
};

export default QuizPage;
