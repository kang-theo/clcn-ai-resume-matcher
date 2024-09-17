import { Metadata } from "next";
import React from "react";

import { UserAuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "AI resume matcher sign up",
  description:
    "Authentication forms tailwind, next.js etc.",
};

function SignUp() {
  return (
    <>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
        <p className='text-sm text-muted-foreground'>
          Enter the required information to create your account
        </p>
      </div>
      <UserAuthForm type='sign-up' />
    </>
  );
}

export default SignUp;
