"use client";

import React, { useCallback, useState, useRef } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithGithubAction, signInWithGoogleAction } from "@/app/actions/auth";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "sign-in" | "sign-up";
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signing, setSigning] = useState(false);
  const [googleSigning, setGoogleSigning] = useState(false);
  const githubSSORef = useRef(null);
  const googleSSORef = useRef(null);
  const { type } = props;

  async function onSubmit(event: React.SyntheticEvent) {
  }

  const handleSigning = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    setSigning(true);
    const formEl: HTMLFormElement = githubSSORef.current!;
    // formEl.submit();
    formEl.requestSubmit();
  }, []);

  const handleGoogleSigning = useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    setGoogleSigning(true);
    const formEl: HTMLFormElement = googleSSORef.current!;
    // formEl.submit();
    formEl.requestSubmit();
  }, []);


  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          {type === "sign-up" && (
            <div className='grid gap-1'>
              <Label className='sr-only' htmlFor='email'>
                Email
              </Label>
              <Input
                id='email'
                name='email'
                placeholder='name@example.com'
                type='email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                disabled={isLoading}
              />
            </div>
          )}

          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='username'>
              Username
            </Label>
            <Input
              id='username'
              name='username'
              placeholder='username'
              type='input'
              autoCapitalize='none'
              autoComplete='input'
              autoCorrect='off'
              disabled={isLoading}
            />
          </div>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='password'>
              Password
            </Label>
            <Input
              id='password'
              name='password'
              placeholder='password'
              type='password'
              autoCapitalize='none'
              autoComplete='password'
              autoCorrect='off'
              disabled={isLoading}
            />
          </div>
          {type === "sign-up" && (
            <div className='grid gap-1'>
              <Label className='sr-only' htmlFor='passwordConfirmation'>
                Password Confirmation
              </Label>
              <Input
                name='passwordConfirmation'
                id='passwordConfirmation'
                placeholder='Confirm password'
                type='password'
                autoCapitalize='none'
                autoComplete='password'
                autoCorrect='off'
                disabled={isLoading}
              />
            </div>
          )}
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
            )}
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </Button>
          {type === "sign-in" ? (
            <p className='text-sm text-center'>
              Don&apos;t have an account?{" "}
              <Link href='/auth/register' className='font-semibold'>
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Do you already have an account?{" "}
              <Link href='/auth/sign-in'>Sign in</Link>
            </p>
          )}
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>Or</span>
        </div>
      </div>
      <form ref={githubSSORef} action={signInWithGithubAction}>
        <Button
          className='w-full'
          variant='outline'
          disabled={signing}
          onClick={handleSigning}
        >
          {signing ? (
            <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Icons.GitHub className='mr-2 h-4 w-4' />
          )}{" "}
          GitHub
        </Button>
      </form>
      <form ref={googleSSORef} action={signInWithGoogleAction}>
        <Button
          className='w-full'
          variant='outline'
          disabled={googleSigning}
          onClick={handleGoogleSigning}
        >
          {googleSigning ? (
            <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Icons.Google className='mr-2 h-4 w-4' />
          )}{" "}
          Google
        </Button>
      </form>
    </div>
  );
}