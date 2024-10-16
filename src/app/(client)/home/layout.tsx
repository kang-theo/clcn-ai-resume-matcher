import { Meta } from '@/components/common/Meta';
import { Navbar } from "@/components/layout/client/Navbar";

export const metadata = Meta();

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
