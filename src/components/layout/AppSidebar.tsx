"use client";
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
// import { useRouter } from "next/navigation";

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
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppSidebar({ children }: AppLayoutProps) {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to sign-in page with a callback URL
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(
          window.location.pathname
        )}`
      );
    }
  }, [status, router]);

  // Polling the session every 1 hour
  useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    // 1 hour
    const interval = setInterval(() => checkSession(), 1000 * 60 * 60 * 8);
    return () => clearInterval(interval);
  }, []);

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  useEffect(() => {
    const visibilityHandler = () =>
      document.visibilityState === "visible" && update();
    window.addEventListener("visibilitychange", visibilityHandler, false);
    return () =>
      window.removeEventListener("visibilitychange", visibilityHandler, false);
  }, [update]);

  // Function to check session validity
  const checkSession = async () => {
    try {
      // Manually trigger a session update
      await update();

      // const expireTime = new Date(session?.expires);

      // if (new Date() > expireTime) {
      //   console.log("Session expired......");
      // }

      // If session is null after update, redirect to sign-in
      if (!session) {
        router.replace("/auth/signin");
      }
    } catch (error) {
      // Handle error, possibly redirect to sign-in
      router.replace("/auth/signin");
    }
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild>
                <a href='/dashboard'>
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                    <GalleryVerticalEnd className='size-4' />
                  </div>
                  <div className='flex flex-col gap-0.5 leading-none'>
                    <span className='font-semibold'>AI Resume Matcher</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SiderbarNavs />
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
                  {/* 
                  <DropdownMenuLabel className='p-0 font-normal'>
                    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={session?.user?.image ?? ""}
                          alt='User avatar'
                        />
                        <AvatarFallback className='rounded-lg'>
                          <CircleUser className='h-full w-full' />
                        </AvatarFallback>
                      </Avatar>
                      <div className='grid flex-1 text-left text-sm leading-tight'>
                        <span className='truncate font-semibold'>
                          {session?.user?.name}
                        </span>
                        <span className='truncate text-xs'>
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      Upgrade to Pro
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      Notifications
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        callbackUrl: `/auth/signin?callbackUrl=${encodeURIComponent(
                          window.location.pathname
                        )}`,
                      })
                    }
                  >
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
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <BreadcrumbWrapper />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
