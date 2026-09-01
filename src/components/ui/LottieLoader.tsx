"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import spoonLoaderData from "@/assets/animation/Spoon_Loader.json";

interface LottieLoaderProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  text?: string;
}

export function LottieLoader({ className = "", size = "md", text }: LottieLoaderProps) {
  const sizeClasses = {
    xs: "w-5 h-5",
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
    full: "w-full h-full max-w-xs",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]}`}>
        <DotLottieReact
          data={spoonLoaderData}
          loop
          autoplay
        />
      </div>
      {text && <p className="mt-4 text-sm font-medium text-brand-muted animate-pulse">{text}</p>}
    </div>
  );
}
