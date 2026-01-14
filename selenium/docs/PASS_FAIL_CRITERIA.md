# PASS/FAIL CRITERIA - TEST ACCEPTANCE STANDARDS

**Date:** January 13, 2026  
**Classification:** QUALITY ASSURANCE STANDARDS  
**Purpose:** Precise acceptance criteria for every page test  
**Owner:** QA Engineering Division

---

## INTRODUCTION

This document defines **exactly** what "passing" means for each page in the portfolio. 

### Three Success Levels:

1. **✅ PASS** - All acceptance criteria met
2. **⚠️ CONDITIONAL PASS** - Criteria met with known limitations documented
3. **❌ FAIL** - Any acceptance criterion not met; test must not proceed

---

## PAGE-LEVEL ACCEPTANCE CRITERIA

### PAGE 1: HOME PAGE (/)

#### 1.1 Page Load Success
**Acceptance Criteria:**
- ✅ HTTP status 200 (no 4xx or 5xx errors)
- ✅ Page renders within 3 seconds
- ✅ No console errors (errors/warnings allowed)
- ✅ No critical resource failures (images, scripts)

**Verification Code:**
```python
def test_home_page_load():
    driver.get(BASE_URL)
    assert driver.find_element(By.TAG_NAME, "main") is not None
    # Check no 404s or 500s in network requests
    # Screenshots: full page visible
```

#### 1.2 Hero Section Visibility
**Acceptance Criteria:**
- ✅ H1 "Engineer Dev Mahn X" visible
- ✅ Hero title font-size: 7xl on desktop, 4xl on mobile
- ✅ Hero subtitle visible
- ✅ Primary CTA button visible
- ✅ Hero section scrolls into view without cutoff

**Pass Verification:**
```python
h1 = driver.find_element(By.TAG_NAME, "h1")
assert h1.is_displayed()
assert h1.text == "Engineer Dev Mahn X"
assert "4xl" in h1.get_attribute("class")  # or computed style
```

**Fail Conditions:**
- ❌ H1 not found or invisible
- ❌ Text is different or truncated
- ❌ Element off-screen or partially hidden

#### 1.3 "Explore the Work" Button
**Acceptance Criteria:**
- ✅ Button visible and clickable
- ✅ Button text: "Explore the Work"
- ✅ Button is blue/accent color
- ✅ Click scrolls page to #systems section
- ✅ Scroll animation completes smoothly
- ✅ Target section (systems) becomes visible

**Pass Verification:**
```python
button = driver.find_element(By.DATA_TESTID, "explore-work-button")
assert button.is_displayed()
assert button.is_enabled()
assert button.text == "Explore the Work"
button.click()
# Wait for scroll animation
wait.until(lambda d: d.find_element(By.ID, "systems").is_displayed())
```

**Fail Conditions:**
- ❌ Button not visible/clickable
- ❌ Click doesn't scroll
- ❌ Page scrolls to wrong section
- ❌ Scroll timeout (> 2 seconds)

#### 1.4 "Contact / Collaborate" Button
**Acceptance Criteria:**
- ✅ Button visible and clickable
- ✅ Button text: "Contact / Collaborate"
- ✅ Click navigates to `/resume`
- ✅ Navigation completes within 2 seconds
- ✅ New page URL is `/resume`

**Pass Verification:**
```python
button = driver.find_element(By.DATA_TESTID, "contact-button")
button.click()
wait.until(lambda d: "/resume" in d.current_url)
assert driver.current_url.endswith("/resume")
```

**Fail Conditions:**
- ❌ Button not found/clickable
- ❌ Navigation doesn't happen
- ❌ Wrong page loads
- ❌ Navigation timeout

#### 1.5 SkillOrbit (Desktop Only)
**Acceptance Criteria:** (Desktop 1024px+)
- ✅ SkillOrbit component rendered
- ✅ Central node visible with label "Skills"
- ✅ At least 6 orbital nodes visible around center
- ✅ Nodes have different colors (visual distinction)
- ✅ Hover over node: label appears, color intensity increases
- ✅ Click node: navigates to related page
- ✅ Animation smooth, no jank

