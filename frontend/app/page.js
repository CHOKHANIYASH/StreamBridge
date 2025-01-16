"use client";
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Home() {
  return (
    <BackgroundLines className="flex flex-col items-center justify-center w-full h-full">
      <h2 className="relative z-20 py-2 font-sans text-2xl font-bold tracking-tight text-center text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white md:text-4xl lg:text-7xl md:py-10">
        Stream Bridge
      </h2>
      <p className="max-w-xl mx-auto text-sm text-center md:text-lg text-neutral-700 dark:text-neutral-400">
        Convert .mp4 videos to hls format and share for free.
      </p>
    </BackgroundLines>
  );
}
