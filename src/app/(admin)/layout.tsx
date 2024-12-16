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
  }

  return <AppSidebar session={session}>{children}</AppSidebar>;
}
