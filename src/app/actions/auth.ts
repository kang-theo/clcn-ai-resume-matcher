"use server";

import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signInWithGithubAction(formData: FormData) {
  const result = await signIn("github", {
    redirect: false, // Disable automatic redirect
  });

  if (result?.error) {
    console.error("Sign-in error:", result.error);
    return;
  }

  const redirectUrl = "/admin/dashboard";
  redirect(redirectUrl);

  // TODO: Redirect based on user type
  // const user = await getUserFromSession();
  // if (user) {
  //   const redirectUrl = user.isAdmin ? "/admin/dashboard" : "/dashboard";
  //   window.location.href = redirectUrl;
  // } else {
  //   console.error("User not found");
  // }
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/sign-in",
  });
}
