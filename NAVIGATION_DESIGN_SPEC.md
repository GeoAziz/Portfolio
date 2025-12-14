# Navigation Bar - Desktop Implementation Guide

## Visual Layout (Desktop)

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  [●] Personal OS    Systems  AI  Hardware  Research  Open Source  │
│                                                                    │
│                               Blog  Resume   [🔍 Search ⌘K] [⚙️][🌐]│
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
   ↑                                ↑                              ↑
   Left Section              Center Section                Right Section
   (Brand)              (Primary Navigation)              (Utilities)
```

## Component Specifications

### Overall Header
- **Height**: 64px (`h-16`)
- **Background**: Dark, near-black with subtle transparency
- **Backdrop**: Blur effect for depth
- **Border**: None
- **Positioning**: Sticky, top-aligned
- **Z-Index**: 50 (high priority)

### Left Section (Brand)
```
[●] Personal OS
│   │   └─ text: "Personal OS"
│   │     - font: Headline (Space Grotesk)
│     - size: 14px (text-sm)
│     - weight: regular (font-normal)
│     - color: Foreground (92% white)
│     - visible: sm breakpoint and up
│
└─ Logo: Ring/circle icon
  - size: 20px (h-5 w-5)
  - color: Foreground
  - hover: opacity-80
```

### Center Section (Navigation)
```
Systems | AI | Hardware | Research | Open Source | Blog | Resume
   ↓
- Font: Body (Inter), Regular weight
- Size: 14px (text-sm)
- Color: 
  * Active: Foreground (92% white)
  * Inactive: Muted-foreground (60% gray)
  * Hover: Foreground + underline
- Spacing: 32px gap between items
- Visible: md breakpoint and up
- Active indicator: Subtle underline (1px, 40% opacity)
```

### Right Section (Utilities)
```
[🔍 Search ⌘K] [⚙️ Theme] [🌐 Language]
```

#### Search Button
- **Visible**: md breakpoint and up
- **Style**: Minimal, understated
- **Background**: Muted/40% opacity
- **Border**: Thin, subtle (border/50%)
- **Padding**: 6px horizontal, 6px vertical
- **Corner**: Rounded (md)
- **Hover**: bg-muted/60 transition
- **Content**: 
  - Search icon (4px, muted-gray)
  - Text label: "Search" (text-xs)
  - Keyboard hint: "⌘K" (hidden on small screens)

#### Theme Toggle & Language Switcher
- **Size**: Icon-based, compact
- **Gap**: 8px between elements
- **Color**: Inherit from component defaults
- **Hover**: Subtle transitions

## Color Palette

| Element | Color | HSL/HEX |
|---------|-------|---------|
| Background | `bg-background/80` | 0 0% 4% |
| Foreground | `text-foreground` | 0 0% 92% |
| Muted (secondary) | `text-muted-foreground` | 0 0% 60% |
| Border | `border-border/50` | 0 0% 10% |
| Accent (hover) | `bg-muted/60` | 0 0% 10% |

## Hover States

### Navigation Link (Inactive)
```
Normal:   "AI" → text-muted-foreground
Hover:    "AI" → text-foreground + 1px underline
```

### Navigation Link (Active)
```
"Systems" → text-foreground + fixed underline
```

### Search Button
```
Normal:   bg-muted/40, border-border/50
Hover:    bg-muted/60, icon & text lighten
```

### Brand Link
```
Normal:   opacity-100
Hover:    opacity-80
```

## Responsive Behavior

### Desktop (md and above: 768px+)
- Full horizontal layout
- Navigation centered
- Search visible with keyboard hint
- Brand and utilities always visible
- **Padding**: px-6 lg:px-8 xl:px-10 2xl:px-12

### Tablet (md: 768px)
- Same as desktop
- Keyboard hint hidden (⌘K visible on lg+)

### Mobile (< md: 768px)
- Brand always visible on left
- Hamburger menu triggers sheet overlay
- Utilities (theme, language) compact on right
- Navigation moved to sheet

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Brand text | Headline | 14px | Regular | Foreground |
| Nav links | Body | 14px | Regular | Muted-FG / FG |
| Search text | Body | 12px | Regular | Muted-FG |
| Keyboard hint | Mono | 12px | Regular | Muted-FG |

## Spacing Reference

| Item | Value |
|------|-------|
| Header height | 64px |
| Nav gap (center) | 32px |
| Utilities gap | 12px |
| Horizontal padding | 24px - 48px |
| Brand-to-nav margin | N/A (flex-1) |

## Animation Timings

| Action | Duration | Easing |
|--------|----------|--------|
| Link hover underline | 200ms | ease-out |
| Button hover bg | 200ms | ease |
| Opacity transitions | 200ms | ease |

## Accessibility

- All interactive elements have proper focus states
- Keyboard navigation supported (⌘K for search)
- Screen reader hints on icon buttons
- Sufficient color contrast (WCAG AA)
- Navigation landmark properly structured

## Code Locations

- Component: `/components/Navigation.tsx`
- Styles: `/src/app/globals.css` (nav-link-hover)
- Layout: `/src/app/layout.tsx` (pt-16 for spacing)

---

*Design Intent: This header is infrastructural, not decorative. It communicates technical confidence, editorial discipline, and systems thinking.*
