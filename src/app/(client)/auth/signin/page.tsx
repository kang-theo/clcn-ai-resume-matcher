import React from "react";

import { UserAuthForm } from "@/components/auth/AuthForm";

function page() {
  return (
    <>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>欢迎使用👏</h1>
        <p className='text-sm text-muted-foreground'>
          请输入您的邮箱和账户密码
        </p>
      </div>
      <UserAuthForm type='signin' />
    </>
  );
}

export default page;
