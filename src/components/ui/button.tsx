import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed gap-2",
          {
            "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400 shadow-sm": variant === "primary",
            "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-300 shadow-sm": variant === "secondary",
            "hover:bg-gray-100 text-gray-600 focus:ring-gray-300": variant === "ghost",
            "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 shadow-sm": variant === "danger",
          },
          {
            "text-xs px-2.5 py-1.5": size === "sm",
            "text-sm px-4 py-2": size === "md",
            "text-base px-5 py-2.5": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
