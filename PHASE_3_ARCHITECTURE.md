# Phase 3 Architecture Map

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Personal OS - Phase 3                        │
│              Content & SEO Layer Architecture                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CLIENT LAYER (React Components)                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │   Blog Pages   │  │ Project Pages    │  │ Research Pages  │ │
│  │                │  │                  │  │                 │ │
│  │ - BlogList     │  │ - ProjectGrid    │  │ - ResearchList  │ │
│  │ - [slug]       │  │ - [slug] Detail  │  │ - [slug] Detail │ │
│  │ - Category     │  │ - Tag Filter     │  │ - YearFilter    │ │
│  │ - Tag Filter   │  │ - Related Proj   │  │ - Citations     │ │
│  └────────────────┘  └──────────────────┘  └─────────────────┘ │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           Contact & Admin Pages                           │   │
│  │                                                            │   │
│  │  ┌────────────────┐  ┌──────────────────────────────┐   │   │
│  │  │ Contact Form   │  │ Admin Dashboard              │   │   │
│  │  │                │  │ ┌────────────────────────┐   │   │   │
│  │  │ - Validation   │  │ │ Messages List          │   │   │   │
│  │  │ - Rate Limit   │  │ │ Content Editor         │   │   │   │
│  │  │ - Submit       │  │ │ Analytics              │   │   │   │
│  │  └────────────────┘  │ └────────────────────────┘   │   │   │
│  │                      └──────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        Shared Components & Utilities                     │   │
│  │                                                            │   │
│  │  - Breadcrumbs       - SEOHead          - TagCloud        │   │
│  │  - ReadingTime       - MetadataDisplay  - RelatedItems    │   │
│  │  - CategoryBadge     - CitationCopy     - TableOfContents │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ API LAYER (Routes & Endpoints)                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Data Routes      │  │ API Endpoints    │  │ Gen Routes   │  │
│  │                  │  │                  │  │              │  │
│  │ /blog            │  │ /api/contact     │  │ /sitemap.ts  │  │
│  │ /blog/[slug]     │  │ /api/og          │  │ /feed.xml    │  │
│  │ /blog/cat/*      │  │ /api/seo/*       │  │ /robots.ts   │  │
│  │ /blog/tag/*      │  │                  │  │              │  │
│  │                  │  │                  │  │              │  │
│  │ /projects        │  │                  │  │              │  │
│  │ /projects/[slug] │  │                  │  │              │  │
│  │ /projects/tag/*  │  │                  │  │              │  │
│  │                  │  │                  │  │              │  │
│  │ /research        │  │                  │  │              │  │
│  │ /research/[slug] │  │                  │  │              │  │
│  │ /research/year/* │  │                  │  │              │  │
│  │                  │  │                  │  │              │  │
│  │ /contact         │  │                  │  │              │  │
│  │ /admin/messages  │  │                  │  │              │  │
│  │ /admin/content   │  │                  │  │              │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ DATA LAYER (Content & Utilities)                                 │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Content Files                                           │    │
│  │                                                          │    │
│  │  content/blog/                    src/content/          │    │
│  │  ├─ first-post.mdx  (existing)    ├─ projects.json ✨   │    │
│  │  ├─ systems-thinking.mdx          ├─ research.json ✨   │    │
│  │  ├─ distributed-systems.mdx       ├─ ai.json            │    │
│  │  ├─ ai-ethics.mdx                 └─ hardware.json      │    │
│  │  ├─ hardware-design.mdx                                 │    │
│  │  ├─ performance-opt.mdx           ✨ = Enhanced schema  │    │
│  │  ├─ engineering-method.mdx                             │    │
│  │  ├─ complexity-science.mdx                             │    │
│  │  └─ future-computing.mdx                              │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Utility Libraries (src/lib/)                            │    │
│  │                                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    │
│  │  │ blog.ts      │  │ projects.ts  │  │ research.ts  │  │    │
│  │  │ ✨ NEW       │  │ ✨ NEW       │  │ ✨ NEW       │  │    │
│  │  │              │  │              │  │              │  │    │
│  │  │ - Types      │  │ - Types      │  │ - Types      │  │    │
│  │  │ - Getters    │  │ - Getters    │  │ - Getters    │  │    │
│  │  │ - Filters    │  │ - Filters    │  │ - Filters    │  │    │
│  │  │ - Search     │  │ - Search     │  │ - Citations  │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │    │
│  │                                                          │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │    │
│  │  │ seo.ts       │  │ mail.ts      │  │ db.ts        │  │    │
│  │  │ (enhanced)   │  │ ✨ NEW       │  │ ✨ NEW       │  │    │
│  │  │              │  │              │  │              │  │    │
│  │  │ - Schemas    │  │ - Templates  │  │ - Supabase   │  │    │
│  │  │ - JSON-LD    │  │ - Nodemailer │  │ - MongoDB    │  │    │
│  │  │ - og:image   │  │ - SendGrid   │  │ - Queries    │  │    │
│  │  │ - Metadata   │  │ - Auto-reply │  │              │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ EXTERNAL SERVICES & DATABASE                                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Email        │  │ Database     │  │ Search & Analytics   │  │
│  │ Service      │  │              │  │                      │  │
│  │              │  │              │  │                      │  │
│  │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌──────────────────┐│  │
│  │ │Nodemailer│ │  │ │Supabase  │ │  │ │Fuse.js (search)  ││  │
│  │ │(SMTP)    │ │  │ │postgres  │ │  │ │Vercel Analytics  ││  │
│  │ └──────────┘ │  │ │tables    │ │  │ │Google Analytics  ││  │
│  │              │  │ └──────────┘ │  │ │                  ││  │
│  │ OR           │  │              │  │ └──────────────────┘│  │
│  │              │  │ ┌──────────┐ │  │                      │  │
│  │ ┌──────────┐ │  │ │MongoDB   │ │  │ ┌──────────────────┐│  │
│  │ │SendGrid  │ │  │ │(optional)│ │  │ │Giscus Comments   ││  │
│  │ │(API)     │ │  │ └──────────┘ │  │ │(GitHub native)   ││  │
│  │ └──────────┘ │  │              │  │ └──────────────────┘│  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ BUILD & DEPLOYMENT                                               │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  npm run build                                                   │
│  ├─ Generate static pages (40+ routes)                          │
│  ├─ Build sitemap.xml dynamically                               │
│  ├─ Build feed.xml dynamically                                  │
│  ├─ Optimize images                                             │
│  ├─ Generate og:images                                          │
│  └─ Output: Next.js static + SSR bundle                         │
│                                                                   │
│  Deployment: Vercel / Self-hosted                               │
│  ├─ Auto-deploy on git push                                     │
│  ├─ API routes: /api/*                                          │
│  ├─ Database: Supabase (cloud) or self-hosted                  │
│  └─ Email: Configured via env vars                             │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
User Interaction Flow:
═════════════════════════════════════════════════════════════════

Blog Browsing
─────────────
User visits /blog
    ↓
BlogList component fetches getAllBlogPosts() from src/lib/blog.ts
    ↓
Data: content/blog/*.mdx + src/content/
    ↓
Display: Post cards with metadata (date, reading time, category, tags)
    ↓
User clicks post → /blog/[slug]
    ↓
Fetch getBlogPostBySlug() from src/lib/blog.ts
    ↓
Data: MDX content + metadata from frontmatter
    ↓
Render: Title, date, reading time, TOC, content, comments, related posts
    ↓
SEO: <head> tags from generateBlogPostMetadata() in src/lib/seo.ts
    ↓
JSON-LD schema injected via SEOHead component


Project Showcase
────────────────
User visits /projects
    ↓
ProjectGrid component fetches getAllProjects() from src/lib/projects.ts
    ↓
Data: src/content/projects.json (extended)
    ↓
Display: Project cards with tech stack, featured image
    ↓
User clicks project → /projects/[slug]
    ↓
Fetch getProjectBySlug() from src/lib/projects.ts
    ↓
Data: project.json enriched with overview, features, architecture, results
    ↓
Render: Hero, overview, features grid, architecture, screenshots, timeline
    ↓
SEO: og:image generated from /api/og with project data


Contact Form
────────────
User visits /contact
    ↓
ContactForm component mounts with React Hook Form + Zod
    ↓
User fills form (name, email, subject, message, type)
    ↓
On submit:
    ├─ Client validation (Zod schema)
    ├─ Rate limiting check (localStorage)
    └─ POST to /api/contact
        ↓
    Server-side validation
    ├─ Validate data again with Zod
    ├─ Check rate limiting (per IP)
    ├─ Check CAPTCHA (optional)
    └─ Save to database
        ↓
    Send email
    ├─ Via Nodemailer/SendGrid
    ├─ To NEXT_PUBLIC_CONTACT_EMAIL
    ├─ With message template
    └─ Auto-reply to user
        ↓
    Admin notification
    └─ Store message in Supabase/MongoDB
        ↓
    Return success response
        ↓
    User sees toast notification


Admin Dashboard
───────────────
Admin visits /admin/messages
    ↓
Check authentication (NextAuth)
    ↓
Fetch getMessages() from src/lib/db.ts
    ↓
Data: Contact messages from Supabase/MongoDB
    ↓
Display: Table with filters, search, bulk actions
    ↓
Admin can:
    ├─ View message details (modal)
    ├─ Mark as read/unread
    ├─ Archive/restore
    ├─ Delete messages
    └─ Export to CSV


SEO Generation
──────────────
Build time: npm run build
    ↓
generateSiteMetadata() runs for all pages
    ├─ Blog: generateBlogPostMetadata() × 9 posts
    ├─ Projects: generateProjectMetadata() × 6 projects
    └─ Research: generateResearchMetadata() × 3 entries
    ↓
Generate /sitemap.xml
    ├─ getAllBlogPosts() + getAllProjects() + getAllResearch()
    ├─ Add main pages
    ├─ Set priorities (0.8-1.0)
    └─ Include lastmod dates
    ↓
Generate /feed.xml
    ├─ Get 20 latest blog posts
    ├─ Format as RSS 2.0
    ├─ Include full content
    └─ Include pubDate, category
    ↓
Generate og:images
    ├─ For each blog post
    ├─ For each project
    └─ Via /api/og endpoint (cached)
    ↓
Search engines discover:
    ├─ Via sitemap.xml
    ├─ Via RSS feed
    ├─ Via robots.txt
    └─ Via JSON-LD schemas
```

---

## Component Dependency Graph

```
Page Components (React):
═════════════════════════

/blog
└─ <BlogList>
   ├─ getAllBlogPosts() [src/lib/blog.ts]
   ├─ <BlogCard> × N
   │  ├─ Title, Date
   │  ├─ <ReadingTime />
   │  ├─ <CategoryBadge />
   │  └─ <TagCloud />
   └─ <Pagination> | <InfiniteScroll>

/blog/[slug]
└─ <BlogPostPage>
   ├─ getBlogPostBySlug() [src/lib/blog.ts]
   ├─ <SEOHead /> [src/lib/seo.ts]
   ├─ <Breadcrumbs /> [src/components]
   ├─ <ArticleHeader>
   │  ├─ Title, Date, Author
   │  ├─ <ReadingTime />
   │  └─ <CategoryBadge>
   ├─ <TableOfContents /> [generateTOC()]
   ├─ <ArticleContent> (MDX)
   ├─ <TagCloud>
   │  └─ Link to /blog/tag/[tag]
   ├─ <RelatedPosts>
   │  └─ getRelatedPosts() [src/lib/blog.ts]
   ├─ <SocialSharing /> (existing)
   └─ <CommentsSection /> [src/components/Giscus.tsx]

/projects
└─ <ProjectsPage>
   ├─ getAllProjects() [src/lib/projects.ts]
   ├─ <ProjectFilters>
   │  ├─ By technology
   │  ├─ By category
   │  └─ Sort options
   └─ <ProjectGrid>
      └─ <ProjectCard> × N
         ├─ Title, Summary
         ├─ Featured image
         ├─ Tech stack (tags)
         └─ Link to [slug]

/projects/[slug]
└─ <ProjectDetailPage>
   ├─ getProjectBySlug() [src/lib/projects.ts]
   ├─ <SEOHead />
   ├─ <Breadcrumbs />
   ├─ <ProjectHero>
   │  ├─ Title, Summary
   │  ├─ Tech stack
   │  └─ Featured image
   ├─ <ProjectOverview>
   │  └─ Description (500+ words)
   ├─ <FeatureGrid>
   │  └─ <FeatureCard> × 6
   ├─ <ArchitectureSection>
   │  ├─ Diagram
   │  └─ Description
   ├─ <ScreenshotsGallery>
   │  └─ Lightbox for images
   ├─ <ResultsMetrics>
   │  └─ <MetricCard> × N
   ├─ <TimelineSection>
   │  └─ <TimelinePhase> × N
   ├─ <TeamSection> (optional)
   │  └─ <TeamMember> × N
   ├─ <CTASection>
   │  ├─ Link: GitHub
   │  └─ Link: Live demo
   ├─ <RelatedProjects>
   │  └─ getRelatedProjects() × 3
   └─ <ProjectNavigation>
      ├─ Prev project
      └─ Next project

/research
└─ <ResearchPage>
   ├─ getAllResearchEntries() [src/lib/research.ts]
   ├─ <ResearchFilters>
   │  ├─ By year
   │  ├─ By publication
   │  └─ Search
   └─ <ResearchGrid>
      └─ <ResearchCard> × N
         ├─ Title, Publication, Date
         ├─ Authors
         ├─ Summary
         └─ Link to [slug]

/research/[slug]
└─ <ResearchDetailPage>
   ├─ getResearchBySlug() [src/lib/research.ts]
   ├─ <SEOHead />
   ├─ <Breadcrumbs />
   ├─ <ResearchHeader>
   │  ├─ Title, Publication, Date
   │  ├─ Authors
   │  ├─ DOI badge
   │  └─ PDF link
   ├─ <CitationSection>
   │  ├─ <CitationFormat>
   │  │  ├─ APA
   │  │  ├─ MLA
   │  │  ├─ BibTeX
   │  │  └─ Chicago
   │  └─ <CopyButton /> × 4
   ├─ <AbstractSection>
   │  └─ Full abstract (200+ words)
   ├─ <KeywordsCloud />
   ├─ <MetadataSection>
   │  ├─ Authors, Keywords, DOI
   │  └─ Links: PDF, DOI, Publication
   ├─ <RelatedResearch>
   │  └─ getRelatedResearch() × 3
   └─ <BackToResearch /> link

/contact
└─ <ContactPage>
   ├─ <ContactHero>
   │  ├─ Title, description
   │  └─ <ContactForm />
   │     ├─ React Hook Form
   │     ├─ Zod validation
   │     ├─ POST to /api/contact
   │     └─ Toast notifications
   ├─ <ContactInfo>
   │  ├─ Email
   │  ├─ Social links
   │  └─ Response time estimate
   ├─ <FAQAccordion />
   └─ <AlternativeContacts>
      └─ Twitter, LinkedIn, GitHub links

/admin/messages
└─ <AdminMessagesPage>
   ├─ Require authentication
   ├─ <MessagesList>
   │  ├─ getMessages() [src/lib/db.ts]
   │  ├─ <MessageTable>
   │  │  ├─ Columns: name, email, subject, type, date, read status
   │  │  ├─ <RowAction>
   │  │  │  ├─ View (modal)
   │  │  │  ├─ Mark as read
   │  │  │  ├─ Archive
   │  │  │  └─ Delete
   │  │  └─ <BulkActions>
   │  │     ├─ Mark all as read
   │  │     ├─ Archive selected
   │  │     └─ Delete selected
   │  ├─ <MessageFilters>
   │  │  ├─ By read/unread
   │  │  ├─ By message type
   │  │  ├─ By date range
   │  │  └─ Search
   │  └─ <MessageStats>
   │     ├─ Total messages
   │     ├─ Unread count
   │     └─ Latest message
   └─ <MessageDetailModal>
      ├─ Full message view
      ├─ Contact details
      ├─ Reply button (optional)
      └─ Actions

Shared Components:
──────────────────

<Breadcrumbs>
├─ Props: items[] { name, path }
├─ Markup: BreadcrumbSchema JSON-LD
└─ Styling: Responsive, theme-aware

<SEOHead>
├─ Props: SEOMetadata { title, description, og, twitter, jsonld }
├─ Renders: <meta> tags
├─ Renders: <link rel="canonical">
├─ Renders: <script type="application/ld+json">
└─ Renders: Open Graph + Twitter cards

<ReadingTime>
├─ Props: wordCount | content
├─ Calculates: minutes = wordCount / 200
└─ Display: "X min read"

<CategoryBadge>
├─ Props: category, variant?
├─ Display: Category name with styling
└─ Link: to /blog/category/[category]

<TagCloud>
├─ Props: tags[]
├─ Display: Tag buttons/pills
└─ Link: Each tag to /blog/tag/[tag]

<RelatedContent>
├─ Props: items[], type (blog|project|research)
├─ Display: 3 related items
└─ getRelated() from respective lib file

<SocialSharing>
├─ Props: url, title, description
└─ Platforms: Twitter, LinkedIn, Facebook, WhatsApp, Email
```

---

## Database Schema (Optional: Supabase/MongoDB)

```sql
-- Supabase PostgreSQL
──────────────────────

CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(50) NOT NULL, -- 'bug-report', 'feature-request', 'collab', 'general', 'hiring'
  
  read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  
  ip_address INET, -- For rate limiting
  user_agent TEXT, -- Browser info
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  replied_at TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_read (read),
  INDEX idx_message_type (message_type)
);

-- Or MongoDB
─────────────

db.contact_messages.createIndex({ "created_at": -1 })
db.contact_messages.createIndex({ "email": 1 })
db.contact_messages.createIndex({ "read": 1 })
db.contact_messages.createIndex({ "message_type": 1 })

{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  messageType: String,
  
  read: Boolean,
  archived: Boolean,
  tags: [String],
  
  ipAddress: String,
  userAgent: String,
  
  createdAt: ISODate,
  updatedAt: ISODate,
  repliedAt: ISODate
}
```

---

## Environment Variables Reference

```bash
# Email Configuration (SMTP)
NEXT_PUBLIC_CONTACT_EMAIL=contact@example.com
SMTP_FROM_EMAIL=noreply@example.com
SMTP_HOST=smtp.gmail.com              # or smtp.sendgrid.net
SMTP_PORT=587                         # 587 for TLS, 465 for SSL
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# OR Email Configuration (SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxx

# Database (Supabase PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# OR Database (MongoDB)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Giscus Comments (from Phase 2.9)
NEXT_PUBLIC_GISCUS_REPO=owner/repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxxxx

# Analytics (existing)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxxxx
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional: CAPTCHA (for spam prevention)
NEXT_PUBLIC_RECAPTCHA_KEY=6LxxxxxxxxxxxxE
RECAPTCHA_SECRET_KEY=6LxxxxxxxxxxxxE_

# Optional: Slack notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../W...
```

---

## Testing & Validation Strategy

```
Unit Testing
────────────
- blog.ts functions (getAllBlogPosts, getBySlug, calculateReadingTime)
- projects.ts functions (getAllProjects, getBySlug, getRelated)
- research.ts functions (getAllResearch, generateCitations)
- seo.ts functions (generateMetadata, generateSchemas)
- mail.ts functions (sendEmail, sendAutoReply)
- db.ts functions (saveMessage, getMessages, updateMessage)

Integration Testing
───────────────────
- Blog post rendering (MDX parsing, metadata extraction)
- Project detail page (data fetching, component rendering)
- Contact form submission (validation, email sending, DB storage)
- Admin dashboard (message display, filtering, actions)

SEO Validation
──────────────
- Schema.org validator (https://validator.schema.org/)
- JSON-LD validation for all pages
- og:image generation and display
- Breadcrumb markup presence
- Canonical URL correctness
- Duplicate content detection

Route Testing
─────────────
- All 40+ routes accessible
- Dynamic routes render correctly
- 404 handling
- Loading states
- Error states

Performance Testing
───────────────────
- Build time < 2 minutes
- TypeScript compilation (0 errors)
- Lighthouse score > 90
- Bundle size analysis
- Image optimization verification
- SEO score validation
```

---

## Deployment Checklist

```
Pre-Deployment
──────────────
✅ All 8 blog posts written and committed
✅ All 6 projects extended with full data
✅ All 3 research entries with citations
✅ All routes tested locally (40+)
✅ TypeScript: 0 errors
✅ npm run build: Successful
✅ Contact form tested with actual email
✅ Admin dashboard tested (if using DB)
✅ SEO metadata validated
✅ All env vars configured

Deployment (Vercel)
───────────────────
1. Push to main branch
2. Vercel auto-detects Next.js
3. Builds production bundle
4. Generates static pages (40+)
5. Deploys API routes (/api/*)
6. Configures env vars
7. Verifies build (0 errors)
8. Deploys to production
9. Invalidates cache
10. Monitors deployment

Post-Deployment
───────────────
✅ Visit https://yoursite.com (homepage loads)
✅ Check /sitemap.xml (40+ entries)
✅ Check /feed.xml (recent posts)
✅ Visit /blog (posts display)
✅ Visit /blog/systems-thinking (renders correctly)
✅ Visit /projects (shows all 6)
✅ Visit /projects/project-slug (detail loads)
✅ Visit /research (shows entries)
✅ Visit /contact (form loads)
✅ Test contact form (email received)
✅ Check /admin/messages (if using DB)
✅ Submit query to global search (/ai/global-search)
✅ Verify analytics tracking
✅ Check PWA offline mode
✅ Run Lighthouse audit (score > 90)
✅ Submit sitemap to Google Search Console
✅ Monitor error logs
```

---

## Performance Optimization Tips

```
Build Optimization
──────────────────
- Image optimization (next/image)
  ├─ Use .webp format
  ├─ Lazy load below-fold images
  └─ Responsive sizes

- Code splitting
  ├─ Dynamic imports for heavy components
  ├─ Route-based code splitting (built-in)
  └─ Vendor bundle optimization

- Caching strategies
  ├─ sitemap.xml: revalidate: 86400 (24h)
  ├─ feed.xml: revalidate: 3600 (1h)
  ├─ og:image: revalidate: 604800 (7d)
  └─ Static content: revalidate: false (ISR)

SEO Optimization
────────────────
- Internal linking (blog → projects → research)
- Keyword optimization in titles/descriptions
- Long-form content (2000+ words)
- Structured data for rich snippets
- Image alt text optimization
- Mobile-first design

Runtime Performance
───────────────────
- Database query optimization (pagination)
- Rate limiting on contact form
- Debouncing search queries
- Lazy loading components
- Service worker caching (PWA)

Analytics
─────────
- Track page views
- Track search queries
- Track contact form submissions
- Monitor error rates
- Track user journey
```

---

This architecture map provides a complete visualization of Phase 3's structure, data flows, components, and dependencies. All systems integrate seamlessly with Phase 2's foundation.

**Ready for implementation!** 🚀
