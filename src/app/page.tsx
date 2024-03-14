import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div>
      <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center items-center">
        <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6">
          Test yourself using <span className="text-blue-400">AI</span>
        </h1>
        <div className="max-w-[600px]">
          <p className="md:text-xl sm:text-lg text-xl ">
            Welcome to QuizAI. Secured by google authentication, quiz yourself
            on any topic
          </p>
        </div>
        <CardContent className=" mt-[30px]">
          <SignInButton
            text="Sign In with Google"
            shadow="shadow-10xl shadow-lg drop-shadow-2xl shadow-blue-500"
          />
        </CardContent>
      </div>
    </div>
  );
}
