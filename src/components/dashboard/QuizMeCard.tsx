"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { BookOpenCheck } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {};

const QuizMeCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => {
        router.push("/quiz");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Quiz me!</CardTitle>
        <BookOpenCheck size={28} strokeWidth={2.5} color="#3b82f6" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Test yourself to an AI generated quiz with your topic.
        </p>
      </CardContent>
    </Card>
  );
};

export default QuizMeCard;
