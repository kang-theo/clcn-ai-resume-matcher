"use server";

import { signIn, signOut } from "@/lib/auth";
import { Provider } from "@radix-ui/react-toast";

// Generic function to handle both Google and GitHub sign-ins
export async function signInWithProvider(provider: "github" | "google") {
  await signIn(provider, {
    // redirect: true,
    // callbackUrl: "/admin/dashboard",
    redirectTo: "/admin/dashboard",
  });

  // TODO: RBAC control - different roles can have different entries
  // const user = await getUserFromSession();
  // if (user) {
  //   const redirectUrl = user.isAdmin ? "/admin/dashboard" : "/dashboard";
  //   window.location.href = redirectUrl;
  // } else {
  //   console.error("User not found");
  // }
}

// action: Github sign in
export async function signInWithGithubAction(formData: FormData) {
  await signInWithProvider("github");
}

// action: Google sign in
export async function signInWithGoogleAction(formData: FormData) {
  await signInWithProvider("google");
}

// action: Sign out
export async function signOutAction() {
  await signOut({
    redirectTo: "/auth/signin",
  });
}
