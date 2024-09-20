import { Meta } from '@/components/common/Meta';
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import "@/assets/styles/admin.css";

// const inter = Inter({ subsets: ["latin"] });
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const appName = process.env.APP_NAME || "ARM";

export const metadata = Meta({
  title: appName,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={cn(
            "bg-background text-foreground dark:bg-[hsl(var(--background))] app min-h-screen font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
