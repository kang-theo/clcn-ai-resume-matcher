import { SessionChecker } from "@/components/auth/SessionChecker";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await auth();
  if (!session) {
    redirect("/auth/signin");
    // const currentPath = new URL(headers().get("x-url") || "").pathname;
    // redirect(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
    // const headersList = headers();
    // const currentPath = headersList.get("x-invoke-path") || "";
    // redirect(`/auth/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
  }

  return (
    <SessionChecker>
      <AppSidebar session={session}>{children}</AppSidebar>
    </SessionChecker>
  );
}
