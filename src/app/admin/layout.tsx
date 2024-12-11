import { ThemeProvider } from "@/components/common/ThemeProvider";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";
const appName = process.env.APP_NAME || "ARM";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

async function BackendLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await auth();

  return (
    <ThemeProvider
      attribute='data-prefers-color'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <AntdRegistry>
        <AdminLayout user={session?.user!} appName={appName}>
          {children}
        </AdminLayout>
      </AntdRegistry>
    </ThemeProvider>
  );
}

export default BackendLayout;
