"use client";

import React, { useCallback, useState, useRef } from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInWithGoogleAction } from "@/app/actions/auth";
import SignInButton from './SignInButton';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/useCustomToast";
import { userSchema, UserForm } from "@/lib/schema";
import { z } from "zod";

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
  const { showToast } = useCustomToast();
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  // const [touched, setTouched] = useState<Record<string, boolean>>({}); // Track touched fields

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

    // // Mark the field as touched
    // setTouched((prevTouched) => ({
    //   ...prevTouched,
    //   [name]: true,
    // }));

    // Skip validation if the field is empty
    if (!value) {
      return;
    }

    try {
      switch (name) {
        case 'email':
          userSchema.shape.email.parse(value); // validate email only
          break;
        case 'username':
          userSchema.shape.username.parse(value); // validate username only
          break;
        case 'password':
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
          throw new Error('Unknown field');
      }

      // If validation passes, clear the error for that field
      setErrors((prevErrors) => {
        const { [name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessage = err.errors[0]?.message;
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: errorMessage,
        }));
      }
    }
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    try {
      // Validate the whole form
      userSchema.parse(formData);
      console.log("Form submitted successfully:", formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        err.errors.forEach((error) => {
          newErrors[error.path[0] as keyof FormErrors] = error.message;
        });
        setErrors(newErrors); // Update error info
      }
    }
    setIsLoading(true);
    const form = new FormData(event.target as HTMLFormElement);

    // currently, next-auth.js has no signUp function
    if (type === "signup") {
      const passwordVal = form.get("password");
      const passwordConfirmationVal = form.get("passwordConfirmation");
      if (passwordVal !== passwordConfirmationVal) {
        // setErrors({ password: "Passwords do not match." });
        setIsLoading(false);
        return;
      }

      try {
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
        const metaData = data.meta;

        // Handle HTTP error status (e.g., res.status is not 2xx)
        // Corner case, edge case
        // 埋点 (event tracking)，Using RPC(Remote Procedure Call) 提交日志到服务器
        // console.error(`HTTP Error: ${res.statusText}`);
        if (!res.ok) {
          showToast({
            title: "Request Error",
            description: "Please try again later or contact support for assistance.",
          });
          return; // Early return on HTTP error
        }

        // Handle server-side errors
        if (metaData.code !== "OK") {
          showToast({
            title: "Server Side Error",
            description:
              metaData.message ||
              "An unexpected error occurred on the server. Please try again later or contact support for assistance.",
          });
          return;
        }

        // Sign-up success handling
        showToast({
          title: "Sign Up Successful",
          description:
            "Congratulations! You have successfully signed up. Please check your email to verify your account.",
        });
        router.push("/auth/signin");

      } catch (error) {
        // Handle network or other unexpected errors
        console.error("Error during registration:", error);
        showToast({
          title: "Unexpected Error",
          description: "An unexpected error occurred. Please try again.",
        });
      } finally {
        // Always set loading to false, whether there was an error or not
        setIsLoading(false);
      }
      return;
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
          title: "Failed To Sign In",
          description: `Please check your ${result.error} and try again.`,
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
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          title: "Failed To Sign In",
          description: err.message || "Please check your input and try again.",
        });
      } else {
        console.error("An unexpected error occurred.", err);
        showToast({
          title: "Unexpected Error Occurred",
          description: "Unexpected error occurred.",
        });
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
              />
              {/* Show errors */}
              {errors.email && <p className='text-red-400'>{errors.email}</p>}
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
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            {errors.username && <p className='text-red-400'>{errors.username}</p>}
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
            />
            {errors.password && <p className='text-red-400'>{errors.password}</p>}
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
              />
            </div>
          )}
          {errors.passwordConfirmation && <p className='text-red-400'>{errors.passwordConfirmation}</p>}

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
      </form >
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
    </div >
  );
}