**Pass Verification:**
```python
driver.set_window_size(1280, 720)
orbit = driver.find_element(By.DATA_TESTID, "skill-orbit")
assert orbit.is_displayed()
nodes = driver.find_elements(By.CLASS_NAME, "orbit-node")
assert len(nodes) >= 6
# Hover test
node = nodes[0]
driver.execute_script("arguments[0].hover();", node)
wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "orbit-label")))
```

**Fail Conditions:**
- ❌ SkillOrbit not visible on desktop
- ❌ Fewer than 6 nodes
- ❌ Hover doesn't trigger label
- ❌ Click doesn't navigate

**Conditional Pass:** (Mobile < 768px)
- ✅ SkillOrbit NOT visible (hidden)
- ✅ Accordion component visible instead
- ✅ Accordion items clickable and expand

#### 1.6 Performance Benchmarks
**Acceptance Criteria:**
- ✅ Time to First Paint (FP) < 1.5s
- ✅ Time to First Contentful Paint (FCP) < 2s
- ✅ Largest Contentful Paint (LCP) < 3s
- ✅ First Input Delay (FID) < 100ms
- ✅ Cumulative Layout Shift (CLS) < 0.1

**Verification:**
```python
perf_data = driver.execute_script(
    "return window.performance.timing"
)
# Calculate metrics
fp = perf_data['responseEnd'] - perf_data['navigationStart']
assert fp < 1500  # milliseconds
```

#### 1.7 Accessibility Compliance
**Acceptance Criteria:**
- ✅ H1 heading present and unique
- ✅ All buttons have aria-label or visible text
- ✅ Links have descriptive text (not "click here")
- ✅ Color contrast ratio ≥ 4.5:1 for text
- ✅ Page navigable via keyboard (Tab, Enter, Escape)
- ✅ No keyboard traps
- ✅ Focus visible on all interactive elements

**Verification:**
```python
h1_count = len(driver.find_elements(By.TAG_NAME, "h1"))
assert h1_count == 1  # Only one H1
# Check all buttons have labels
buttons = driver.find_elements(By.TAG_NAME, "button")
for btn in buttons:
    label = btn.get_attribute("aria-label") or btn.text
    assert label.strip() != ""
```

---

### PAGE 2: BLOG INDEX (/blog)

#### 2.1 Page Load
- ✅ HTTP 200
- ✅ Page load < 3s
- ✅ No critical errors

#### 2.2 Blog Title & Description
- ✅ H1 "Systems Journal" visible
- ✅ Tagline/description visible below title
- ✅ Title font-size responsive (3xl mobile, 5xl desktop)

#### 2.3 Blog Posts Display
- ✅ At least 5 blog posts rendered in list
- ✅ Each post shows: title, excerpt, date, reading time
- ✅ Posts in correct date order (newest first)
- ✅ Post cards have hover effect (border/shadow change)

**Pass Verification:**
```python
posts = driver.find_elements(By.DATA_TESTID, "blog-post-card")
assert len(posts) >= 5
# Check first post title is visible
assert posts[0].find_element(By.TAG_NAME, "h3").text != ""
```

#### 2.4 Post Card Navigation
- ✅ Each post card is clickable
- ✅ Click navigates to `/blog/[slug]`
- ✅ Navigation completes < 2s
- ✅ New page has post title in H1

**Pass Verification:**
```python
post = driver.find_element(By.DATA_TESTID, "blog-post-card")
post_title = post.find_element(By.TAG_NAME, "h3").text
post.click()
wait.until(lambda d: "/blog/" in d.current_url and "[slug]" not in d.current_url)
assert driver.find_element(By.TAG_NAME, "h1").text == post_title
```

#### 2.5 CorePhilosophies Section
- ✅ Section visible
- ✅ At least 3 philosophy items displayed
- ✅ Each item has icon, title, description

#### 2.6 ResearchHub Section
- ✅ Section visible
- ✅ Research areas displayed as cards
- ✅ Cards are interactive (hover states)

---

### PAGE 7: CONTACT (/contact)

#### 7.1 Form Rendering
- ✅ Form element visible with all 4 fields:
  - Name (text input)
  - Email (email input)
  - Subject (text input)
  - Message (textarea)
