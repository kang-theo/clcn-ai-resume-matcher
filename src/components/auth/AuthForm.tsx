"use client";

import React, { useCallback, useState, useRef } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithGithubAction, signInWithGoogleAction } from "@/app/actions/auth";
import SignInButton from './SignInButton';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "sign-in" | "sign-up";
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { type } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [githubSigning, setGithubSigning] = useState<boolean>(false);
  const [googleSigning, setGoogleSigning] = useState<boolean>(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    const form = new FormData(event.target as HTMLFormElement);

    // currently, next-auth.js has no signUp function
    if (type === "sign-up") {
      const passwordVal = form.get("password");
      const passwordConfirmationVal = form.get("passwordConfirmation");
      if (passwordVal !== passwordConfirmationVal) {
        return null;
      }

      // send to api server for register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // send in JSON string
        body: JSON.stringify({
          // csrfToken: form.get("csrfToken"),
          username: form.get("username"),
          email: form.get("email"),
          password: passwordVal,
          passwordConfirmation: passwordConfirmationVal,
        }),
      });

      const data: any = await res.json();
      const metaData: any = data.meta;
      if (metaData.code == "OK") {
        router.push("/auth/sign-in");
      }

      setIsLoading(false);
      return null;
    }

    // after register successfully
    // next-auth.js provided signIn function; it sends credentials and next-auth.js will use prisma client to find in postgresql
    await signIn("credentials", {
      username: form.get("username"),
      password: form.get("password"),
      // TODO: redirect based on roles
      callbackUrl: "/admin/dashboard",
    }).catch((err) => {
      setIsLoading(false);
      console.error(err);
    });
  }

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
      <div>
        <SignInButton
          provider='github'
          isSigning={githubSigning}
          setIsSigning={setGithubSigning}
          signInAction={signInWithGithubAction}
        />
        <SignInButton
          provider='google'
          isSigning={googleSigning}
          setIsSigning={setGoogleSigning}
          signInAction={signInWithGoogleAction}
        />
      </div>
    </div>
  );
}