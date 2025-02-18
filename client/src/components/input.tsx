import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "framer-motion";


const inputVariants = cva(
  "w-full border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg",
      },
      intent: {
        primary:
          "border-neutral-300 focus:border-blue-500 focus:ring-blue-200",
        secondary:
          "border-neutral-300 focus:border-purple-500 focus:ring-purple-200",
        danger: "border-red-300 focus:border-red-500 focus:ring-red-200",
        success: "border-green-300 focus:border-green-500 focus:ring-green-200",
      },
    },
    defaultVariants: {
      size: "md",
      intent: "primary",
    },
  }
);

// Extend input props to include variants and motion props
interface InputProps
  extends Omit<HTMLMotionProps<"input">, "size" | "onDrag" | "onDragStart" | "onDragEnd">,
    VariantProps<typeof inputVariants> {
  className?: string; // Custom class names
  disabled?: boolean; // Disabled state
}

// Input component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, intent, disabled, ...props }, ref) => {
    return (
      <motion.input
        whileHover={{ scale: 1.02 }} // Hover animation
        whileTap={{ scale: 0.98 }} // Tap animation
        transition={{ type: "spring", stiffness: 300, damping: 20 }} // Smooth spring animation
        className={twMerge(
          inputVariants({ size, intent, className }),
          disabled && "bg-neutral-100 cursor-not-allowed" // Disabled styles
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input"; // Set display name for debugging

export default Input;