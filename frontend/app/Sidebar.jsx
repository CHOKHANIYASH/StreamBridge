"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconLogin,
  IconUserPlus,
  IconVideo,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
export default function SideBar({ children }) {
  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconBrandTabler className="text-deepCharcoal dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconUserBolt className="text-deepCharcoal dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Login",
      href: "/login",
      icon: (
        <IconLogin className="text-deepCharcoal dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "signup",
      href: "/signup",
      icon: (
        <IconUserPlus className="text-deepCharcoal dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-deepCharcoal dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        " flex flex-col md:flex-row bg-gray-100 dark:bg-grayishWhite w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-royalBlue dark:bg-royalBlue ">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <IconVideo />}
            <div className="mt-8 flex flex-col gap-2 ">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1">{children}</div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-charcoalGray py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-grayishWhite dark:bg-grayishWhite rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <IconVideo />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-charcoalGray dark:text-white whitespace-pre"
      >
        Stream Bridge
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-charcoalGray py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-grayishWhite dark:bg-grayishWhite rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
