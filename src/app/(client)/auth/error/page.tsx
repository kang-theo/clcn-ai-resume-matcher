import Link from 'next/link';
import { FC } from 'react';

const AuthError: FC = () => {
  return (
    <div className='flex flex-col space-y-2 text-center'>
      <h1 className='text-2xl font-semibold tracking-tight'>Login Error</h1>
      <p className='text-sm text-muted-foreground'>
        It seems there was an issue with your login. Please try again. Go to
        <span className='ml-1 mr-1'>
          <Link href="/auth/sign-in" className='underline underline-offset-4 hover:text-primary'>
            Sign In
          </Link>
        </span>
        page.
      </p>
    </div>
  );
};

export default AuthError;
