"use client";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useContext } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconLogin,
  IconUserPlus,
  IconVideo,
  IconUpload,
} from "@tabler/icons-react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AuthContext } from "./AuthContext";
export default function SideBar({ children }) {
  const { userId, isAuthenticated } = useContext(AuthContext);
  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconBrandTabler className="flex-shrink-0 w-5 h-5 text-deepCharcoal dark:text-neutral-200" />
      ),
    },
    {
      label: "Dashboard",
      href: userId === "" ? "/dashboard/1" : `/dashboard/${userId}`,
      icon: (
        <IconUserBolt className="flex-shrink-0 w-5 h-5 text-deepCharcoal dark:text-neutral-200" />
      ),
    },
    {
      label: "Upload",
      href: "/video/upload",
      icon: (
        <IconUpload className="flex-shrink-0 w-5 h-5 text-deepCharcoal dark:text-neutral-200" />
      ),
    },
    ...(!isAuthenticated
      ? [
          {
            label: "Login",
            href: "/login",
            icon: (
              <IconLogin className="flex-shrink-0 w-5 h-5 text-deepCharcoal dark:text-neutral-200" />
            ),
          },
          {
            label: "Signup",
            href: "/signup",
            icon: (
              <IconUserPlus className="flex-shrink-0 w-5 h-5 text-deepCharcoal dark:text-neutral-200" />
            ),
          },
        ]
      : [
          {
            label: "Logout",
            href: "/logout",
            icon: (
              <IconArrowLeft className="flex-shrink-0 w-5 h-5 text-deepCharcoal dark:text-neutral-200" />
            ),
          },
        ]),
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        " flex flex-col md:flex-row bg-gray-100 dark:bg-grayishWhite w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-full"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="z-50 justify-between gap-10 bg-royalBlue dark:bg-royalBlue">
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <IconVideo />}
            <div className="flex flex-col gap-2 mt-8 ">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={() => setOpen(false)}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1">
        <ToastContainer autoClose={2000} />
        {children}
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center py-1 space-x-2 text-sm font-normal text-charcoalGray"
    >
      <div className="flex-shrink-0 w-6 h-5 rounded-tl-lg rounded-tr-sm rounded-bl-sm rounded-br-lg bg-grayishWhite dark:bg-grayishWhite" />
      <IconVideo />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-charcoalGray dark:text-white"
      >
        StreamBridge
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center py-1 space-x-2 text-sm font-normal text-charcoalGray"
    >
      <div className="flex-shrink-0 w-6 h-5 rounded-tl-lg rounded-tr-sm rounded-bl-sm rounded-br-lg bg-grayishWhite dark:bg-grayishWhite" />
    </Link>
  );
};
