
import { Variants } from 'framer-motion';

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideDown: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideInLeft: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    x: -30, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const slideInRight: Variants = {
  hidden: { x: 30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    x: 30, 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const scaleUp: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    }
  }
};

export const itemFade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};
