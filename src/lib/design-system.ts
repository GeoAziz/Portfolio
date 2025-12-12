/**
 * Design System
 * 
 * Single source of truth for all design decisions across the Astreaus Portfolio.
 * Colors, spacing, typography, animations, shadows, and breakpoints.
 * 
 * Usage:
 * import { colors, spacing, typography, breakpoints, shadows, animations } from '@/lib/design-system';
 */

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export const colors = {
  // Neutral palette (background, text, borders)
  neutral: {
    50: 'hsl(0, 0%, 98%)',
    100: 'hsl(0, 0%, 96%)',
    200: 'hsl(0, 0%, 90%)',
    300: 'hsl(0, 0%, 80%)',
    400: 'hsl(0, 0%, 60%)',
    500: 'hsl(0, 0%, 40%)',
    600: 'hsl(0, 0%, 25%)',
    700: 'hsl(0, 0%, 15%)',
    800: 'hsl(0, 0%, 10%)',
    900: 'hsl(0, 0%, 5%)',
  },

  // Primary accent (cyan/teal for main brand)
  accent: {
    primary: 'hsl(196, 100%, 70%)',    // Bright cyan
    dark: 'hsl(196, 100%, 60%)',       // Darker cyan
    light: 'hsl(196, 100%, 80%)',      // Lighter cyan
    faint: 'hsl(196, 100%, 90%)',      // Very light cyan
    ultraFaint: 'hsl(196, 100%, 95%)', // Nearly transparent
  },

  // Domain-specific accent colors (for visual categorization)
  domain: {
    systems: 'hsl(196, 100%, 60%)',      // Cyan
    ai: 'hsl(280, 100%, 60%)',           // Purple/Violet
    hardware: 'hsl(30, 100%, 60%)',      // Orange
    research: 'hsl(200, 100%, 60%)',     // Light blue
    opensource: 'hsl(120, 100%, 60%)',   // Green
  },

  // Semantic colors
  semantic: {
    success: 'hsl(120, 100%, 50%)',
    warning: 'hsl(30, 100%, 60%)',
    error: 'hsl(0, 100%, 60%)',
    info: 'hsl(196, 100%, 60%)',
  },

  // Backgrounds (for light/dark mode considerations)
  background: {
    primary: 'hsl(0, 0%, 5%)',        // Almost black
    secondary: 'hsl(0, 0%, 10%)',     // Dark gray
    tertiary: 'hsl(0, 0%, 15%)',      // Lighter dark gray
    hover: 'hsl(0, 0%, 20%)',         // On hover
  },

  // Text colors
  text: {
    primary: 'hsl(0, 0%, 95%)',       // Nearly white
    secondary: 'hsl(0, 0%, 70%)',     // Muted gray
    tertiary: 'hsl(0, 0%, 50%)',      // Even more muted
    inverse: 'hsl(0, 0%, 10%)',       // For light backgrounds
  },

  // Border colors
  border: {
    primary: 'hsl(0, 0%, 20%)',
    secondary: 'hsl(0, 0%, 15%)',
    accent: 'hsl(196, 100%, 70%)',    // Cyan border for emphasis
  },
};

// ============================================================================
// SPACING SYSTEM
// ============================================================================

export const spacing = {
  // Base scale (in rem units)
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px

  // Named sizes for common usage
  page: {
    padding: '1rem',      // Mobile default
    paddingMd: '1.5rem',  // Tablet
    paddingLg: '2rem',    // Desktop
    maxWidth: '1280px',
  },

  // Component gaps
  component: {
    tight: '0.5rem',
    normal: '1rem',
    loose: '1.5rem',
    spacious: '2rem',
  },

  // Section spacing (vertical rhythm)
  section: {
    small: '1.5rem',
    normal: '2rem',
    large: '3rem',
    xlarge: '4rem',
  },
};

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

