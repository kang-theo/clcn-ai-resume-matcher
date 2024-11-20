import { Meta } from '@/components/common/Meta';
import { ThemeProvider } from "@/components/providers/themes";
import { Inter as FontSans } from "next/font/google";
import "@/assets/styles/global.css";
import { ScrollToTop } from "@/components/layout/client/ScrollToTop";
import { Navbar } from "@/components/layout/client/Navbar";

export const metadata = Meta();

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <Navbar />
      {children}
      <ScrollToTop />
    </ThemeProvider>
  );
}
