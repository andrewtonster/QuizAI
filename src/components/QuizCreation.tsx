"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { useForm } from "react-hook-form";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { CopyCheck } from "lucide-react";
import { BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingQuestions from "./LoadingQuestions";
import { finished } from "stream";
import { useToast } from "./ui/use-toast";

type Props = {};

type Input = z.infer<typeof quizCreationSchema>; // allows us to put our schema into a type

// we use react hook forms to create our forms
const QuizCreation = (props: Props) => {
  const [showLoader, setShowLoader] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Hook to make api calls
  // function that preforms mutation is passed
  const { mutate: getQuestions, isLoading } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post("/api/game", {
        amount,
        topic,
        type,
      });

      console.log("hello from mutate function");
      console.log(response.status);

      if (response.status !== 200) {
        throw new Error();
      }

      return response.data;
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: "",
      type: "open_ended",
    },
  });

  function onSubmit(input: Input) {
    // we are gettomg information from our input form to get questions
    setShowLoader(true);
    getQuestions(
      {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      },
      {
        onSuccess: ({ gameId }) => {
          setFinished(true);
          setTimeout(() => {
            router.push(`/play/mcq/${gameId}`);
          }, 1000);
        },
        onError: (error) => {
          console.log("I am in the error zone");
          console.log(error);

          toast({
            title: "Wrong!",
            description:
              "AI failed to understand topic, please be more specific or try a different topic",
            variant: "destructive",
          });

          setShowLoader(false);
        },
      }
    );
  }

  form.watch();

  if (showLoader) {
    return <LoadingQuestions finished={finished} />;
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2x">
            Test Your Knowledge Here
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-400 font-bold">
                      Topic
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="enter a topic" {...field} />
                    </FormControl>
                    <FormDescription>Provide a topic</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-400 font-bold">
                      Number of Questions
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many questions?"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue("amount", parseInt(e.target.value));
                        }}
                        min={1}
                        max={5}
                      />
                    </FormControl>
                    <FormDescription>
                      You can choose how many questions you would like to be
                      quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={isLoading}
                type="submit"
                onClick={() => {
                  form.setValue("type", "mcq");
                }}
                className="bg-blue-400"
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;
