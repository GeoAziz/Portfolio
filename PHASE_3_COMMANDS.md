# Phase 3 — Quick Command Reference

## Documentation Files Created

```
📄 PHASE_3_IMPLEMENTATION_PLAN.md    (Comprehensive 300+ line specification)
📄 PHASE_3_QUICKSTART.md             (Quick reference guide for developers)
📄 PHASE_3_SUMMARY.md                (Visual overview and progress tracking)
📄 PHASE_3_ARCHITECTURE.md           (Detailed architecture and data flows)
📄 PHASE_3_COMMANDS.md               (This file - quick reference)
```

---

## Current Project Status

```
📊 Repository: Portfolio (GeoAziz/Portfolio)
📌 Branch: main
🔗 Status: https://github.com/GeoAziz/Portfolio

Phase 2: ✅ COMPLETE
├─ Features: 15/15 (100%)
├─ Routes: 31 deployed
├─ Build: ✅ Passing
├─ TypeScript: ✅ 0 errors
└─ Last commit: [Phase 2.9] Comment System (0d3693a)

Phase 3: 🚀 READY TO START
├─ Features: 9 features planned
├─ Routes: 40+ expected
├─ Content: 16,000+ words planned
├─ Timeline: 8-10 hours
└─ Status: Documentation complete, ready for implementation
```

---

## Development Commands

### Initial Setup
```bash
# Clone repository
git clone https://github.com/GeoAziz/Portfolio.git
cd Portfolio

# Install dependencies (if needed)
npm install

# Configure environment variables
cp .env.example .env.local
# Edit with your values
```

### Development
```bash
# Start development server on port 9002
npm run dev

# Open browser
open http://localhost:9002

# Watch for TypeScript errors
npm run typecheck

# Run in another terminal to monitor build
npm run build
```

### Testing & Validation
```bash
# Check TypeScript compilation
npm run typecheck

# Full production build
npm run build

# Review routes in build output
npm run build 2>&1 | grep "Route (app)"

# Start production server (after build)
npm start

# Lint code (if eslint configured)
npm run lint
```

### Git Workflow
```bash
# Check current status
git status

# View current branch
git branch

# Create feature branch (optional)
git checkout -b phase-3/blog-content

# Stage all changes
git add -A

# Commit with detailed message
git commit -m "[Phase 3.1] - Blog Content & Metadata

- Created 8 new blog posts with system-thinking focus
- Implemented blog.ts utilities (types, getters, filters)
- Enhanced blog components (metadata display)
- Added reading time calculation
- Added category and tag filtering
- Routes: /blog, /blog/[slug], /blog/category/*, /blog/tag/*"

# Push to main
git push origin main

# Or push to feature branch
git push origin phase-3/blog-content
```

### View Commit History
```bash
# See recent commits
git log --oneline -10

# See detailed commit info
git log --oneline --graph -10

# See changes in last commit
git show HEAD

# See diff for specific file
git diff HEAD~1 src/lib/blog.ts
```

---

## File Organization Reference

```
src/
├── lib/
│   ├── blog.ts              ← CREATE (Phase 3.1)
│   ├── projects.ts          ← CREATE (Phase 3.2)
│   ├── research.ts          ← CREATE (Phase 3.5)
│   ├── seo.ts               ← EXTEND (Phase 3.3)
│   ├── mail.ts              ← CREATE (Phase 3.6)
│   └── db.ts                ← CREATE (Phase 3.6)
│
├── app/
│   ├── blog/
│   │   ├── page.tsx         ← ENHANCE
│   │   ├── BlogList.tsx     ← ENHANCE
│   │   ├── [slug]/
│   │   │   └── page.tsx     ← ENHANCE
│   │   ├── category/
│   │   │   └── [category]/
│   │   │       └── page.tsx ← CREATE
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx ← CREATE
│   │
│   ├── projects/
│   │   ├── page.tsx         ← ENHANCE
│   │   ├── [slug]/
│   │   │   └── page.tsx     ← CREATE
│   │   └── tag/
│   │       └── [tag]/
│   │           └── page.tsx ← CREATE
│   │
│   ├── research/
│   │   ├── page.tsx         ← CREATE
│   │   ├── [slug]/
│   │   │   └── page.tsx     ← CREATE
│   │   └── year/
│   │       └── [year]/
│   │           └── page.tsx ← CREATE
│   │
│   ├── contact/
│   │   └── page.tsx         ← CREATE
│   │
│   ├── admin/
│   │   ├── messages/
│   │   │   └── page.tsx     ← CREATE
│   │   └── content/
│   │       └── page.tsx     ← CREATE
│   │
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts     ← CREATE
│   │   ├── og/
│   │   │   └── route.ts     ← CREATE
│   │   └── seo/
│   │       └── route.ts     ← CREATE
│   │
│   ├── sitemap.ts           ← CREATE
│   ├── robots.ts            ← ENHANCE
│   └── feed.xml/
│       └── route.ts         ← CREATE
│
├── components/
│   ├── Breadcrumbs.tsx      ← CREATE
│   ├── SEOHead.tsx          ← CREATE
│   ├── ContactForm.tsx      ← CREATE
│   ├── admin/
│   │   ├── Editor.tsx       ← CREATE
│   │   ├── ContentValidator.tsx ← CREATE
│   │   └── MessagesDashboard.tsx ← CREATE
│   └── home/
│       └── BlogList.tsx     ← ENHANCE
│
└── content/
    ├── blog/
    │   ├── first-post.mdx             ✓ (existing)
    │   ├── systems-thinking.mdx       ← CREATE
    │   ├── distributed-systems.mdx    ← CREATE
    │   ├── ai-ethics.mdx              ← CREATE
    │   ├── hardware-design.mdx        ← CREATE
    │   ├── performance-opt.mdx        ← CREATE
    │   ├── engineering-method.mdx     ← CREATE
    │   ├── complexity-science.mdx     ← CREATE
    │   └── future-computing.mdx       ← CREATE
    │
    ├── projects.json    ← EXTEND with full schema
    └── research.json    ← EXTEND with full schema
```

