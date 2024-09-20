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
import { useCustomToast } from "@/hooks/useCustomToast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "signin" | "signup";
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { type } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [githubSigning, setGithubSigning] = useState<boolean>(false);
  const [googleSigning, setGoogleSigning] = useState<boolean>(false);
  const router = useRouter();
  const { showToast } = useCustomToast();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    const form = new FormData(event.target as HTMLFormElement);

    // currently, next-auth.js has no signUp function
    if (type === "signup") {
      const passwordVal = form.get("password");
      const passwordConfirmationVal = form.get("passwordConfirmation");
      if (passwordVal !== passwordConfirmationVal) {
        showToast({
          title: "Password mismatch",
          description: "Please check your input and try again.",
        });
        setIsLoading(false);
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

      try {
        const data: any = await res.json();
        if (res.ok) {
          const metaData = data.meta;

          if (metaData.code !== "OK") {
            // Handle the error, e.g., show an error message to the user
            showToast({
              title: "Server side error",
              description:
                metaData.message ||
                "An unexpected error occurred on the server. Please try again later or contact support for assistance.",
            });
          } else {
            showToast({
              title: "Sign up successful",
              description:
                "Congratulations! You have successfully signed up. Please check your email to verify your account.",
            });
            router.push("/auth/signin");
          }
        } else {
          // Handle HTTP error status (e.g., res.status is not 2xx)
          // Corner case, edge case
          // 埋点 (event tracking)，Using RPC(Remote Procedure Call) 提交日志到服务器
          // console.error(`HTTP Error: ${res.statusText}`);
          showToast({
            title: "Request Error",
            description:
              "Please try again later or contact support for assistance.",
          });
        }
      } catch (error) {
        console.error(error);
        // Handle JSON parsing error
        console.error("Error parsing JSON:", error);
      } finally {
        // Always set loading to false, whether there was an error or not
        setIsLoading(false);
        return null;
      }
    }

    // after register successfully
    // next-auth.js provided signIn function; it sends credentials and next-auth.js will use prisma client to find in postgresql
    try {
      const result = await signIn("credentials", {
        username: form.get("username"),
        password: form.get("password"),
        // callbackUrl: "/admin/dashboard",
        redirect: false,
      });

      // for example: {"error":"CredentialsSignin","status":200,"ok":true,"url":null}
      if (result && result.error) {
        showToast({
          title: "Failed to sign in",
          description: result.error || "Please check your input and try again.",
        });
      } else {
        // Todo: RDBC
        // user dashboard if it is not admin
        // router.push("/dashboard");
        // admin dashboard if it is admin
        router.push("/admin/dashboard");
        // Authentication succeeded, result contains session object
        // alert("Authentication successful: " + JSON.stringify(result));
        // Redirect or perform other actions
      }
      setIsLoading(false);
      // console.log("Authentication successful");
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          title: "Failed to sign in",
          description: err.message || "Please check your input and try again.",
        });
      } else {
        console.error("An unexpected error occurred.", err);
      }

      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className='grid gap-2'>
          {type === "signup" && (
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
          {type === "signup" && (
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
            {type === "signin" ? "Sign In" : "Sign Up"}
          </Button>
          {type === "signin" ? (
            <p className='text-sm text-center'>
              Don&apos;t have an account?{" "}
              <Link href='/auth/register' className='font-semibold'>
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Do you already have an account?{" "}
              <Link href='/auth/signin'>Sign in</Link>
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
        {/* <SignInButton
          provider='github'
          isSigning={githubSigning}
          setIsSigning={setGithubSigning}
          signInAction={signInWithGithubAction}
        /> */}
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