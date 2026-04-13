import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";

export { motion, AnimatePresence };
export type { Variants };

// Page wrapper — fades in the whole page content
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Staggered list container
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// Staggered list item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

// Dropdown/popover
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: { duration: 0.1, ease: "easeIn" as const },
  },
};

// Modal backdrop
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// Modal content
export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

// Expand/collapse (for inline forms)
export const expandVariants: Variants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  show: {
    opacity: 1,
    height: "auto",
    overflow: "visible",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};