---

## Phase 3 Implementation Timeline

### Block 1: Core Content (2-3 hours)
```
Hours 0-1:
  ├─ Create src/lib/blog.ts
  │  └─ Types, interfaces, utility functions
  └─ Create first 2 blog posts

Hours 1-2:
  ├─ Write remaining 6 blog posts (4 in parallel)
  └─ Enhance blog components

Hours 2-3:
  ├─ Create src/lib/research.ts
  ├─ Extend research.json
  └─ Create research detail pages
```

### Block 2: Projects & SEO (2-3 hours)
```
Hours 3-4:
  ├─ Create src/lib/projects.ts
  ├─ Extend projects.json
  └─ Create /projects/[slug] route

Hours 4-5:
  ├─ Extend src/lib/seo.ts
  ├─ Create /api/og for og:image
  └─ Update metadata across pages

Hours 5-6:
  ├─ Add JSON-LD schemas
  ├─ Create Breadcrumbs component
  └─ Test SEO on 10+ pages
```

### Block 3: Discovery & Contact (2 hours)
```
Hours 6-7:
  ├─ Create src/app/sitemap.ts
  ├─ Create /feed.xml route
  ├─ Enhance robots.ts
  └─ Create ContactForm component

Hours 7-8:
  ├─ Create /api/contact endpoint
  ├─ Set up email integration
  └─ Create admin messages page
```

### Block 4: Admin & QA (1-2 hours)
```
Hours 8-9:
  ├─ Create admin dashboard (/admin/content)
  ├─ Test all 40+ routes
  ├─ Verify SEO metadata
  └─ Final build & typecheck
```

### Block 5: Optional (1-2 hours)
```
Hours 9-10:
  ├─ Create 3-4 case studies
  └─ Build case studies showcase
```

---

## Common Development Tasks

### Write a New Blog Post
```typescript
// 1. Create file content/blog/slug.mdx
---
title: "Post Title"
date: "2024-12-15"
summary: "One-line summary"
category: "systems-thinking"
tags: ["tag1", "tag2", "tag3"]
featured: true/false
author: "GeoAziz"
image: "/images/blog/slug.jpg"
keywords: ["keyword1", "keyword2"]
---

## Main heading

Content here...

// 2. Image optimization
convert large-image.jpg -resize 1200x630 \
  -quality 85 -define webp:method=6 slug.webp

// 3. Run typecheck
npm run typecheck

// 4. Build & verify
npm run build
```

### Add Project Details
```json
// 1. Edit src/content/projects.json
{
  "title": "Project Name",
  "summary": "Short summary",
  "overview": "300+ word detailed description",
  "features": [
    { "title": "Feature 1", "description": "..." }
  ],
  "architecture": {
    "description": "Architecture explanation",
    "components": ["Component1", "Component2"]
  },
  "results": [
    { "metric": "Performance", "value": "45%", "context": "..." }
  ],
  "github": "https://github.com/...",
  "liveDemo": "https://demo.example.com"
}

// 2. Add screenshots to public/images/projects/
cp screenshot1.jpg public/images/projects/slug-1.jpg
cp screenshot2.jpg public/images/projects/slug-2.jpg

// 3. Test project detail page
npm run dev
# Visit http://localhost:9002/projects/slug
```

### Test Contact Form
```bash
# 1. Configure environment variables (.env.local)
NEXT_PUBLIC_CONTACT_EMAIL=test@example.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@gmail.com
SMTP_PASSWORD=your-app-password

# 2. Start dev server
npm run dev

# 3. Visit contact page
# http://localhost:9002/contact

# 4. Fill form and submit
# Check email inbox for received message

# 5. Check database (if using Supabase)
# https://app.supabase.com → contact_messages table
```

### Verify Build
```bash
# 1. Full production build
npm run build

# 2. Check routes in output
npm run build 2>&1 | grep "Route (app)"

# 3. Expected output: 40+ routes
#    /blog                    X.XX kB
#    /blog/[slug]             X.XX kB
#    /projects                X.XX kB
#    /projects/[slug]         X.XX kB
#    /research                X.XX kB
#    /research/[slug]         X.XX kB
#    /contact                 X.XX kB
#    /admin/messages          X.XX kB
#    ...

# 4. Start production server
npm start

# 5. Test routes manually
# http://localhost:3000/blog
# http://localhost:3000/projects
# http://localhost:3000/contact
```

