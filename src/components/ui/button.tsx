"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      icon,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-btn transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-sm shadow-primary/20",
      secondary:
        "bg-surface text-gray-200 border border-border hover:bg-card hover:border-gray-500",
      danger: "bg-semantic-danger text-white hover:bg-red-600 shadow-sm shadow-semantic-danger/20",
      ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-card/50",
      accent: "bg-accent text-slate-950 font-semibold hover:bg-cyan-400 shadow-sm shadow-accent/20",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-10",
      lg: "text-base px-6 py-2.5 gap-2.5 h-12",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
