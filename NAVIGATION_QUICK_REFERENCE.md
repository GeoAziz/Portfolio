# Navigation Bar - Quick Reference Card

## 📐 Dimensions

```
┌─────────────────────────────────────────────────────┐
│ Height: 64px (h-16)                                 │
├─────────────────────────────────────────────────────┤
│  Padding: 24px (sm) | 32px (lg) | 40px (xl) | 48px (2xl)
├─────────────────────────────────────────────────────┤
│  Max-width: 1600px                                  │
├─────────────────────────────────────────────────────┤
│  Logo: 20px × 20px                                  │
│  Icons: 16px × 16px                                 │
└─────────────────────────────────────────────────────┘
```

## 🎨 Color Palette

| Component | Color | Value |
|-----------|-------|-------|
| Background | `bg-background/80` | 0 0% 4% |
| Brand/Nav Links | `text-foreground` | 0 0% 92% |
| Inactive Links | `text-muted-foreground` | 0 0% 60% |
| Active Underline | `bg-foreground/40` | 0 0% 92% (40% opacity) |
| Search Border | `border-border/50` | 0 0% 10% (50% opacity) |
| Search Hover | `bg-muted/60` | 0 0% 10% (60% opacity) |

## 🔤 Typography

```
Brand: Space Grotesk, 14px, Regular, Foreground
Nav:   Inter, 14px, Regular, Muted-FG → Foreground (hover)
Label: Inter, 12px, Regular, Muted-FG
Hint:  Monospace, 12px, Regular, Muted-FG
```

## 🎯 Layout Zones

```
[Logo] [Brand]     [Nav Items]     [Search] [Icons]
├─ 20px ┤ ├─ 48px ┤ ├─ flex-1 ┤   ├─ 20px ┤ ├─ 24px ┤
```

## ✨ Interactive States

### Links (Inactive)
```
Default:  text-muted-foreground
Hover:    text-foreground + underline (1px, fade in 200ms)
```

### Links (Active)
```
State:    text-foreground + fixed underline (1px, 40% opacity)
```

### Search Button
```
Default:  bg-muted/40, border-border/50, icon gray
Hover:    bg-muted/60, icon white (smooth 200ms)
Focus:    ring outline for keyboard nav
```

### Brand Link
```
Default:  opacity-100
Hover:    opacity-80 (smooth transition)
```

## 📱 Responsive Behavior

| Breakpoint | Display | Changes |
|------------|---------|---------|
| < 768px | Mobile | Hamburger menu, brand + utils visible |
| 768px-1024px | Tablet | Full nav visible, ⌘K hint hidden |
| 1024px+ | Desktop | All elements visible, full spacing |

## ⌨️ Keyboard Support

| Key | Action |
|-----|--------|
| ⌘K / Ctrl+K | Open search/command palette |
| Tab | Navigate through nav items |
| Enter | Follow link / activate button |
| Esc | Close mobile menu |

## 🎬 Animation Timings

| Action | Duration | Easing |
|--------|----------|--------|
| Underline reveal | 200ms | ease-out |
| Hover color change | 200ms | ease |
| Search button bg | 200ms | ease |

## 🔍 Search Box Specs

```
┌──────────────────────────┐
│ 🔍 Search         ⌘K │
└──────────────────────────┘
  ├─ Padding: 6px 12px
  ├─ Border: 1px, border-border/50
  ├─ Background: bg-muted/40
  ├─ Border-radius: md (0.5rem)
  ├─ Icon: Search (16px)
  └─ Text: "Search" (12px)
```

## 📍 Spacing Reference

```
Gap between nav items:      32px (gap-8)
Gap between utilities:       8px (gap-2)
Logo to brand text:          8px (gap-2)
Header vertical padding:     N/A (centered with h-16)
Horizontal padding (sm):    24px (px-6)
Horizontal padding (lg):    32px (px-8)
Horizontal padding (xl):    40px (px-10)
Horizontal padding (2xl):   48px (px-12)
```

## 🎭 States Matrix

```
┌─────────────────┬──────────────┬──────────────┬────────────┐
│ Element         │ Default      │ Hover        │ Active     │
├─────────────────┼──────────────┼──────────────┼────────────┤
│ Nav Link        │ Muted-FG     │ FG + line    │ FG + line  │
│ Brand Link      │ FG, op-100   │ FG, op-80    │ FG, op-100 │
│ Search Button   │ bg-mut/40    │ bg-mut/60    │ (no active)│
│ Theme Toggle    │ Default      │ Hover color  │ Selected   │
│ Language        │ Default      │ Hover color  │ Selected   │
└─────────────────┴──────────────┴──────────────┴────────────┘
```

## 🔧 CSS Classes Used

```
.sticky              → Position fixed to top
.z-50                → High z-index for overlays
.bg-background/80    → Semi-transparent background
.backdrop-blur-md    → Blur effect
.flex                → Flexbox container
.flex-1              → Flex-grow: 1
.justify-center      → Center alignment
.gap-*               → Gap between items
.transition-*        → Smooth transitions
.hover:*             → Hover pseudo-class
.group-hover:*       → Parent hover affects children
```

## 📋 Component API

```typescript
// Props remain unchanged
<Navigation />

// Behavior:
// - Auto-hides on /splash route
// - Sticky positioning
// - Mobile-responsive
// - Command palette integration (⌘K)
```

## 🚀 Quick Checklist

- [x] Header height: 64px
- [x] No border-bottom
- [x] Three-section layout
- [x] Regular font weight
- [x] Subtle underlines
- [x] Proper spacing
- [x] Mobile responsive
- [x] Search integrated
- [x] Keyboard support
- [x] WCAG AA compliant

## 📚 File Locations

- **Component**: `/components/Navigation.tsx`
- **Styles**: `/src/app/globals.css` (`.nav-link-hover`)
- **Layout**: `/src/app/layout.tsx`

## 💡 Design Philosophy

> "This header is infrastructural, not decorative. It communicates technical confidence, editorial discipline, and systems thinking. Nothing in it tries to impress. That's exactly why it works."

---

**Version**: 1.0 - Desktop Optimized  
**Status**: Production Ready ✅
