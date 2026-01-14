# COMPREHENSIVE TEST COVERAGE MATRIX - ALL 78 PAGES

**Date:** January 13, 2026  
**Status:** MASTER TRACKING DOCUMENT  
**Purpose:** Per-page test coverage mapping and completion log  
**Owner:** QA Engineering Division

---

## EXECUTIVE SUMMARY

| Metric | Value |
|--------|-------|
| **Total Pages** | 78 |
| **Priority P0 (Smoke)** | 5 pages |
| **Priority P1 (Critical Path)** | 15 pages |
| **Priority P2 (Feature)** | 20 pages |
| **Priority P3 (Edge Cases)** | 38 pages |
| **Test Layer Completion** | 0% (Framework deployment phase) |
| **Estimated Full Coverage** | ~150-180 test cases |
| **Target Execution Time** | < 10 minutes |

---

## PAGE-BY-PAGE COVERAGE MATRIX

### TIER 1: FOUNDATIONAL PAGES (P0 - Smoke Tests)

These pages must be tested on EVERY COMMIT.

| # | Route | File | Priority | Tests | Status | Completion |
|---|-------|------|----------|-------|--------|------------|
| 1 | `/` | `src/app/page.tsx` | **P0** | 4 | 🔴 Not Started | 0% |
| 2 | `/blog` | `src/app/blog/page.tsx` | **P0** | 3 | 🔴 Not Started | 0% |
| 7 | `/contact` | `src/app/contact/page.tsx` | **P0** | 4 | 🔴 Not Started | 0% |
| 13 | `/ai/chat` | `src/app/ai/chat/page.tsx` | **P0** | 3 | 🔴 Not Started | 0% |
| 30 | `/search` | `src/app/search/page.tsx` | **P0** | 2 | 🔴 Not Started | 0% |

**P0 Smoke Tests Summary:**
- Total: 16 tests
- Est. Time: 2 minutes
- Frequency: Every commit
- Acceptance: 100% pass

---

### TIER 2: CRITICAL PATH PAGES (P1 - Every PR)

These pages cover all major user flows. Test on EVERY PR.

