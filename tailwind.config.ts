import type {Config} from 'tailwindcss';
import { colors, spacing, typography, shadows, breakpoints } from './src/lib/design-system';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.mdx',
  ],
  theme: {
    container: {
      center: true,
      padding: spacing.md,
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontSize: {
        'xs': typography.size.xs,
        'sm': typography.size.sm,
        'base': typography.size.base,
        'lg': typography.size.lg,
        'xl': typography.size.xl,
        '2xl': typography.size['2xl'],
        '3xl': typography.size['3xl'],
        '4xl': typography.size['4xl'],
        '5xl': typography.size['5xl'],
        '6xl': typography.size['6xl'],
        '7xl': typography.size['7xl'],
      },
      fontFamily: {
        body: typography.font.body.split(',').map(f => f.trim()),
        headline: typography.font.headline.split(',').map(f => f.trim()),
        code: [typography.font.mono],
      },
      colors: {
        // Semantic colors
        background: colors.background.primary,
        foreground: colors.text.primary,
        card: {
          DEFAULT: colors.background.secondary,
          foreground: colors.text.primary,
        },
        popover: {
          DEFAULT: colors.background.tertiary,
          foreground: colors.text.primary,
        },
        primary: {
          DEFAULT: colors.accent.primary,
          foreground: colors.text.inverse,
        },
        secondary: {
          DEFAULT: colors.background.secondary,
          foreground: colors.text.secondary,
        },
        muted: {
          DEFAULT: colors.background.hover,
          foreground: colors.text.secondary,
        },
        accent: {
          DEFAULT: colors.accent.primary,
          dark: colors.accent.dark,
          light: colors.accent.light,
          faint: colors.accent.faint,
          foreground: colors.text.inverse,
          systems: colors.domain.systems,
          ai: colors.domain.ai,
          hardware: colors.domain.hardware,
          research: colors.domain.research,
          opensource: colors.domain.opensource,
        },
        destructive: {
          DEFAULT: colors.semantic.error,
          foreground: colors.text.inverse,
        },
        border: colors.border.primary,
        input: colors.background.secondary,
        ring: colors.accent.primary,
        chart: {
          '1': colors.semantic.success,
          '2': colors.semantic.warning,
          '3': colors.semantic.error,
          '4': colors.semantic.info,
          '5': colors.accent.primary,
        },
        sidebar: {
          DEFAULT: colors.background.secondary,
          foreground: colors.text.primary,
          primary: colors.accent.primary,
          'primary-foreground': colors.text.inverse,
          accent: colors.accent.light,
          'accent-foreground': colors.text.inverse,
          border: colors.border.secondary,
          ring: colors.accent.primary,
        },
      },
      spacing: {
        xs: spacing.xs,
        sm: spacing.sm,
        md: spacing.md,
        lg: spacing.lg,
        xl: spacing.xl,
        '2xl': spacing['2xl'],
        '3xl': spacing['3xl'],
        '4xl': spacing['4xl'],
        '5xl': spacing['5xl'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      boxShadow: {
        none: shadows.none,
        xs: shadows.xs,
        sm: shadows.sm,
        md: shadows.md,
        lg: shadows.lg,
        xl: shadows.xl,
        'glow-cyan': shadows.glow.cyan,
        'glow-cyan-md': shadows.glow.cyanMd,
        'glow-cyan-lg': shadows.glow.cyanLg,
        'lift-sm': shadows.lift.sm,
        'lift-md': shadows.lift.md,
        'lift-lg': shadows.lift.lg,
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-in-out forwards',
      },
      screens: {
        xs: `${breakpoints.xs}px`,
        sm: `${breakpoints.sm}px`,
        md: `${breakpoints.md}px`,
        lg: `${breakpoints.lg}px`,
        xl: `${breakpoints.xl}px`,
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),
            a: {
              color: theme('colors.accent.DEFAULT'),
              '&:hover': {
                color: theme('colors.accent.light'),
              },
            },
            h1: {
              color: theme('colors.foreground'),
              fontWeight: typography.weight.bold,
            },
            h2: {
              color: theme('colors.foreground'),
              fontWeight: typography.weight.bold,
            },
            h3: {
              color: theme('colors.foreground'),
              fontWeight: typography.weight.semibold,
            },
            h4: {
              color: theme('colors.foreground'),
              fontWeight: typography.weight.semibold,
            },
            strong: {
              color: theme('colors.foreground'),
              fontWeight: typography.weight.bold,
            },
            code: {
              color: theme('colors.text.inverse'),
              backgroundColor: theme('colors.accent.dark'),
              padding: '0.2em 0.4em',
              borderRadius: '0.3em',
            },
            pre: {
              backgroundColor: theme('colors.background.secondary'),
            },
            blockquote: {
              color: theme('colors.text.secondary'),
              borderLeftColor: theme('colors.border.accent'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
