import { Meta } from "@/components/common/Meta";
import { ThemeProvider } from "@/components/providers/themes";
import "@/assets/styles/global.css";
import { ScrollToTop } from "@/components/layout/client/ScrollToTop";
import { Navbar } from "@/components/layout/client/Navbar";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";

export const metadata = Meta();

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: Session | null = await auth();
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <Navbar session={session} />
      {children}
      <ScrollToTop />
    </ThemeProvider>
  );
}
