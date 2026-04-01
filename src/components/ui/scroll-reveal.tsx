"use client";

import { motion, type Variants } from "framer-motion";

// ─────────────────────────────────────────────
// 1. ScrollReveal
//    Bọc bất kỳ thứ gì → tự động fade + slide-up khi cuộn tới
//
// Usage:
//   <ScrollReveal>
//     <h2>Title</h2>
//   </ScrollReveal>
//
//   <ScrollReveal delay={0.2} y={40}>
//     <Card />
//   </ScrollReveal>
// ─────────────────────────────────────────────
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;       // giây, mặc định 0
  duration?: number;    // giây, mặc định 0.5
  y?: number;           // px, mặc định 24
  once?: boolean;       // chỉ chạy 1 lần, mặc định true
  margin?: string;      // viewport margin, mặc định "-80px"
  as?: "div" | "section" | "article" | "header" | "footer";
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 24,
  once = true,
  margin = "-80px",
  as = "div",
}: ScrollRevealProps) {
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
}

// ─────────────────────────────────────────────
// 2. StaggerContainer + StaggerItem
//    Dùng cho Grid/List: các item con hiện ra lần lượt
//
// Usage:
//   <StaggerContainer className="grid grid-cols-4 gap-6">
//     {items.map((item) => (
//       <StaggerItem key={item.id}>
//         <Card item={item} />
//       </StaggerItem>
//     ))}
//   </StaggerContainer>
// ─────────────────────────────────────────────
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;   // giây giữa mỗi item, mặc định 0.08
  once?: boolean;
  margin?: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  once = true,
  margin = "-60px",
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      custom={staggerDelay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
