"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { ChevronRight } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  BadgeCheck,
  Bell,
  Calendar,
  ChevronsUpDown,
  CreditCard,
  GalleryVerticalEnd,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  subItems?: MenuItem[];
}

// Menu items.
const menus = [
  {
    title: "My Workspace",
    url: "#",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "My Applications",
        url: "/applications",
        icon: Inbox,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    // icon: Settings,
    items: [
      {
        title: "Profile",
        url: "/settings/profile",
        icon: Home,
      },
      {
        title: "My Resumes",
        url: "/settings/resumes",
        icon: Inbox,
      },
    ],
  },
];

interface IconComponentProps {
  icon: React.ElementType | undefined;
}

const IconComponent: React.FC<IconComponentProps> = ({ icon: Icon }) => {
  if (!Icon) return null;
  return <Icon className='mr-2 h-4 w-4' />;
};

interface MenuItem {
  title: string;
  url: string;
  icon?: React.ElementType;
  subItems?: MenuItem[];
}

interface MenuItemContentProps {
  item: MenuItem;
}

const MenuItemContent: React.FC<MenuItemContentProps> = ({ item }) => (
  <>
    <IconComponent icon={item.icon} />
    <span>{item.title}</span>
  </>
);

const renderMenuItem = (item: MenuItem, pathname: string) => {
  if (item.subItems) {
    return (
      <Collapsible
        key={item.title}
        className='group/collapsible'
        defaultOpen={pathname.includes(item.url)}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <MenuItemContent item={item} />
            <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.subItems.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === subItem.url}
                >
                  <a href={subItem.url}>
                    <MenuItemContent item={subItem} />
                  </a>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={pathname === item.url}>
        <a href={item.url}>
          <MenuItemContent item={item} />
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function SiderbarNavs() {
  const pathname = usePathname();

  return (
    <>
      {menus.map((menu) => (
        <SidebarGroup key={menu.title}>
          <SidebarGroupLabel>{menu.title}</SidebarGroupLabel>
          <SidebarMenu>
            {menu.items.map((item: MenuItem) => renderMenuItem(item, pathname))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
