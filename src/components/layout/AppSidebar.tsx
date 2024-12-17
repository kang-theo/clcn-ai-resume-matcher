"use client";
import { memo, useCallback } from "react";
import {
  BadgeCheck,
  Bell,
  Calendar,
  ChevronsUpDown,
  CircleUser,
  CreditCard,
  GalleryVerticalEnd,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { BreadcrumbWrapper } from "@/components/common/BreadcrumbWrapper";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiderbarNavs } from "./SiderbarNavs";
import { Session } from "next-auth";
import Link from "next/link";

interface AppLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

// Rename the memoized component
const MemoizedSidebarContent = memo(function MemoizedSidebarContent({
  session,
  onSignOut,
}: {
  session: any;
  onSignOut: () => void;
}) {
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <GalleryVerticalEnd className='size-4' />
                </div>
                <div className='flex flex-col gap-0.5 leading-none'>
                  <span className='font-semibold'>AI Resume Matcher</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SiderbarNavs userRole={session?.user?.roles} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:ring-0'
                >
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={session?.user?.image ?? ""}
                      alt={session?.user?.username ?? "User avatar"}
                    />
                    <AvatarFallback className='rounded-lg'>
                      {session?.user?.username
                        ? session?.user?.username.slice(0, 2)
                        : "N/A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {session?.user?.username}
                    </span>
                    <span className='truncate text-xs'>
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='right'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

// Memoize the header content
const HeaderContent = memo(function HeaderContent() {
  return (
    <div className='flex items-center gap-2 px-4'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2 h-4' />
      <BreadcrumbWrapper />
    </div>
  );
});

export function AppSidebar({ session, children }: AppLayoutProps) {
  const router = useRouter();

  const handleSignOut = useCallback(() => {
    const callbackUrl = encodeURIComponent(window.location.pathname);
    signOut({
      callbackUrl: `/auth/signin?callbackUrl=${callbackUrl}`,
    });
  }, []);

  if (!session || !session.user) {
    const callbackUrl = encodeURIComponent(window.location.pathname);
    router.replace(`/auth/signin?callbackUrl=${callbackUrl}`);
    return null;
  }

  return (
    <SidebarProvider>
      <MemoizedSidebarContent session={session} onSignOut={handleSignOut} />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <HeaderContent />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
