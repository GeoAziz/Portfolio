/**
 * Animation Variants Library
 * 
 * Centralized Framer Motion animation presets and configurations.
 * Ensures consistency across all pages and components.
 * 
 * Usage:
 * import { variants } from '@/lib/animation-variants';
 * 
 * <motion.div variants={variants.container} initial="hidden" animate="visible">
 *   <motion.div variants={variants.fadeInUp}>Item 1</motion.div>
 * </motion.div>
 */

// ============================================================================
// CONTAINER VARIANTS (for list items, grids, etc.)
// ============================================================================

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const containerVariantsSmall = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// ============================================================================
// INDIVIDUAL ITEM VARIANTS
// ============================================================================

// Fade In
export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Fade + Slide Up
export const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
};

// Fade + Slide Down
export const fadeInDownVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Fade + Slide Left
export const fadeInLeftVariant = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3 } },
};

// Fade + Slide Right
export const fadeInRightVariant = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
  exit: { opacity: 0, x: 30, transition: { duration: 0.3 } },
};

// Scale + Fade In
export const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

// Scale In (smaller start)
export const scaleInSmallVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
};

// Rotate + Fade
export const rotateInVariant = {
  hidden: { opacity: 0, rotate: -10 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: { opacity: 0, rotate: 10, transition: { duration: 0.3 } },
};

// ============================================================================
// HOVER VARIANTS (for interactive elements)
// ============================================================================

export const cardHoverVariant = {
  rest: {
    y: 0,
    shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 },
  },
  hover: {
    y: -6,
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.3 },
  },
};

export const buttonHoverVariant = {
  rest: { scale: 1, transition: { duration: 0.2 } },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const linkHoverVariant = {
  rest: { color: '#ffffff', transition: { duration: 0.2 } },
  hover: { color: 'hsl(196, 100%, 70%)', transition: { duration: 0.2 } },
};

// ============================================================================
// TAP/CLICK VARIANTS
// ============================================================================

export const tapVariant = {
  rest: { scale: 1 },
  tap: { scale: 0.95 },
};

export const buttonTapVariant = {
  rest: { scale: 1, boxShadow: 'none' },
  tap: { scale: 0.97, boxShadow: '0 0 10px hsla(196, 100%, 70%, 0.3)' },
};

// ============================================================================
// PAGE TRANSITION VARIANTS
// ============================================================================

export const pageEnterVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const pageExitVariant = {
  hidden: { opacity: 1, y: 0 },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

export const pageFadeVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

// ============================================================================
// MODAL/DIALOG VARIANTS
// ============================================================================

export const modalBackdropVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const modalContentVariant = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// SIDEBAR/DRAWER VARIANTS
// ============================================================================

export const drawerVariant = {
  hidden: { x: -320, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    x: -320,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// ============================================================================
// SKELETON LOADER VARIANTS
// ============================================================================

export const skeletonPulseVariant = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const skeletonShimmerVariant = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// FLOATING/BREATHING VARIANTS
// ============================================================================

export const floatingVariant = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const breathingVariant = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const glowingVariant = {
  animate: {
    opacity: [0.5, 0.8, 0.5],
    filter: ['drop-shadow(0 0 8px hsla(196, 100%, 70%, 0.4))',
             'drop-shadow(0 0 16px hsla(196, 100%, 70%, 0.6))',
             'drop-shadow(0 0 8px hsla(196, 100%, 70%, 0.4))'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================================================
// PARTICLE/ORBIT VARIANTS
// ============================================================================

export const orbitVariant = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const counterRotateVariant = {
  animate: {
    rotate: -360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================================================
// TEXT VARIANTS
// ============================================================================

export const textRevealVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom * 0.1, ease: 'easeOut' },
  }),
};

export const letterSpacingVariant = {
  rest: { letterSpacing: '0em' },
  hover: { letterSpacing: '0.05em' },
};

// ============================================================================
// COMBINED VARIANTS (pre-built combinations)
// ============================================================================

export const cardListVariants = {
  container: containerVariants,
  item: fadeInUpVariant,
};

export const staggeredListVariants = {
  container: containerVariantsSmall,
  item: scaleInVariant,
};

export const heroSectionVariants = {
  container: containerVariants,
  title: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.1 } },
  },
  subtitle: {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } },
  },
  cta: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.5 } },
  },
};

// ============================================================================
// EXPORT NAMESPACE
// ============================================================================

export const variants = {
  // Containers
  container: containerVariants,
  containerSmall: containerVariantsSmall,

  // Individual items
  fadeIn: fadeInVariant,
  fadeInUp: fadeInUpVariant,
  fadeInDown: fadeInDownVariant,
  fadeInLeft: fadeInLeftVariant,
  fadeInRight: fadeInRightVariant,
  scaleIn: scaleInVariant,
  scaleInSmall: scaleInSmallVariant,
  rotateIn: rotateInVariant,

  // Interactions
  cardHover: cardHoverVariant,
  buttonHover: buttonHoverVariant,
  linkHover: linkHoverVariant,
  tap: tapVariant,
  buttonTap: buttonTapVariant,

  // Page transitions
  pageEnter: pageEnterVariant,
  pageExit: pageExitVariant,
  pageFade: pageFadeVariant,

  // Modals
  modalBackdrop: modalBackdropVariant,
  modalContent: modalContentVariant,

  // Drawer
  drawer: drawerVariant,

  // Loading
  skeletonPulse: skeletonPulseVariant,
  skeletonShimmer: skeletonShimmerVariant,

  // Floating
  floating: floatingVariant,
  breathing: breathingVariant,
  glowing: glowingVariant,

  // Orbits
  orbit: orbitVariant,
  counterRotate: counterRotateVariant,

  // Text
  textReveal: textRevealVariant,
  letterSpacing: letterSpacingVariant,

  // Combined
  cardList: cardListVariants,
  staggeredList: staggeredListVariants,
  heroSection: heroSectionVariants,
};

export default variants;
