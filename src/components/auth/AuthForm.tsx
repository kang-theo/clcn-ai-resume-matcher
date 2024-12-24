"use client";

import React, { useCallback, useState, useRef } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithGoogleAction } from "@/app/actions/auth";
import SignInButton from "./SignInButton";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { userSchema, UserForm } from "@/lib/schema";
import { z } from "zod";
import ErrorMessage from "@/components/common/ErrorMessage";
import toast from "react-hot-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "signin" | "signup";
}

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  passwordConfirmation?: string;
  general?: string;
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { type } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [githubSigning, setGithubSigning] = useState<boolean>(false);
  const [googleSigning, setGoogleSigning] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const callbackUrl = searchParams.get("callbackUrl");

  // Handle input change (real-time validation)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error on change
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Skip validation if the field is empty
    if (!value) {
      return;
    }

    try {
      switch (name) {
        case "email":
          userSchema.shape.email.parse(value); // validate email only
          break;
        case "username":
          userSchema.shape.username.parse(value); // validate username only
          break;
        case "password":
          userSchema.shape.password.parse(value); // validate password only
          break;
        case "passwordConfirmation":
          if (value !== formData.password) {
            throw new z.ZodError([
              {
                code: "custom",
                path: ["passwordConfirmation"],
                message: "Passwords do not match",
              },
            ]);
          }
          break;
        default:
          throw new Error("Unknown field");
      }

      // If validation passes, clear the error for that field
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: errorMessage,
        }));
      }
    }
  };

  const getBorderClass = (error?: string) => {
    return `border ${
      error ? "border-red-500" : "border-gray-300"
    } rounded-md p-2 focus-visible:ring-transparent`;
  };

  async function onSubmit(event: React.SyntheticEvent) {
    // const onSubmit = async (event: React.SyntheticEvent) => {
    setIsLoading(true);

    event.preventDefault();
    // use original form submit
    const form = new FormData(event.target as HTMLFormElement);

    if (type === "signup") {
      const passwordVal = form.get("password");
      const passwordConfirmationVal = form.get("passwordConfirmation");
      if (passwordVal !== passwordConfirmationVal) {
        toast.error(
          "Password mismatch, please check your input and try again.",
          { position: "top-right" }
        );
        setIsLoading(false);

        return null;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // csrfToken: form.get("csrfToken"),
          username: form.get("username"),
          email: form.get("email"),
          password: passwordVal,
          passwordConfirmation: passwordConfirmationVal,
        }),
      });

      try {
        const data = await res.json();

        if (res.ok) {
          const metaData = data.meta;

          if (metaData.code === "OK") {
            toast.success(
              "Congratulations! You have successfully signed up. Please check your email to verify your account.",
              { position: "top-right" }
            );
            router.push("/auth/signin");
          } else {
            // Handle the error, e.g., show an error message to the user
            toast.error(
              metaData.message ||
                "An unexpected error occurred on the server. Please try again later or contact support for assistance.",
              { position: "top-right" }
            );
          }
        } else {
          // Handle HTTP error status (e.g., res.status is not 2xx)
          // Corner case, edge case
          // 埋点，RPC(Remote Procedure Call) 提交日志到服务器
          // console.error(`HTTP Error: ${res.statusText}`);
          toast.error(
            data.meta.message ||
              "Please try again later or contact support for assistance.",
            { position: "top-right" }
          );
        }
      } catch (error) {
        console.error(error);
        // Handle JSON parsing error
        toast.error(
          "Please try again later or contact support for assistance.",
          { position: "top-right" }
        );
      } finally {
        // Always set loading to false, whether there was an error or not
        setIsLoading(false);
        return null;
      }
    }

    // after register successfully
    // error=CredentialsSignin
    try {
      const result = await signIn("credentials", {
        email: form.get("email"),
        password: form.get("password"),
        // callbackUrl: "/admin/dashboard",
        // callbackUrl,
        redirect: false,
      });

      // for example: {"error":"CredentialsSignin","status":200,"ok":true,"url":null}
      if (result && result.error) {
        // toast.error(
        //   "Failed to sign in. please try again later or contact support for assistance.",
        //   { position: "top-right" }
        // );
        switch (result.error) {
          case "AccessDenied":
            toast.error(
              "Access denied. Please verify your email before signing in.",
              { position: "top-right" }
            );
            break;
          case "CredentialsSignin":
            toast.error(
              "Invalid email or password. Please check your credentials.",
              { position: "top-right" }
            );
            break;
          default:
            toast.error(
              "Failed to sign in. Please try again later or contact support.",
              { position: "top-right" }
            );
        }
      } else {
        const session = await getSession();
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (
          session?.user.roles?.includes("Admin") ||
          session?.user.roles?.includes("HR")
        ) {
          router.push("/jobs/all");
        } else {
          router.push("/dashboard");
        }
      }
      setIsLoading(false);
      // console.log("Authentication successful");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(
          "Failed to sign in. Please check your input and try again.",
          { position: "top-right" }
        );
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
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getBorderClass(errors.email)}
              />
              {/* Show errors */}
              <ErrorMessage error={errors.email} />
            </div>
          )}

          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='username'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              placeholder='Email'
              type='email'
              autoCapitalize='none'
              autoComplete='input'
              autoCorrect='off'
              disabled={isLoading}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={getBorderClass(errors.email)}
            />
            <ErrorMessage error={errors.email} />
          </div>

          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='password'>
              Password
            </Label>
            <Input
              id='password'
              name='password'
              placeholder='Password'
              type='password'
              autoCapitalize='none'
              autoComplete='password'
              autoCorrect='off'
              disabled={isLoading}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={getBorderClass(errors.password)}
            />
            <ErrorMessage error={errors.password} />
          </div>

          {type === "signup" && (
            <div className='grid gap-1'>
              <Label className='sr-only' htmlFor='passwordConfirmation'>
                Password Confirmation
              </Label>
              <Input
                id='passwordConfirmation'
                name='passwordConfirmation'
                placeholder='Confirm password'
                type='password'
                autoCapitalize='none'
                autoComplete='password'
                autoCorrect='off'
                disabled={isLoading}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={getBorderClass(errors.passwordConfirmation)}
              />
            </div>
          )}
          <ErrorMessage error={errors.passwordConfirmation} />

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
