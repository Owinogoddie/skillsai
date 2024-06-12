import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import React from "react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}
export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <h1 className={cn("text-xl font-semibold", font.className)}>
        🥂LearnLoom: Smart Learning
      </h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
