import { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ARM",
  description: "请使用我们丰富的设计参考图片，它可以激发你无限的灵感",
};

const info = {
  company: process.env.company,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/*  <div className='md:hidden'>
        <Image
          src='/examples/authentication-light.png'
          width={1280}
          height={843}
          alt='Authentication'
          className='block dark:hidden'
        />
        <Image
          src='/examples/authentication-dark.png'
          width={1280}
          height={843}
          alt='Authentication'
          className='hidden dark:block'
        />
      </div> */}
      {/* hidden */}
      <div className='container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r'>
          <div className='absolute inset-0 bg-[#737373]' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='mr-2 h-6 w-6'
            >
              <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
            </svg>
            {info.company}
          </div>
          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;请使用我们强大的，简洁的工具影制。使用影制高效创作您的剧本。&rdquo;
              </p>
              <footer className='text-sm'>Filmlog&reg;</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            {children}
            <p className='px-4 text-center text-sm text-muted-foreground'>
              登录代表你同意我们的{" "}
              <Link
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                服务条款
              </Link>{" "}
              和{" "}
              <Link
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
              >
                隐私政策
              </Link>
              。
            </p>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