export const typography = {
  // Font families
  font: {
    headline: "'Space Grotesk', sans-serif",  // Bold, striking
    body: "'Inter', sans-serif",              // Readable, clean
    mono: "'Fira Code', monospace",           // Code/tech elements
  },

  // Font sizes (rem units)
  size: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  // Font weights
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
    wider: '0.1em',
  },

  // Preset combinations (headline, body, code)
  preset: {
    headline: {
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    body: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    code: {
      fontFamily: "'Fira Code', monospace",
      fontWeight: 400,
      lineHeight: 1.5,
      fontSize: '0.875rem',
    },
  },
};

// ============================================================================
// SHADOW SYSTEM
// ============================================================================

export const shadows = {
  // Subtle shadows for depth
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',

  // Glow shadows (for accent colors)
  glow: {
    cyan: '0 0 10px hsla(196, 100%, 70%, 0.5), 0 0 4px hsla(196, 100%, 70%, 0.3)',
    cyanMd: '0 0 16px hsla(196, 100%, 70%, 0.8), 0 0 8px hsla(196, 100%, 70%, 0.6)',
    cyanLg: '0 0 24px hsla(196, 100%, 70%, 1), 0 0 12px hsla(196, 100%, 70%, 0.8)',
  },

  // Lifted shadows (cards on hover)
  lift: {
    sm: '0 4px 12px rgba(0, 0, 0, 0.15)',
    md: '0 8px 24px rgba(0, 0, 0, 0.2)',
    lg: '0 12px 36px rgba(0, 0, 0, 0.25)',
  },
};

// ============================================================================
// BORDER SYSTEM
// ============================================================================

export const borders = {
  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  // Border widths
  width: {
    none: '0',
    px: '1px',
    '0.5': '2px',
    normal: '2px',
    bold: '3px',
  },

  // Border styles (for components)
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  },
};

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

export const animations = {
  // Duration presets (in milliseconds, converted to seconds for CSS)
  duration: {
    instant: '50ms',
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    slowest: '800ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },

  // Common animation configurations
  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 },
    },
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    slideInRight: {
      initial: { opacity: 0, x: 30 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },

  // Stagger configurations (for list animations)
  stagger: {
    sm: 0.05,
    md: 0.1,
    lg: 0.15,
  },
};

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export const breakpoints = {
  // Mobile-first breakpoints
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',

  // Named breakpoints for readability
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',

  // Media query helpers (for use in styled-components or CSS)
  media: {
    mobile: '(min-width: 320px)',
    tablet: '(min-width: 768px)',
    desktop: '(min-width: 1024px)',
    wide: '(min-width: 1280px)',
  },
};

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// ============================================================================
// COMPONENT-SPECIFIC CONFIGURATIONS
// ============================================================================

export const components = {
  // Card configurations
  card: {
    borderColor: colors.border.primary,
    borderWidth: '1px',
    borderRadius: borders.radius.lg,
    shadow: shadows.sm,
    shadowHover: shadows.lift.md,
    backgroundColor: colors.background.secondary,
    padding: spacing.lg,
  },

  // Button configurations
  button: {
    padding: {
      sm: `${spacing.sm} ${spacing.md}`,
      md: `${spacing.md} ${spacing.lg}`,
      lg: `${spacing.lg} ${spacing.xl}`,
    },
    borderRadius: borders.radius.md,
    transitionDuration: animations.duration.fast,
  },

  // Input configurations
  input: {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borders.radius.md,
    borderColor: colors.border.primary,
    backgroundColor: colors.background.secondary,
    textColor: colors.text.primary,
  },

  // Badge configurations
  badge: {
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borders.radius.full,
    fontSize: typography.size.sm,
  },

  // Hover state configurations
  hover: {
    scale: 1.02,
    shadowLift: shadows.lift.md,
    transitionDuration: animations.duration.normal,
  },

  // Focus state configurations (accessibility)
  focus: {
    outlineWidth: '2px',
    outlineColor: colors.accent.primary,
    outlineOffset: '2px',
  },
};

// ============================================================================
// EXPORT DEFAULT (for convenience)
// ============================================================================

export default {
  colors,
  spacing,
  typography,
  shadows,
  borders,
  animations,
  breakpoints,
  zIndex,
  components,
};
