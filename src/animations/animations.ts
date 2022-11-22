import { Variants } from "framer-motion";

const easing = [0.6, 0.05, -0.01, 0.99];

type AnimationsKey = "fadeInUp" | "fadeInOut" | "stagger";

const animations: Record<AnimationsKey, Variants> = {
  fadeInUp: {
    initial: {
      y: 60,
      opacity: 0,
    },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: easing,
      },
    },
  },
  fadeInOut: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: easing,
      },
    },
    exit: { opacity: 0 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.2,
        when: "afterChildren",
      },
    },
  },
};

export const { fadeInOut, fadeInUp, stagger } = animations;
