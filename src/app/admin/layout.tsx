import { ThemeProvider } from "@/components/common/ThemeProvider";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import React from "react";
const appName = process.env.APP_NAME || "ARM";

function BackendLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute='data-prefers-color'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <AntdRegistry>
        <AdminLayout appName={appName}>{children}</AdminLayout>
      </AntdRegistry>
    </ThemeProvider>
  );
}

export default BackendLayout;
