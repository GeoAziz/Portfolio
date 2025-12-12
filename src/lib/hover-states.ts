/**
 * Hover State Consistency Guide
 * 
 * This file documents and enforces consistent hover/focus/active states across all interactive elements.
 * Used for buttons, cards, links, and other interactive components.
 */

'use client';

/**
 * Card Hover States
 * - Border color shift
 * - Background subtle lift
 * - Shadow enhancement
 */
export const cardHoverClasses = {
  base: 'border-border hover:border-accent/50 transition-colors duration-300',
  withShadow: 'border-border hover:border-accent/50 hover:shadow-lift-sm transition-all duration-300',
  interactive: 'border-border hover:border-accent/50 hover:shadow-lift-md hover:scale-105 transition-all duration-300',
};

/**
 * Link Hover States
 * - Color shift to accent
 * - Underline appearance (optional)
 */
export const linkHoverClasses = {
  inline: 'text-foreground hover:text-accent transition-colors duration-200',
  underline: 'text-foreground hover:text-accent hover:underline transition-all duration-200',
  nav: 'text-muted-foreground hover:text-accent transition-colors duration-200',
  subtle: 'text-muted-foreground hover:text-foreground transition-colors duration-200',
};

/**
 * Button Hover States
 * - Primary: color shift + scale
 * - Secondary: border color shift
 * - Ghost: background appear + color shift
 */
export const buttonHoverClasses = {
  primary: 'bg-accent hover:bg-accent-dark hover:scale-105 transition-all duration-200 active:scale-95',
  secondary: 'border-border hover:border-accent hover:bg-accent/10 transition-all duration-200',
  ghost: 'hover:bg-accent/10 hover:text-accent transition-all duration-200',
  destructive: 'hover:bg-destructive/90 hover:scale-105 transition-all duration-200 active:scale-95',
};

/**
 * Form Input Hover/Focus States
 * - Border color shift on focus
 * - Background change on focus
 * - Ring appearance
 */
export const inputHoverClasses = {
  base: 'border-border focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 transition-all duration-200',
};

/**
 * Badge/Tag Hover States
 * - Color inversion on hover
 * - Scale slightly
 */
export const badgeHoverClasses = {
  default: 'hover:scale-110 transition-transform duration-200',
  interactive: 'cursor-pointer hover:bg-accent hover:text-background transition-all duration-200',
};

/**
 * Interactive Component Hover States
 * - Glow effect for accent colors
 * - Lift/elevation effect
 */
export const glowHoverClasses = {
  accentSmall: 'hover:shadow-glow-cyan transition-shadow duration-300',
  accentMedium: 'hover:shadow-glow-cyan-md transition-shadow duration-300',
  accentLarge: 'hover:shadow-glow-cyan-lg transition-shadow duration-300',
};

/**
 * Focus State Classes (for accessibility)
 */
export const focusClasses = {
  ring: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  outline: 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
};

/**
 * Disabled State Classes
 */
export const disabledClasses = {
  button: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
  input: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted',
};
