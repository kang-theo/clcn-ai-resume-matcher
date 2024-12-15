import { AppSidebar } from "@/components/layout/AppSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppSidebar>{children}</AppSidebar>;
}
