import { Meta } from '@/components/common/Meta';
import React from "react";

import { UserAuthForm } from "@/components/auth/AuthForm";

export const metadata = Meta();

function SignIn() {
  return (
    <>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome👏</h1>
        <p className='text-sm text-muted-foreground'>
          Enter your username and password below
        </p>
      </div>
      <UserAuthForm type='signin' />
    </>
  );
}

export default SignIn;
