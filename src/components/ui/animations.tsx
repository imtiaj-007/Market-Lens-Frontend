'use client';

import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

// Common animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  },
};

// Reusable animation components
interface AnimatedElementProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  variants?: Variants;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  variants = fadeIn,
  ...props
}: AnimatedElementProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay, duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: AnimatedElementProps) {
  return (
    <FadeIn
      variants={fadeInUp}
      delay={delay}
      duration={duration}
      {...props}
    >
      {children}
    </FadeIn>
  );
}

export function FadeInDown({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: AnimatedElementProps) {
  return (
    <FadeIn
      variants={fadeInDown}
      delay={delay}
      duration={duration}
      {...props}
    >
      {children}
    </FadeIn>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: AnimatedElementProps) {
  return (
    <FadeIn
      variants={scaleIn}
      delay={delay}
      duration={duration}
      {...props}
    >
      {children}
    </FadeIn>
  );
}

export function SlideInLeft({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: AnimatedElementProps) {
  return (
    <FadeIn
      variants={slideInLeft}
      delay={delay}
      duration={duration}
      {...props}
    >
      {children}
    </FadeIn>
  );
}

export function SlideInRight({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: AnimatedElementProps) {
  return (
    <FadeIn
      variants={slideInRight}
      delay={delay}
      duration={duration}
      {...props}
    >
      {children}
    </FadeIn>
  );
}

interface StaggerContainerProps extends AnimatedElementProps {
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  delay = 0,
  duration = 0.5,
  staggerDelay = 0.1,
  ...props
}: StaggerContainerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
        duration
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Stagger item to be used inside StaggerContainer
export function StaggerItem({
  children,
  variants = fadeInUp,
  ...props
}: AnimatedElementProps) {
  return (
    <motion.div variants={variants} {...props}>
      {children}
    </motion.div>
  );
} 