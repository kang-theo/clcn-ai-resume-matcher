import React from "react";

import { UserAuthForm } from "@/components/auth/AuthForm";

function page() {
  return (
    <>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>创建账户</h1>
        <p className='text-sm text-muted-foreground'>
          按要求输入信息创建您的账户
        </p>
      </div>
      <UserAuthForm type='signup' />
    </>
  );
}

export default page;
