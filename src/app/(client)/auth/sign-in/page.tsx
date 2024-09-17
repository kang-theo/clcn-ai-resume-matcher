import { Metadata } from "next";
import React from "react";

import { UserAuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "AI resume matcher sign in",
  description:
    "Authentication forms tailwind, next.js etc.",
};

function SignIn() {
  return (
    <>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome👏</h1>
        <p className='text-sm text-muted-foreground'>
          Enter your username and password below
        </p>
      </div>
      <UserAuthForm type='sign-in' />
    </>
  );
}

export default SignIn;
