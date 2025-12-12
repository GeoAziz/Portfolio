# 📚 Design System & Component Library - Quick Reference

**For developers working on the Astreaus Portfolio**

---

## 🎨 Using the Design System

### Importing Colors
```typescript
import { colors } from '@/lib/design-system';

// Usage in styled components or CSS
const accentColor = colors.accent.primary;  // Cyan
const systemsColor = colors.domain.systems; // For systems domain
const successColor = colors.semantic.success;

// All color options:
// colors.neutral (grays)
// colors.accent (primary cyan + variants)
// colors.domain (systems, ai, hardware, research, opensource)
// colors.semantic (success, warning, error, info)
// colors.background (primary, secondary, tertiary, hover)
// colors.text (primary, secondary, tertiary, inverse)
// colors.border (primary, secondary, accent)
```

### Using Spacing
```typescript
import { spacing } from '@/lib/design-system';

// Spacing scale (xs to 5xl)
const padding = spacing.md;        // 1rem (16px)
const gapSize = spacing.lg;        // 1.5rem (24px)

// Named sizes for pages and components
const pagePadding = spacing.page.padding;      // 1rem
const componentGap = spacing.component.normal; // 1rem
const sectionGap = spacing.section.large;     // 3rem
```

### Using Typography
```typescript
import { typography } from '@/lib/design-system';

// Font families
const headlineFont = typography.font.headline;  // 'Space Grotesk'
const bodyFont = typography.font.body;          // 'Inter'
const monoFont = typography.font.mono;          // 'Fira Code'

// Sizes
const largeText = typography.size['3xl'];       // 1.875rem

// Presets (recommended for consistency)
const headlineStyle = typography.preset.headline;
const bodyStyle = typography.preset.body;
const codeStyle = typography.preset.code;
```

### Using Shadows
```typescript
import { shadows } from '@/lib/design-system';

// Subtle shadows
const cardShadow = shadows.md;                  // Standard card shadow
const hoverShadow = shadows.lift.md;           // On hover

// Glow effects (cyan)
const cyanGlow = shadows.glow.cyan;            // Default
const cyanGlowMd = shadows.glow.cyanMd;        // Medium glow
const cyanGlowLg = shadows.glow.cyanLg;        // Large glow
```

### Using Animations
```typescript
import { animations } from '@/lib/design-system';

// Durations
const fastDuration = animations.duration.fast;    // 100ms
const normalDuration = animations.duration.normal; // 200ms
const slowDuration = animations.duration.slower;   // 500ms

// Easing functions
const easeOut = animations.easing.easeOut;
const smooth = animations.easing.smooth;

// Presets
const fadeInPreset = animations.presets.fadeInUp;
```

---

## 🎬 Using Animation Variants

### Basic Usage
```typescript
import { variants } from '@/lib/animation-variants';
import { motion } from 'framer-motion';

// Fade in on scroll
<motion.div
  variants={variants.fadeIn}
  initial="hidden"
  whileInView="visible"
>
  Content
</motion.div>

// List animation (staggered children)
<motion.div
  variants={variants.container}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item} variants={variants.fadeInUp}>
      {item}
    </motion.div>
  ))}
</motion.div>

// Hover effect on card
<motion.div
  variants={variants.cardHover}
  initial="rest"
  whileHover="hover"
>
  Card content
</motion.div>

// Tap effect on button
<motion.button
  variants={variants.buttonTap}
  initial="rest"
  whileTap="tap"
>
  Click me
</motion.button>
```

### Available Variants
```typescript
// Entrance animations
variants.fadeIn
variants.fadeInUp
variants.fadeInDown
variants.fadeInLeft
variants.fadeInRight
variants.scaleIn
variants.scaleInSmall
variants.rotateIn

// Interactive
variants.cardHover
variants.buttonHover
variants.linkHover
variants.tap
variants.buttonTap

// Page transitions
variants.pageEnter
variants.pageExit
variants.pageFade

// Modals & drawers
variants.modalBackdrop
variants.modalContent
variants.drawer

// Loading states
variants.skeletonPulse
variants.skeletonShimmer

// Floating elements
variants.floating
variants.breathing
variants.glowing
variants.orbit
variants.counterRotate

// Text
variants.textReveal
variants.letterSpacing

// Pre-built combinations
variants.cardList        // container + fadeInUp items
variants.staggeredList   // container + scaleIn items
variants.heroSection     // title, subtitle, cta presets
```

---

## 🏗️ Using Layout Components

### PageHeader
```typescript
import { PageHeader } from '@/components/layouts';
import { Cpu } from 'lucide-react';

<PageHeader
  title="AI Systems & Cognitive Engines"
  description="My playground for ML models and intelligent pipelines."
  icon={<Cpu className="w-10 h-10 text-accent-ai" />}
  subtitle="Optional subtitle for additional context"
/>
```

### PageSection
```typescript
import { PageSection } from '@/components/layouts';

<PageSection
  spacing="large"        // 'small', 'normal', 'large', 'xlarge'
  maxWidth="lg"         // 'sm', 'md', 'lg', 'xl', 'full'
  animate={true}        // scroll-triggered animation
  id="projects-section"
>
  <h2>Section Title</h2>
  {/* Content */}
</PageSection>
```

