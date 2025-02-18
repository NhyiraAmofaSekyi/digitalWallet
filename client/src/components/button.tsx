import { cva, VariantProps } from "class-variance-authority";
import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion, HTMLMotionProps } from "framer-motion";
import { IconType } from "react-icons";

// Define button variants using `cva`
const buttonVariants = cva(
  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-neutral-200 bg-neutral-50 text-base font-semibold text-neutral-900 cursor-pointer transition-colors duration-200 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2",
  {
    variants: {
      shape: {
        default: "rounded-lg",
        round: "rounded-full",
      },
      size: {
        default: "px-4 py-2",
        icon: "p-3", // For round buttons with icons
      },
    },
    defaultVariants: {
      shape: "default",
      size: "default",
    },
  }
);

// Extend button props to include variants and optional icons
interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "onDrag" | "onDragStart" | "onDragEnd">,
    VariantProps<typeof buttonVariants> {
  leftIcon?: IconType;
  rightIcon?: IconType;
  children: ReactNode; // Explicitly define children as ReactNode
}

// Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      shape,
      size,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }} // Simple hover animation
        whileTap={{ scale: 0.95 }} // Simple tap animation
        className={twMerge(buttonVariants({ shape, size, className }))}
        ref={ref}
        {...props}
      >
        {LeftIcon && <LeftIcon className="w-4 h-4" />} {/* Left icon */}
        {children} {/* Button text */}
        {RightIcon && <RightIcon className="w-4 h-4" />} {/* Right icon */}
      </motion.button>
    );
  }
);

Button.displayName = "Button"; // Set display name for debugging

export default Button;