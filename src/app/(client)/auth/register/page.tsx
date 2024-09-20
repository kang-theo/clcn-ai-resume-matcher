import { Meta } from '@/components/common/Meta';
import React from "react";

import { UserAuthForm } from "@/components/auth/AuthForm";

export const metadata = Meta();

function Register() {
  return (
    <div className='container h-full flex-col items-center justify-center md:grid lg:max-w-none p-8'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>Sign Up</h1>
            <p className='text-sm text-muted-foreground'>
              Enter your username and password below
            </p>
          </div>
          <UserAuthForm type='signup' />
        </div>
      </div>
    </div>
  );
}

export default Register;