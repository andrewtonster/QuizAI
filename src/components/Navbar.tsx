import { getAuthSession } from "@/lib/nextauth";
import React from "react";
import Link from "next/link";
import SignInButton from "./SignInButton";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";

type Props = {};

const Navbar = async () => {
  const session = await getAuthSession();
  console.log(session?.user);
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300  py-2 ">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        <Link href={"/"} className="">
          <span className=" text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            Quiz<span className="text-blue-400">AI</span>
          </span>
        </Link>

        <div className="flex items-center">
          <ThemeToggle className="mr-3" />
          <div className="flex items-center">
            {session?.user ? (
              <UserAccountNav user={session.user} />
            ) : (
              <SignInButton text={"Sign In"} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
