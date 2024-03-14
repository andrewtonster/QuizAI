"use client";

import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
// the : in typescript defines the type
type Props = {
  text: string;
  shadow: string;
};

const SignInButton = ({ text, shadow }: Props) => {
  return (
    <Button
      className={`rounded-full ${shadow}`}
      onClick={() => {
        signIn("google").catch(console.error);
      }}
    >
      {text}
    </Button>
  );
};

export default SignInButton;
