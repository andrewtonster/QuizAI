import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import HistoryComponent from "../HistoryComponent";
import { FileBarChart2 } from "lucide-react";
type Props = {};

const RecentActivityCard = async (props: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const gamesCount = await prisma.game.count({
    where: { userId: session.user.id },
  });

  return (
    <Card className="col-span-4 lg:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <FileBarChart2 size={28} strokeWidth={2.5} color="#3b82f6" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You have played a total of {gamesCount} games.
        </p>
      </CardContent>
      <CardContent className="max-h-[580px] overflow-scroll">
        <HistoryComponent limit={10} userId={session.user.id} />
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
