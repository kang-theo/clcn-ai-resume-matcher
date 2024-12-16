import { AppSidebar } from "@/components/layout/AppSidebar";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await auth();
  if (!session) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <p className='text-2xl font-bold'>
          Please sign in to access this page.
        </p>
      </div>
    );
  }

  return <AppSidebar session={session}>{children}</AppSidebar>;
}
