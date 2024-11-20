"use client";

import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { buttonVariants } from "@/components/ui/button";
import { Menu, BookA, SquarePen, Divide } from "lucide-react";
import { ModeToggle } from "@/components/common/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "/home",
    label: "Home",
  },
  {
    href: "/jobs",
    label: "Jobs",
  },
  // {
  //   href: "/#features",
  //   label: "Features",
  // },
  // {
  //   href: "/#testimonials",
  //   label: "Testimonials",
  // },
  // {
  //   href: "/#pricing",
  //   label: "Pricing",
  // },
  // {
  //   href: "/#faq",
  //   label: "FAQ",
  // },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currPath = usePathname();

  const isAuthPath = currPath.startsWith("/auth");
  if (isAuthPath) {
    return null;
  }

  return (
    <header className='border-b-[1px] top-0 z-40 w-full'>
      <NavigationMenu className='mx-auto'>
        <NavigationMenuList className='container h-14 px-4 w-screen flex justify-between '>
          <NavigationMenuItem className='font-bold flex'>
            <Link
              rel='noreferrer noopener'
              href='/'
              className='ml-2 font-bold text-xl flex items-center'
            >
              <BookA />
              ARM
            </Link>
          </NavigationMenuItem>

          {/* mobile */}
          <span className='flex md:hidden'>
            <ModeToggle />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className='px-2'>
                <Menu
                  className='flex md:hidden h-5 w-5'
                  onClick={() => setIsOpen(true)}
                ></Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className='font-bold text-xl'>ARM</SheetTitle>
                </SheetHeader>
                <nav className='flex flex-col justify-center items-center gap-2 mt-4'>
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Link
                      rel='noreferrer noopener'
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}
                      className={`bg-accent ${buttonVariants({
                        variant: "ghost",
                      })}`}
                    >
                      {label}
                    </Link>
                  ))}
                  <Separator className='my-4' />
                  <Link
                    href='/auth/signin'
                    className={`w-[110px] ${buttonVariants({
                      variant: "ghost",
                    })}`}
                  >
                    Sign In
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className='hidden md:flex gap-2'>
            {routeList.map((route: RouteProps, i) => (
              <Link
                rel='noreferrer noopener'
                href={route.href}
                key={i}
                className={`text-[17px] ${
                  currPath === route.href ? "bg-accent" : ""
                } ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className='hidden md:flex gap-2'>
            <Link
              href='/auth/signin'
              className={`${buttonVariants({
                variant: "ghost",
              })}`}
            >
              Sign In
            </Link>
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