- ✅ Submit button visible and clickable
- ✅ All fields have placeholder text

**Pass Verification:**
```python
form = driver.find_element(By.DATA_TESTID, "contact-form")
assert form.find_element(By.NAME, "name").is_displayed()
assert form.find_element(By.NAME, "email").is_displayed()
assert form.find_element(By.NAME, "subject").is_displayed()
assert form.find_element(By.NAME, "message").is_displayed()
assert form.find_element(By.DATA_TESTID, "submit-button").is_displayed()
```

#### 7.2 Client-Side Validation (Empty Fields)
- ✅ Leave Name field empty, click Submit → Error appears
- ✅ Error message: "Name is required"
- ✅ Error appears within 1 second
- ✅ Form NOT submitted to server

**Pass Verification:**
```python
email_field = form.find_element(By.NAME, "email")
email_field.clear()
submit_btn = form.find_element(By.DATA_TESTID, "submit-button")
submit_btn.click()
error = wait.until(EC.text_to_be_present_in_element(
    (By.DATA_TESTID, "error-message"),
    "Email is required"
))
```

**Fail Conditions:**
- ❌ No error message appears
- ❌ Wrong error message text
- ❌ Error appears but form still submits

#### 7.3 Client-Side Validation (Invalid Email)
- ✅ Enter invalid email "not-an-email"
- ✅ Submit → Email validation error appears
- ✅ Error message: "Invalid email format"
- ✅ Form NOT submitted

**Pass Verification:**
```python
email_field.send_keys("not-an-email")
submit_btn.click()
error = wait.until(EC.text_to_be_present_in_element(
    (By.DATA_TESTID, "error-message"),
    "Invalid email"
))
```

#### 7.4 Successful Form Submission
- ✅ Fill all fields with valid data:
  - Name: "John Doe"
  - Email: "john@example.com"
  - Subject: "Test Message"
  - Message: "This is a test"
- ✅ Click Submit
- ✅ Loading spinner appears
- ✅ API call completes (< 5s)
- ✅ Success message appears: "Message sent successfully!"
- ✅ Form resets (fields cleared)

**Pass Verification:**
```python
form.fill_field("name", "John Doe")
form.fill_field("email", "john@example.com")
form.fill_field("subject", "Test")
form.fill_field("message", "Message body")
submit_btn.click()

# Wait for loading
wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "spinner")))
wait.until(EC.invisibility_of_element_located((By.CLASS_NAME, "spinner")))

# Check success
success_msg = wait.until(EC.text_to_be_present_in_element(
    (By.DATA_TESTID, "success-message"),
    "sent successfully"
))

# Verify form reset
assert form.find_element(By.NAME, "name").get_attribute("value") == ""
```

**Fail Conditions:**
- ❌ Loading spinner doesn't appear
- ❌ Timeout (API takes > 5s)
- ❌ Error appears instead of success
- ❌ Form doesn't reset

#### 7.5 Contact Methods Display
- ✅ 4 contact method cards visible:
  - Email (mailto:)
  - GitHub (external link)
  - LinkedIn (external link)
  - Twitter (external link)
- ✅ Each card has icon + title
- ✅ Cards are clickable/have correct href

**Pass Verification:**
```python
contact_methods = driver.find_elements(By.DATA_TESTID, "contact-method-card")
assert len(contact_methods) == 4
# Check links
email_card = contact_methods[0]
assert "mailto:" in email_card.find_element(By.TAG_NAME, "a").get_attribute("href")
```

---

### PAGE 13: AI CHAT (/ai/chat)

#### 13.1 Chat Interface Loads
- ✅ ChatPageClient component renders
- ✅ Message input field visible
- ✅ Send button visible and clickable
- ✅ Chat history area visible (empty or with welcome message)

#### 13.2 Message Input
- ✅ Type text in message field → text appears
- ✅ Clear field → text disappears
- ✅ Max length enforcement (if applicable)

#### 13.3 Send Message
- ✅ Type "Hello" in message field
- ✅ Click Send button
- ✅ Message appears in chat history
- ✅ Message field clears
- ✅ API call made (if backend implemented)
- ✅ Response appears (if backend implemented)