| # | Route | File | Priority | Tests | Status | Completion |
|---|-------|------|----------|-------|--------|------------|
| 3 | `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 4 | `/projects` | `src/app/projects/page.tsx` | **P1** | 4 | 🔴 Not Started | 0% |
| 5 | `/projects/[slug]` | `src/app/projects/[slug]/page.tsx` | **P1** | 4 | 🔴 Not Started | 0% |
| 6 | `/resume` | `src/app/resume/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 8 | `/open-source` | `src/app/open-source/page.tsx` | **P1** | 2 | 🔴 Not Started | 0% |
| 9 | `/hardware` | `src/app/hardware/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 10 | `/research` | `src/app/research/page.tsx` | **P1** | 4 | 🔴 Not Started | 0% |
| 12 | `/ai` | `src/app/ai/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 14 | `/ai/syntax-highlighting` | `src/app/ai/syntax-highlighting/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 15 | `/ai/comments` | `src/app/ai/comments/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 31 | `/case-studies` | `src/app/case-studies/page.tsx` | **P1** | 2 | 🔴 Not Started | 0% |
| 32 | `/case-studies/[slug]` | `src/app/case-studies/[slug]/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 33 | `/3d-models` | `src/app/3d-models/page.tsx` | **P1** | 3 | 🔴 Not Started | 0% |
| 34 | `/newsletter` | `src/app/newsletter/page.tsx` | **P1** | 2 | 🔴 Not Started | 0% |
| 24 | `/user/login` | `src/app/user/login/page.tsx` | **P1** | 4 | 🔴 Not Started | 0% |

**P1 Critical Path Summary:**
- Total: 48 tests
- Est. Time: 7 minutes
- Frequency: Every PR
- Acceptance: 100% pass required for merge

---

### TIER 3: FEATURE PAGES (P2 - Pre-Deployment)

Enhanced functionality and new features. Test before production release.

| # | Route | File | Priority | Tests | Status | Completion |
|---|-------|------|----------|-------|--------|------------|
| 11 | `/research/[slug]` | `src/app/research/[slug]/page.tsx` | **P2** | 3 | 🔴 Not Started | 0% |
| 16 | `/ai/animations` | `src/app/ai/animations/page.tsx` | **P2** | 4 | 🔴 Not Started | 0% |
| 17 | `/ai/pwa` | `src/app/ai/pwa/page.tsx` | **P2** | 3 | 🔴 Not Started | 0% |
| 18 | `/ai/seo` | `src/app/ai/seo/page.tsx` | **P2** | 2 | 🔴 Not Started | 0% |
| 19 | `/ai/social-sharing` | `src/app/ai/social-sharing/page.tsx` | **P2** | 3 | 🔴 Not Started | 0% |
| 20 | `/ai/global-search` | `src/app/ai/global-search/page.tsx` | **P2** | 2 | 🔴 Not Started | 0% |
| 21 | `/admin/analytics` | `src/app/admin/analytics/page.tsx` | **P2** | 4 | 🔴 Not Started | 0% |
| 22 | `/admin/content` | `src/app/admin/content/page.tsx` | **P2** | 3 | 🔴 Not Started | 0% |
| 23 | `/admin/messages` | `src/app/admin/messages/page.tsx` | **P2** | 2 | 🔴 Not Started | 0% |
| 25 | `/user/profile` | `src/app/user/profile/page.tsx` | **P2** | 4 | 🔴 Not Started | 0% |
| 26 | `/user/settings` | `src/app/user/settings/page.tsx` | **P2** | 3 | 🔴 Not Started | 0% |
| 27 | `/user/webhooks` | `src/app/user/webhooks/page.tsx` | **P2** | 2 | 🔴 Not Started | 0% |
| 28 | `/user/[userId]` | `src/app/user/[userId]/page.tsx` | **P2** | 2 | 🔴 Not Started | 0% |
| 29 | `/analytics` | `src/app/analytics/page.tsx` | **P2** | 2 | 🔴 Not Started | 0% |

**P2 Feature Summary:**
- Total: 41 tests
- Est. Time: 5 minutes
- Frequency: Before production deployment
- Acceptance: 100% pass required for release

---

### TIER 4: EDGE CASES & REMAINING PAGES (P3 - Weekly Regression)

Boundary conditions and less-critical pages. Run weekly.

| # | Route | File | Priority | Tests | Status | Completion |
|---|-------|------|----------|-------|--------|------------|
| 35+ | Systems subpages | `src/app/systems/*` | **P3** | 5 | 🔴 Not Started | 0% |
| 36+ | Additional AI demos | `src/app/ai/*` | **P3** | 8 | 🔴 Not Started | 0% |
| 40+ | Layout variants | `src/app/layouts/*` | **P3** | 3 | 🔴 Not Started | 0% |
| 45+ | Catch-all routes | `src/app/[...pages]` | **P3** | 2 | 🔴 Not Started | 0% |
| **Multi-Test Categories** | N/A | N/A | **P3** | Variable | 🔴 Not Started | 0% |
| - | Form validation edge cases | N/A | **P3** | 8 | 🔴 Not Started | 0% |
| - | Responsive breakpoint tests | N/A | **P3** | 10 | 🔴 Not Started | 0% |
| - | Keyboard navigation | N/A | **P3** | 6 | 🔴 Not Started | 0% |
| - | Browser back/forward | N/A | **P3** | 4 | 🔴 Not Started | 0% |
| - | Cross-browser validation | N/A | **P3** | 5 | 🔴 Not Started | 0% |

**P3 Edge Cases Summary:**
- Total: ~51 tests
- Est. Time: 8 minutes
- Frequency: Weekly regression, monthly comprehensive
- Acceptance: 95%+ pass (some environment-dependent)

---

## DETAILED TEST SPECIFICATIONS BY PAGE

### PAGE 1: HOME PAGE (/)

**Source:** `/home/devmahnx/Portfolio/src/app/page.tsx`  
**Priority:** P0 (Smoke)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 1.1 | Page loads successfully | HTTP 200, no console errors | N/A | 🔴 |
| 1.2 | Hero section visible | H1 "Engineer Dev Mahn X" rendered | `hero-title` | 🔴 |
| 1.3 | Explore button clickable | Navigates to #systems section | `explore-work-button` | 🔴 |
| 1.4 | SkillOrbit renders (desktop) | Orbital nodes visible and interactive | `skill-orbit` | 🔴 |

#### Key Interactions:
- Click "Explore the Work" button → scroll to systems
- Click "Contact / Collaborate" → navigate to `/resume`
- Hover SkillOrbit nodes → labels appear/disappear
- Mobile: SkillOrbit switches to Accordion

#### Responsive Breakpoints:
- Mobile (375px): Accordion visible, SkillOrbit hidden
- Tablet (768px): Accordion visible
- Desktop (1024px): SkillOrbit visible

#### Performance Requirements:
- Page load < 3s
- Animations complete < 2s
- No layout shift after animations

---

### PAGE 2: BLOG INDEX (/blog)

**Source:** `/home/devmahnx/Portfolio/src/app/blog/page.tsx`  
**Priority:** P0 (Smoke)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 2.1 | Page loads successfully | HTTP 200, H1 "Systems Journal" | N/A | 🔴 |
| 2.2 | Blog posts render | At least 1 post visible in list | `blog-post-card` | 🔴 |
| 2.3 | Post card clickable | Navigate to `/blog/[slug]` | `blog-post-link` | 🔴 |

#### Key Interactions:
- Scroll page → CorePhilosophies fade in
- Click post card → navigate to detail page
- ResearchHub section displays

#### Responsive Breakpoints:
- Mobile/Tablet/Desktop: All render same layout

---

### PAGE 3: BLOG DETAIL (/blog/[slug])

**Source:** `/home/devmahnx/Portfolio/src/app/blog/[slug]/page.tsx`  
**Priority:** P1 (Critical Path)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 3.1 | Post renders correctly | Title, author, date visible | N/A | 🔴 |
| 3.2 | MDX content renders | Code blocks, images, blockquotes | `post-content` | 🔴 |
| 3.3 | Links in post work | Click internal link → navigate | N/A | 🔴 |

#### Key Interactions:
- Click internal blog link → navigate to other post
- External links open in new tab
- Reading time displayed correctly

---

### PAGE 4: PROJECTS (/projects)

**Source:** `/home/devmahnx/Portfolio/src/app/projects/page.tsx`  
**Priority:** P1 (Critical Path)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 4.1 | Projects render | Grid of project cards visible | `project-card` | 🔴 |
| 4.2 | Filtering works | Filter by category → results update | `project-filter` | 🔴 |
| 4.3 | Project card clickable | Navigate to `/projects/[slug]` | `project-card-link` | 🔴 |
| 4.4 | Search functionality | Type search term → filter results | `project-search` | 🔴 |

#### Key Interactions:
- Select filter category → cards update
- Type search → results filter in real-time
- Hover card → scale 1.05, shadow grows

#### Responsive Breakpoints:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

### PAGE 5: PROJECT DETAIL (/projects/[slug])

**Source:** `/home/devmahnx/Portfolio/src/app/projects/[slug]/page.tsx`  
**Priority:** P1 (Critical Path)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 5.1 | Project details render | Title, description, tech stack | N/A | 🔴 |
| 5.2 | Demo button works | "View Live Demo" navigates externally | `demo-button` | 🔴 |
| 5.3 | GitHub button works | "View on GitHub" navigates externally | `github-button` | 🔴 |
| 5.4 | Related projects show | 3 related projects displayed | `related-projects` | 🔴 |

#### Key Interactions:
- Back button → navigate to `/projects`
- Featured badge shows if applicable
- Related project cards clickable

---

### PAGE 6: RESUME (/resume)

**Source:** `/home/devmahnx/Portfolio/src/app/resume/page.tsx`  
**Priority:** P1 (Critical Path)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 6.1 | Resume sections render | All sections visible | N/A | 🔴 |
| 6.2 | Copy email button works | Click → email in clipboard | `copy-email-button` | 🔴 |
| 6.3 | Download button works | Click → PDF downloads | `download-resume` | 🔴 |
| 6.4 | GitHub link works | Click → GitHub opens in new tab | `github-link` | 🔴 |

#### Key Interactions:
- Expertise badges display
- Timeline shows experience chronologically
- Education section renders

---

### PAGE 7: CONTACT (/contact)

**Source:** `/home/devmahnx/Portfolio/src/app/contact/page.tsx`  
**Priority:** P0 (Smoke)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 7.1 | Contact form renders | All fields present | `contact-form` | 🔴 |
| 7.2 | Form validation works | Leave required field empty → error | `error-message` | 🔴 |
| 7.3 | Form submission works | Fill form → submit → success | `success-message` | 🔴 |
| 7.4 | Contact methods visible | Email, GitHub, LinkedIn, Twitter | N/A | 🔴 |

#### Key Interactions:
- Fill name, email, subject, message
- Click submit
- Server-side validation errors appear
- Success message shows
- Form resets

#### Responsive Breakpoints:
- Mobile: Form fields stack vertically
- Desktop: name+email in 2-column grid

---

### PAGES 8-10: OPEN SOURCE, HARDWARE, RESEARCH

Similar structure to pages above. Each requires:
- Page load test
- Element rendering tests
- Navigation/interaction tests
- Responsive breakpoint validation

---

### PAGE 12: AI INDEX (/ai)

**Source:** `/home/devmahnx/Portfolio/src/app/ai/page.tsx`  
**Priority:** P1 (Critical Path)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 12.1 | Page loads | All sections visible | N/A | 🔴 |
| 12.2 | Model cards render | ModelCard components display | `model-card` | 🔴 |
| 12.3 | Lab tiles render | LabTile components interactive | `lab-tile` | 🔴 |

---

### PAGE 13: AI CHAT (/ai/chat)

**Source:** `/home/devmahnx/Portfolio/src/app/ai/chat/page.tsx`  
**Priority:** P0 (Smoke)

#### Tests to Implement:
| Test ID | Test Case | Expected Result | Data-testid Needed | Status |
|---------|-----------|-----------------|-------------------|--------|
| 13.1 | Chat interface loads | ChatPageClient rendered | `chat-interface` | 🔴 |
| 13.2 | Message input works | Type message → send | `message-input` | 🔴 |
| 13.3 | Example questions visible | Example cards display | `example-question` | 🔴 |

---

### PAGES 14-34: REMAINING TIER 2 PAGES

Each follows same pattern:
1. Test page load and rendering
2. Test primary interactions (buttons, forms, filters)
3. Test navigation to related pages
4. Test responsive breakpoints

---

## CROSS-CUTTING TEST CATEGORIES

### A. FORM VALIDATION TESTS (P3)

Applies to: Contact form, Newsletter signup, Auth forms, Admin forms

#### Test Cases:
| Test Case | Expected Behavior | Input | Expected Error |
|-----------|-------------------|-------|-----------------|
| Valid submission | Form submits, success message | All required fields filled | N/A |
| Missing required field | Error displayed | Name field empty | "Name is required" |
| Invalid email | Email validation error | "invalid-email" | "Invalid email format" |
| Long input | Truncated or wrapped | 500-character string | Depends on UI |
| Special characters | Handled correctly | Name: "O'Brien", Message: "Test & verify" | No error |
| Rapid re-submission | Prevented (debounce) | Click submit 3x rapidly | Only 1 submission |

---

### B. RESPONSIVE BREAKPOINT TESTS (P3)

Test at: 375px (mobile), 768px (tablet), 1024px (desktop), 1280px (wide)

#### Key Pages to Test:
- Home page: SkillOrbit behavior changes
- Projects: Grid columns change (1→2→3)
- Contact: Form layout changes
- Navigation: Desktop nav → mobile menu

#### Critical Breakpoint Behaviors:
```python
def test_home_mobile_375px():
    driver.set_window_size(375, 667)
    assert NOT driver.find_element(By.CLASS_NAME, "skill-orbit").is_displayed()
    assert driver.find_element(By.CLASS_NAME, "accordion").is_displayed()

def test_home_desktop_1024px():
    driver.set_window_size(1024, 768)
    assert driver.find_element(By.CLASS_NAME, "skill-orbit").is_displayed()
    assert NOT driver.find_element(By.CLASS_NAME, "accordion").is_displayed()
```

---

### C. KEYBOARD NAVIGATION TESTS (P3)

All interactive pages must support keyboard-only navigation:

#### Test Cases:
| Test Case | Keys | Expected Result |
|-----------|------|-----------------|
| Tab through buttons | Tab, Tab, Tab | Focus visible on each button |
| Enter to click button | Tab to button, Enter | Button activated |
| Escape to close modal | Escape | Modal closes |
| Arrow keys in tabs | ArrowRight, ArrowLeft | Tab selection changes |
| Skip links | Skip to main content | Focus jumps to main |

---

### D. ANIMATION COMPLETION TESTS (P3)

Pages with significant animations must complete before interaction:

#### Affected Pages:
- Home page (SkillOrbit animations)
- Project cards (hover scaling)
- Blog posts (scroll reveals)
- AI pages (Framer Motion staggered children)

#### Test Pattern:
```python
def test_home_animation_completes():
    wait.until(EC.presence_of_element_located((By.CLASS_NAME, "hero-section")))
    time.sleep(0.8)  # Wait for Framer Motion animation
    # Now verify state after animation
    hero = driver.find_element(By.CLASS_NAME, "hero-section")
    opacity = driver.execute_script("return window.getComputedStyle(arguments[0]).opacity", hero)
    assert float(opacity) == 1.0
```

---

### E. CROSS-BROWSER VALIDATION TESTS (P3)

Run weekly against:
- Chrome (primary)
- Firefox (secondary)
- Edge (Windows-specific)

#### Critical Pages to Test:
- Home (animation rendering differences)
- Contact form (validation messages)
- Blog post (MDX rendering)

---

## COMPLETION TRACKING LOG

**Current Status: FRAMEWORK DEPLOYMENT PHASE**

| Phase | Milestone | Status | Completion Date |
|-------|-----------|--------|-----------------|
| 1 | Directory structure | ✅ DONE | Jan 13, 2026 |
| 2 | Documentation | 🟡 IN PROGRESS | Jan 13, 2026 |
| 3 | Base POM classes | 🔴 NOT STARTED | Jan 14, 2026 |
| 4 | Smoke tests (P0) | 🔴 NOT STARTED | Jan 15, 2026 |
| 5 | Critical path tests (P1) | 🔴 NOT STARTED | Jan 17, 2026 |
| 6 | Feature tests (P2) | 🔴 NOT STARTED | Jan 20, 2026 |
| 7 | Edge case tests (P3) | 🔴 NOT STARTED | Jan 25, 2026 |
| 8 | CI/CD integration | 🔴 NOT STARTED | Jan 27, 2026 |
| 9 | Full framework complete | 🔴 NOT STARTED | Jan 31, 2026 |

---

**Document Version:** 1.0  
**Last Updated:** January 13, 2026  
**Next Update:** As tests are implemented and pages are tested
