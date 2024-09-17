"use server";

import { signIn, signOut } from "@/lib/auth";

export async function signInWithGithubAction(formData: FormData) {
  await signIn("github", {
    // redirect: true,
    // callbackUrl: "/admin/dashboard",
    redirectTo: "/admin/dashboard",
  });

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