#### 13.4 Example Questions
- ✅ Example question cards visible
- ✅ At least 3 example questions displayed
- ✅ Click example → fills message field (if interactive)
- ✅ Or example provides context (if display-only)

---

### PAGE 30: SEARCH (/search)

#### 30.1 Search Interface
- ✅ Search input field visible
- ✅ Placeholder text: "Search pages, posts, projects..."
- ✅ Search button or auto-search on input

#### 30.2 Search Functionality
- ✅ Type "blog" → blog pages appear in results
- ✅ Type "project" → project pages appear in results
- ✅ Type non-existent term → "No results found" message
- ✅ Results update in real-time (< 1s)

#### 30.3 Result Selection
- ✅ Click result → navigate to page
- ✅ Navigation completes < 2s
- ✅ Correct page loads

---

### CROSS-PAGE ACCEPTANCE CRITERIA

#### A. Navigation Tests
**Every page must:**
- ✅ Have working navigation menu (desktop)
- ✅ Have working mobile menu (mobile)
- ✅ All nav links clickable
- ✅ Links navigate to correct pages
- ✅ Current page highlighted in nav

#### B. Responsive Breakpoint Tests

**Mobile (375px):**
- ✅ Page renders without horizontal scroll
- ✅ Text readable (16px minimum)
- ✅ Touch targets ≥ 44px × 44px
- ✅ Mobile menu visible, desktop nav hidden

**Tablet (768px):**
- ✅ Layout adapts (2-column grids)
- ✅ Touch targets ≥ 44px × 44px
- ✅ Text readable

**Desktop (1024px+):**
- ✅ Full layout renders
- ✅ 3-column grids where applicable
- ✅ Desktop nav visible, mobile hidden

#### C. Animation Completion Tests

**All animated elements:**
- ✅ Animation completes < 1s (except long sequences)
- ✅ Element at final state after animation
- ✅ No jank or stuttering
- ✅ Smooth 60fps transition
- ✅ Reduced-motion respected (if user preference set)

#### D. Accessibility Tests (All Pages)

- ✅ Page has exactly 1 H1
- ✅ Heading hierarchy correct (H1 → H2 → H3, no skips)
- ✅ All images have alt text
- ✅ All buttons/links have text or aria-label
- ✅ Color not the only distinguishing factor
- ✅ Focus visible on all interactive elements
- ✅ No keyboard traps
- ✅ ARIA live regions for dynamic content

---

## FAILURE ESCALATION MATRIX

| Failure Type | Severity | Action | Timeline |
|--------------|----------|--------|----------|
| Page doesn't load (404/500) | 🔴 CRITICAL | Stop. Don't proceed. | Immediate |
| Primary CTA non-functional | 🔴 CRITICAL | Stop. Fix before merge. | Immediate |
| Form validation broken | 🔴 CRITICAL | Stop. Block merge. | Immediate |
| Mobile layout broken | 🟡 HIGH | Flag. Discuss before merge. | Same day |
| Animation stutters | 🟡 HIGH | Flag. Performance review. | Same day |
| Missing accessibility | 🟡 HIGH | Document. Fix in next sprint. | 1 week |
| Typo/minor styling | 🟢 LOW | Document. Fix when convenient. | When able |

---

## REPORTING TEMPLATE

When a test **FAILS**, document:

```markdown
### Test Failure Report

**Test ID:** [e.g., 1.3]
**Test Name:** Explore the Work Button
**Date/Time:** [timestamp]
**Browser:** Chrome 120.0
**Resolution:** 1024x768
**Environment:** Staging

**Failure Message:**
Button click did not scroll to #systems section

**Steps Taken:**
1. Loaded home page
2. Found explore button
3. Clicked button
4. Waited 2s for scroll
5. Check: #systems not visible

**Expected:** Page scrolls to #systems section
**Actual:** Page did not scroll

**Screenshots:**
- Before click: [screenshot_01.png]
- After click: [screenshot_02.png]
- Console log: [error_log.txt]

**Root Cause:** (To be determined)
**Fix Required:** (To be determined)
```

---

**Document Version:** 1.0  
**Last Updated:** January 13, 2026  
**Approval Status:** ACTIVE
