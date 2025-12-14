# Navigation Bar - Visual Design System Documentation

## 📐 Geometric Specifications

### Header Container
```
Width:    100% (full viewport)
Height:   64px (h-16)
Position: sticky top-0
Z-index:  50
Radius:   0 (no rounded corners)
Padding:  var(--px-responsive) [24px-48px based on breakpoint]
```

### Safe Area Grid
```
Breakpoint      Desktop    Laptop    Monitor    Ultra-wide
Screen Width    ≥1024px    ≥1280px   ≥1536px    ≥1920px
Header Padding  24px       32px      40px       48px
Max Width       N/A        N/A       N/A        1600px
```

## 🎨 Color System

### Primary Palette
```
Background:      hsl(0, 0%, 4%)     [#0A0A0A]   - Near-black base
Foreground:      hsl(0, 0%, 92%)    [#EAEAEA]   - Off-white text
Muted-FG:        hsl(0, 0%, 60%)    [#999999]   - Light gray
Accent (legacy): hsl(196, 100%, 70%) [#4ECFFF] - Cyan (NOT used in nav)
```

### Component-Specific Colors
```
Nav Active Line:     hsl(0, 0%, 92% / 0.4)    [EAEAEA @ 40% opacity]
Search Border:       hsl(0, 0%, 10% / 0.5)    [1A1A1A @ 50% opacity]
Search Bg:           hsl(0, 0%, 10% / 0.4)    [1A1A1A @ 40% opacity]
Search Bg Hover:     hsl(0, 0%, 10% / 0.6)    [1A1A1A @ 60% opacity]
Brand Hover:         opacity: 0.8              [80% visibility]
```

## 📏 Spacing System

### Horizontal Spacing
```
Container Padding:
  - Mobile:        px-4    (16px)
  - Tablet:        px-6    (24px)
  - Desktop:       px-8    (32px)
  - Large:         px-10   (40px)
  - Ultra-wide:    px-12   (48px)

Internal Gaps:
  - Logo-to-text:  gap-2   (8px)
  - Nav items:     gap-8   (32px)
  - Utilities:     gap-2   (8px)
  - Search button: px-3    (12px)
```

### Vertical Spacing
```
Header Height:    64px (h-16)
Main padding-top: 64px (pt-16)
Vertical center:  Automatic (flexbox centered)
```

## 🔤 Typography Scale

### Font Stack
```
Headlines:  'Space Grotesk', sans-serif   [700 weight]
Body:       'Inter', sans-serif           [400/500/600 weights]
Code:       Monospace system font         [400 weight]
```

### Type Specifications
```
Element          Font      Size    Weight   Line-Height   Color
─────────────────────────────────────────────────────────────
Brand text       Headline  14px    400      1.5          FG
Nav links        Body      14px    400      1.5          Muted-FG/FG
Search label     Body      12px    400      1.5          Muted-FG
Keyboard hint    Mono      12px    400      1.5          Muted-FG
```

### Weight Mapping
```
Regular (400):  Nav links, search label, keyboard hint
Bold (700):     Headlines (not used in nav)
SemiBold (600): Emphasis (not used in nav)
```

## 🎭 Interactive States

### Link States (Inactive)
```
DEFAULT
├─ Color:      text-muted-foreground (60% gray)
├─ Underline:  none
└─ Cursor:     pointer

HOVER
├─ Color:      text-foreground (92% white) [smooth 200ms]
├─ Underline:  1px solid foreground/40% [fade in 200ms]
└─ Cursor:     pointer

FOCUS
├─ Outline:    2px solid ring-color
├─ Offset:     2px
└─ Visible:    always (keyboard accessibility)
```

### Link States (Active)
```
ACTIVE
├─ Color:      text-foreground (92% white)
├─ Underline:  1px solid foreground/40% [always visible]
├─ Offset:     translate-y-1 (4px down)
└─ Cursor:     pointer
```

### Search Button States
```
DEFAULT
├─ Bg:         bg-muted/40
├─ Border:     1px solid border/50%
├─ Icon color: text-muted-foreground
└─ Cursor:     pointer

HOVER
├─ Bg:         bg-muted/60 [smooth 200ms]
├─ Border:     same
├─ Icon color: text-foreground [smooth 200ms]
└─ Cursor:     pointer

FOCUS
├─ Outline:    2px solid ring-color
├─ Offset:     2px
└─ Visible:    always
```

### Brand Link States
```
DEFAULT
├─ Opacity:    100%
├─ Color:      text-foreground
└─ Cursor:     pointer

HOVER
├─ Opacity:    80% [smooth transition]
├─ Color:      text-foreground
└─ Cursor:     pointer

FOCUS
├─ Outline:    2px solid ring-color
├─ Offset:     2px
└─ Visible:    always
```

## ✨ Animation Specifications

### Transition Durations
```
Navigation underline reveal:  200ms ease-out
Link text color change:       200ms ease
Search button hover:          200ms ease
Opacity transitions:          200ms ease
```

### Easing Functions
```
ease-out:  Cubic Bezier (0.16, 1, 0.3, 1)  [for reveal animations]
ease:      Cubic Bezier (0.25, 0.46, 0.45, 0.94)  [for color/opacity]
```