---

## Debugging Tips

### TypeScript Errors
```bash
# Run type checker
npm run typecheck

# Get detailed errors
npm run typecheck 2>&1 | head -50

# Check specific file
npm run typecheck -- src/lib/blog.ts

# Fix with Pylance refactoring (if using VS Code)
# Right-click file → "Fix All" (source.fixAll.pylance)
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild from scratch
npm run build

# Check build output
npm run build 2>&1 | tail -100

# Production server simulation
npm run build && npm start
```

### Database Connection Issues
```bash
# Test Supabase connection
npm install -g supabase-cli
supabase status

# Test MongoDB connection
npx mongodb-connection-string-checker "mongodb+srv://..."

# Check env variables
env | grep SUPABASE
env | grep MONGODB
```

### Email Delivery Issues
```bash
# Test SMTP connection
telnet smtp.gmail.com 587

# Check Gmail app password settings
# https://myaccount.google.com/apppasswords

# Test with nodemailer
node -e "const nodemailer = require('nodemailer'); 
const transporter = nodemailer.createTransport({...}); 
transporter.verify((err, success) => console.log(err || success));"
```

---

## Useful VS Code Shortcuts

```
Cmd+Shift+P     Command Palette
Cmd+P           Quick file open
Cmd+F           Find in file
Cmd+H           Find & replace
Cmd+Shift+H     Replace across files
Cmd+D           Select word (repeat for multiple)
Alt+Shift+↑/↓   Move line up/down
Cmd+/           Toggle comment
Cmd+B           Toggle sidebar
Cmd+Shift+[     Fold region
Cmd+Shift+]     Unfold region
```

### Useful Extensions
```
Code Extensions to Install:
├─ ES7+ React/Redux/React-Native snippets
├─ Tailwind CSS IntelliSense
├─ Prettier - Code formatter
├─ MDX
├─ GitHub Copilot (optional)
└─ Thunder Client (for API testing)
```

---

## Resources & Documentation

### Official Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MDX Docs](https://mdxjs.com)

### Libraries Used in Phase 3
- [React Hook Form](https://react-hook-form.com/)
- [Zod - Schema Validation](https://zod.dev)
- [Nodemailer - Email](https://nodemailer.com/)
- [date-fns - Date Handling](https://date-fns.org/)
- [Framer Motion - Animations](https://www.framer.com/motion/)

### SEO Tools
- [Schema.org Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Vercel Analytics](https://vercel.com/analytics)

### Deployment
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Documentation](https://supabase.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| Build fails with "Module not found" | Run `npm install` to ensure all dependencies are installed |
| TypeScript errors | Run `npm run typecheck` and fix reported issues |
| Port 9002 already in use | Kill process with `lsof -i :9002 \| grep -v PID \| awk '{print $2}' \| xargs kill` |
| Email not sending | Check SMTP credentials and allow less secure apps (Gmail) |
| Database connection refused | Verify connection string in .env.local |
| Routes not showing in build | Ensure MDX files in content/blog/ have correct frontmatter |
| Images not loading | Check public/ folder path and permissions |
| SEO metadata not rendering | Verify layout.tsx has export const metadata |
| Contact form returns 429 | Rate limit exceeded; try again after 1 hour |

---

## Next Steps

```
✅ Phase 2 Complete
   └─ 31 routes, 15 features, 0 errors

🚀 Phase 3 Starting
   ├─ Documentation: ✅ Complete
   │  ├─ PHASE_3_IMPLEMENTATION_PLAN.md (specs)
   │  ├─ PHASE_3_QUICKSTART.md (reference)
   │  ├─ PHASE_3_ARCHITECTURE.md (design)
   │  └─ PHASE_3_COMMANDS.md (this file)
   │
   ├─ Block 1: Core Content (2-3h)
   │  ├─ 3.1 Blog Content & Metadata
   │  └─ 3.5 Research Enhancement
   │
   ├─ Block 2: Projects & SEO (2-3h)
   │  ├─ 3.2 Project Detail Pages
   │  └─ 3.3 Enhanced SEO Metadata
   │
   ├─ Block 3: Discovery & Contact (2h)
   │  ├─ 3.4 Dynamic Sitemap & RSS
   │  └─ 3.6 Contact/Messaging
   │
   ├─ Block 4: Admin & QA (1-2h)
   │  ├─ 3.8 Content Management System
   │  └─ 3.9 Quality Assurance
   │
   └─ Block 5: Optional (1-2h)
      └─ 3.7 Case Studies

🎯 Goal: 40+ routes, 16,000+ words, 100% SEO optimized

⏱️ Timeline: 8-10 hours
```

---

**Ready to start Phase 3?**

1. Read: PHASE_3_IMPLEMENTATION_PLAN.md
2. Start: Phase 3.1 (Blog Content & Metadata)
3. Commit: After each feature block

Good luck! 🚀
