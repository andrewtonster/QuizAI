"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FileStack } from "lucide-react";
type Props = {};

const HistoryCard = (props: Props) => {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer hover:opacity-75"
      onClick={() => {
        router.push("/history");
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">History</CardTitle>
        <FileStack size={28} strokeWidth={2.5} color="#3b82f6" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          View previous quiz attempts.
        </p>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
