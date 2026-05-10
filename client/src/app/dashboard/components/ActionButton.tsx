"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

const variantClasses = {
  primary:
    "bg-teal-300 text-zinc-950 hover:bg-teal-200",
  secondary:
    "border border-white/15 text-white hover:border-white/35 hover:bg-white/10",
  danger:
    "border border-rose-300/20 text-rose-200 hover:bg-rose-300/10",
  ghost:
    "border border-white/15 text-zinc-200 hover:border-teal-300/50 hover:bg-teal-300/10 hover:text-teal-100",
};

export default function ActionButton({
  children,
  className = "",
  variant = "primary",
  ...props
}: ActionButtonProps) {
  return (
    <button
      className={`rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
