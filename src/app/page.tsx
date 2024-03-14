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
    // <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
    //   <Card className="w-[300px]">
    //     <CardHeader>
    //       <CardTitle>Welcome to Quizzzy 🔥!</CardTitle>
    //       <CardDescription>
    //         Quizzzy is a platform for creating quizzes using AI!. Get started by
    //         loggin in below!
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent>
    //       <SignInButton text="Sign In with Google" />
    //     </CardContent>
    //   </Card>
    // </div>

    // <div className="flex h-screen justify-center items-center">
    //   <div className="text-center">
    //     <h1 className="text-3xl font-bold mb-4">Title</h1>
    //     <p className="text-lg mb-6">Description</p>
    //     <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    //       Button
    //     </button>
    //   </div>
    // </div>

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