### Keyframe Animations
```
None - Only CSS transitions used for performance
```

## 🔍 Component Specifications

### Logo Mark
```
Shape:          Circle with nested rings (SVG)
Size:           20px × 20px (h-5 w-5)
Color:          text-foreground
Hover:          opacity-80
Fill:           true
Stroke:         2px (from SVG)
```

### Search Icon
```
Type:           Lucide React <Search />
Size:           16px × 16px (h-4 w-4)
Color (normal): text-muted-foreground
Color (hover):  text-foreground
Transition:     200ms ease
```

### Menu Icon (Mobile)
```
Type:           Lucide React <Menu />
Size:           20px × 20px (h-5 w-5)
Color:          text-foreground
Position:       Right side, only on mobile
```

### Search Button Dimensions
```
Height:         40px
Padding-x:      12px (px-3)
Padding-y:      6px (py-1.5)
Border-radius:  8px (rounded-md)
Gap (internal): 8px (gap-2)
```

## 📱 Responsive Breakpoints

### Display Rules
```
Mobile (< 768px)
├─ Brand:       ✅ Visible (logo only, text hidden on xs)
├─ Nav:         ❌ Hidden (in menu)
├─ Search:      ❌ Hidden (via menu)
├─ Menu button: ✅ Visible (hamburger)
└─ Utilities:   ✅ Visible (compact)

Tablet (768px - 1024px)
├─ Brand:       ✅ Visible (logo + text)
├─ Nav:         ✅ Visible (full)
├─ Search:      ✅ Visible (no hint)
├─ Menu button: ❌ Hidden
└─ Utilities:   ✅ Visible

Desktop (1024px - 1920px)
├─ Brand:       ✅ Visible
├─ Nav:         ✅ Visible (centered)
├─ Search:      ✅ Visible (with hint)
├─ Menu button: ❌ Hidden
└─ Utilities:   ✅ Visible

Ultra-wide (≥ 1920px)
├─ All visible with max-width constraint (1600px)
└─ Prevents awkward stretching
```

## 🔐 Accessibility Features

### Contrast Ratios (WCAG AA)
```
Foreground on Background:      92% on 4% ≈ 18:1 ✅ (AAA)
Muted-FG on Background:        60% on 4% ≈ 4.5:1 ✅ (AA)
Search Border on Background:   10% on 4% ≈ 1.3:1 ⚠️  (border only)
```

### Focus Indicators
```
Color:          ring-color (cyan)
Width:          2px
Offset:         2px
Visibility:     Always (not hidden on focus-visible)
Style:          Solid outline
```

### Keyboard Navigation
```
Tab:      Move between interactive elements
Enter:    Activate focused link/button
Escape:   Close mobile menu (if open)
Cmd+K:    Open command palette (custom event)
```

### Screen Reader Support
```
Navigation:      <nav> semantic element
Links:           Proper <a> tags with href
Buttons:         Proper <button> tags
Icons:           aria-label on icon-only buttons
Hidden elements: .sr-only class for skip links
Mobile menu:     SheetTitle with sr-only
```

## 📊 Visual Hierarchy

```
Level 1 (Highest)
├─ Brand logo + text  [Always visible, left-aligned]
└─ Navigation items   [Primary action area]

Level 2 (Medium)
├─ Search button      [Important but subtle]
└─ Theme/Language     [Utilities, lower priority]

Level 3 (Lower)
└─ Keyboard hint      [Affordance, not dominant]
```

## 🚀 Performance Optimizations

### CSS Optimizations
```
✅ Transform-based animations (GPU accelerated)
✅ Opacity transitions (lightweight)
✅ No box-shadow animations
✅ No expensive calculations
✅ Minimal DOM queries
```

### JavaScript Optimizations
```
✅ Event delegation where possible
✅ Debounced resize handlers (if any)
✅ No animation libraries (pure CSS)
✅ Efficient link active detection
```

### Layout Optimizations
```
✅ Flexbox (single-pass layout)
✅ No nested grids
✅ Fixed header height (no reflow)
✅ Constrained max-width (prevents layout shift)
```

## 🎯 Design Tokens Summary

```typescript
// Header
{
  height: '64px',
  paddingX: { sm: '16px', md: '24px', lg: '32px', xl: '40px', '2xl': '48px' },
  maxWidth: '1600px',
  zIndex: 50,
  background: 'rgba(10, 10, 10, 0.8)',
  backdropBlur: 'blur(12px)'
}

// Typography
{
  font: 'Inter, Space Grotesk (headline)',
  size: ['12px', '14px'],
  weight: 400,
  lineHeight: 1.5
}

// Colors
{
  foreground: '#EAEAEA',
  mutedForeground: '#999999',
  background: '#0A0A0A',
  muted: '#1A1A1A'
}

// Spacing
{
  gap: { tight: '8px', normal: '32px' },
  padding: { x: '12px', y: '6px' }
}

// Animations
{
  duration: 200,
  easing: 'ease-out'
}
```

---

**Design System Version**: 1.0  
**Last Updated**: December 14, 2025  
**Status**: Production Ready ✅
