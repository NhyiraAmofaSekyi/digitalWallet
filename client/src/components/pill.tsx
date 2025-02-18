import React from "react";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface PillIconProps {
  icon?: IconType; // Optional icon
  text?: string; // Optional text
  className?: string; // Custom class names
  onClick?: () => void; // Click handler
  color?: "neutral" | "blue" | "green" | "red"; // Color variants
}

const PillIcon: React.FC<PillIconProps> = ({
  icon: Icon,
  text,
  className,
  onClick,
  color = "neutral",
}) => {
  // Define color variants
  const colorVariants = {
    neutral: "bg-neutral-100 hover:bg-neutral-200 text-neutral-700",
    blue: "bg-blue-100 hover:bg-blue-200 text-blue-700",
    green: "bg-green-100 hover:bg-green-200 text-green-700",
    red: "bg-red-100 hover:bg-red-200 text-red-700",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }} // Hover animation
      whileTap={{ scale: 0.95 }} // Tap animation
      className={twMerge(
        "flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors duration-200",
        colorVariants[color], // Apply color variant
        className // Merge custom class names
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="w-5 h-5" />} {/* Render icon if provided */}
      {text && <span className="text-sm font-medium">{text}</span>}{" "}
      {/* Render text if provided */}
    </motion.div>
  );
};

export default PillIcon;