### SectionHeader
```typescript
import { SectionHeader } from '@/components/layouts';

<SectionHeader
  title="Model Playground"
  subtitle="Interactive AI models and experiments"
  align="center"  // 'left', 'center', 'right'
/>
```

### ContentGrid
```typescript
import { ContentGrid } from '@/components/layouts';

<ContentGrid
  columns={3}    // 1, 2, 3, or 4
  gap="lg"       // 'sm', 'md', 'lg', 'xl'
  animate={true}
>
  {items.map(item => <Card key={item.id}>{item.name}</Card>)}
</ContentGrid>
```

---

## 🚨 Using Error Boundary

### Basic Usage
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary componentName="SkillOrbit">
  <SkillOrbit />
</ErrorBoundary>
```

### With Custom Fallback
```typescript
import { ErrorBoundaryWithFallback } from '@/components/ErrorBoundary';

<ErrorBoundaryWithFallback
  componentName="ModelViewer"
  fallbackTitle="3D Model Failed to Load"
  fallbackDescription="The 3D viewer couldn't load. Please try again or contact support."
>
  <ModelViewer modelSrc="/models/hardware.glb" />
</ErrorBoundaryWithFallback>
```

### With Error Logging
```typescript
<ErrorBoundary
  componentName="AIChat"
  onError={(error, info) => {
    // Send to Sentry, LogRocket, or custom service
    logErrorToService({
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }}
>
  <AIChat />
</ErrorBoundary>
```

---

## 📱 Responsive Breakpoints

```typescript
import { breakpoints } from '@/lib/design-system';

// Use in media queries
const mediaQuery = breakpoints.media.tablet; // '(min-width: 768px)'

// Or in Tailwind: md:, lg:, xl: prefixes
// Mobile: 320px+
// Tablet: 768px+
// Desktop: 1024px+
// Wide: 1280px+
```

---

## 🎯 Best Practices

### 1. Always Use Design System Values
```typescript
// ❌ Don't: hardcode values
className="p-4 gap-6 text-lg"

// ✅ Do: use semantic names
className="p-md gap-lg text-lg"
```

### 2. Combine Layout Components
```typescript
// ❌ Don't: duplicate header markup
<div className="text-center space-y-4">
  <h1>Title</h1>
  <p>Description</p>
</div>

// ✅ Do: use PageHeader
<PageHeader title="Title" description="Description" />
```

### 3. Use Variants for Animations
```typescript
// ❌ Don't: repeat animation configs
variants={{ ... animate={{ opacity: 1 }} ...}} for each component

// ✅ Do: use predefined variants
variants={variants.fadeInUp}
initial="hidden"
whileInView="visible"
```

### 4. Wrap with Error Boundaries
```typescript
// ❌ Don't: let components crash the page
<SkillOrbit />

// ✅ Do: protect with error boundary
<ErrorBoundary componentName="SkillOrbit">
  <SkillOrbit />
</ErrorBoundary>
```

### 5. Use PageSection for Spacing
```typescript
// ❌ Don't: manually manage spacing
<section className="my-16 space-y-8">

// ✅ Do: use PageSection
<PageSection spacing="large">
```

---

## 🔗 File Locations

| Resource | Location |
|----------|----------|
| Design System | `src/lib/design-system.ts` |
| Animation Variants | `src/lib/animation-variants.ts` |
| Layout Components | `src/components/layouts/` |
| Error Boundary | `src/components/ErrorBoundary.tsx` |
| Utils | `src/lib/utils.ts` |

---

## 📖 Example: Complete Page

```typescript
'use client';

import { PageHeader, PageSection, SectionHeader, ContentGrid } from '@/components/layouts';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card } from '@/components/ui/card';
import { Cpu } from 'lucide-react';
import aiModelsData from '@/data/ai-models.json';

const { models } = aiModelsData;

export default function AIPage() {
  return (
    <div className="space-y-section-large">
      {/* Header */}
      <PageHeader
        title="AI Systems & Cognitive Engines"
        description="Playground for ML models and intelligent pipelines."
        icon={<Cpu className="w-10 h-10 text-accent-ai" />}
      />

      {/* Models Section */}
      <PageSection spacing="large">
        <SectionHeader
          title="Model Playground"
          subtitle="Interactive models and experiments"
        />

        <ErrorBoundary componentName="ModelGrid">
          <ContentGrid columns={4} gap="lg">
            {models.map(model => (
              <Card key={model.name} className="p-lg">
                <h3 className="font-headline text-lg">{model.name}</h3>
                <p className="text-muted-foreground text-sm">{model.type}</p>
              </Card>
            ))}
          </ContentGrid>
        </ErrorBoundary>
      </PageSection>
    </div>
  );
}
```

---

## ✨ Summary

- **Design System:** Colors, spacing, typography, shadows, animations all centralized
- **Animation Variants:** Pre-built Framer Motion configs for consistency
- **Layout Components:** Reusable page structure components
- **Error Boundary:** Graceful error handling
- **Focus:** Consistency, maintainability, rapid development

**Ready to build!** 🚀
