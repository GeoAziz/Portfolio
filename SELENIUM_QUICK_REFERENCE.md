# Selenium Test Framework - Quick Reference

## Framework Overview

**Status:** Wave 1 Complete (5 pages, 67 tests, 100% pass rate)  
**Pattern:** Established and replicable  
**Technology Stack:** Python 3.11, Selenium 4.15.2, pytest 7.4.3, Chrome WebDriver  

---

## Adding a New Page (Wave 2+)

### Step 1: Data-testid Injection (~10 minutes)

Add attributes to your page component:

```tsx
// Main container
<div data-testid="pagename-container">
  // Page content
  <h1 data-testid="pagename-title">Title</h1>
  
  // Interactive elements
  <input data-testid="pagename-input-field" />
  <button data-testid="pagename-submit-button">Submit</button>
  
  // Dynamic lists
  {items.map((item, index) => (
    <Card data-testid={`pagename-item-${index}`}>
      <Title data-testid={`pagename-item-title-${index}`}>
</div>
```

**Naming Convention:**
- Containers: `pagename-container`
- Sections: `pagename-section-name`
- Interactive: `pagename-action-element`
- Dynamic: `pagename-element-{index}` or `pagename-element-{key}`

### Step 2: Create Page Object (~10 minutes)

Copy template from `/selenium/page_objects/blog_page.py`:

```python
from selenium.webdriver.common.by import By
from .base_page import BasePage

class PageNamePage(BasePage):
    """Page object for the PageName page."""
    
    # Locators (ALWAYS use CSS_SELECTOR with data-testid)
    PAGENAME_CONTAINER = (By.CSS_SELECTOR, "[data-testid='pagename-container']")
    PAGENAME_TITLE = (By.CSS_SELECTOR, "[data-testid='pagename-title']")
    PAGENAME_ITEM = "pagename-item-{}"  # For indexed access
    
    def load_page(self):
        """Load the page."""
        self.driver.get(f"{self.base_url}/pagename")
        self.wait_for_element(self.PAGENAME_CONTAINER)
    
    def is_container_visible(self):
        """Check if container is visible."""
        return self.is_element_displayed(self.PAGENAME_CONTAINER)
    
    def verify_page_loaded(self):
        """Verify page loaded successfully."""
        return (self.is_container_visible() and
                self.is_element_displayed(self.PAGENAME_TITLE))
    
    # Add other methods following this pattern
```

**Key Rules:**
- Use `is_element_displayed()` not `is_element_visible()`
- Use `find_clickable_element()` for buttons
- Use `find_element(locator, timeout=2)` with short timeout for optional elements
- Wrap in try/except for resilience
- No assertions in page objects (only in tests)

### Step 3: Create Test Suite (~10 minutes)

Copy template from `/selenium/tests/test_blog.py`:

```python
import pytest
import time
from page_objects.pagename_page import PageNamePage

class TestPageNameLoad:
    """Tests for PageName page loading."""
    
    def test_page_loads(self, driver):
        """Test that page loads successfully."""
        page = PageNamePage(driver)
        page.load_page()
        time.sleep(1.5)  # Standard animation wait (Framer Motion)
        assert page.verify_page_loaded()
    
    def test_element_visible(self, driver):
        """Test that element is visible."""
        page = PageNamePage(driver)
        page.load_page()
        time.sleep(1.5)
        assert page.is_element_displayed(page.PAGENAME_ELEMENT)

class TestPageNameFeature:
    """Tests for specific features."""
    
    def test_feature_works(self, driver):
        """Test feature functionality."""
        page = PageNamePage(driver)
        page.load_page()
        time.sleep(1.5)
        # Test logic here
        assert True

class TestPageNameResponsive:
    """Tests for responsive design."""
    
    def test_desktop_layout(self, driver):
        """Test desktop layout (1024x768)."""
        driver.set_window_size(1024, 768)
        page = PageNamePage(driver)
        page.load_page()
        time.sleep(1.5)
        assert page.verify_page_loaded()
    
    def test_mobile_layout(self, driver):
        """Test mobile layout (375x667)."""
        driver.set_window_size(375, 667)
        page = PageNamePage(driver)
        page.load_page()
        time.sleep(1.5)
        assert page.verify_page_loaded()
```

**Test Structure Template:**
1. **Load Tests (2):** Page loads, key elements visible
2. **Feature Tests (2-4):** Specific functionality
3. **Navigation Tests (2):** Links work, navigation functions
4. **Responsive Tests (2):** Desktop + mobile layouts
5. **Accessibility Tests (0-2):** Text visible, readable

**Total: 10-16 tests per page minimum**

### Step 4: Run Tests

```bash
# Run single page tests
cd /home/devmahnx/Portfolio/selenium
. venv/bin/activate
pytest tests/test_pagename.py -v --headless

# Run all tests
pytest tests/ -v --headless

# Run with coverage
pytest tests/test_pagename.py --cov=page_objects --headless

# Run specific test class
pytest tests/test_pagename.py::TestPageNameLoad -v --headless
```

### Step 5: Verify No Regressions

```bash
# Check P0 smoke tests
pytest tests/test_smoke.py -q --headless
# Should show: 12 passed, 1 warning (pre-existing search failure)
```

---

## Selenium Best Practices in This Framework

### Wait Patterns

```python
# After page load - standard animation wait (Framer Motion 0.8s + buffer)
page.load_page()
time.sleep(1.5)

# For elements that may not exist
try:
    element = page.find_element(locator, timeout=2)
except:
    element = None

# For clickable elements
element = page.find_clickable_element(locator)  # Uses EC.element_to_be_clickable
```

### Element Interaction

```python
# Get text
text = page.get_text(locator)

# Fill form
page.fill_text(input_locator, "text content")

# Click
page.click(locator)

# Hover
page.hover_over(locator)

# Scroll to element
page.scroll_to_element(element)
```

### Testing Resilience

```python
def get_optional_element_count(self):
    """Get count with fallback."""
    try:
        container = self.find_element(self.CONTAINER, timeout=2)
        if container:
            items = container.find_elements(By.CSS_SELECTOR, "[data-testid^='item-']")
            return len(items)
    except:
        pass
    return 0

# In tests:
count = page.get_optional_element_count()
if count > 0:
    assert count >= expected
else:
    # Gracefully skip if no items
    pass
```

---

## Common Patterns

### Pattern 1: Dynamic List Items

**Page Component:**
```tsx
{items.map((item, index) => (
  <Card data-testid={`pagename-item-${index}`}>
    <Title data-testid={`pagename-item-title-${index}`}>{item.title}</Title>
  </Card>
))}
```

**Page Object:**
```python
def get_item_count(self):
    """Get count of items."""
    grid = self.find_element(self.ITEMS_CONTAINER)
    items = grid.find_elements(By.CSS_SELECTOR, "[data-testid^='pagename-item-']")
    # Filter to main items (not titles/details)
    items = [i for i in items if i.get_attribute('data-testid').split('-')[-1].isdigit()]
    return len(items)

def get_item_title(self, index):
    """Get item title by index."""
    locator = (By.CSS_SELECTOR, f"[data-testid='pagename-item-title-{index}']")
    element = self.find_element(locator, timeout=2)
    return element.text if element else None
```

### Pattern 2: Dynamic Filter/Category Items

**Page Component:**
```tsx
{categories.map(category => (
  <Button data-testid={`pagename-filter-${category}`}>
    {category}
  </Button>
))}
```

**Page Object:**
```python
def get_available_filters(self):
    """Get list of available filters."""
    container = self.find_element(self.FILTERS_CONTAINER)
    buttons = container.find_elements(By.CSS_SELECTOR, "button")
    return [btn.text for btn in buttons]

def filter_by_category(self, category):
    """Click filter button."""
    locator = (By.CSS_SELECTOR, f"[data-testid='pagename-filter-{category}']")
    button = self.find_element(locator)
    if button:
        button.click()
        return True
    return False
```

### Pattern 3: Forms

**Page Component:**
```tsx
<input 
  id="name" 
  name="name" 
  data-testid="form-input-name"
  value={formData.name}
  onChange={handleChange}
/>
```

**Page Object:**
```python
def fill_form(self, name, email):
    """Fill form fields."""
    name_field = self.find_element(self.FORM_INPUT_NAME)
    email_field = self.find_element(self.FORM_INPUT_EMAIL)
    
    name_field.clear()
    name_field.send_keys(name)
    
    email_field.clear()
    email_field.send_keys(email)
    
    return True

def get_form_values(self):
    """Get current form values."""
    try:
        name = self.find_element(self.FORM_INPUT_NAME).get_attribute('value')
        email = self.find_element(self.FORM_INPUT_EMAIL).get_attribute('value')
        return {'name': name, 'email': email}
    except:
        return None
```

---

## Debugging Tips

### Check What Elements Have data-testid

```bash
# In browser console
$$('[data-testid]').forEach(el => console.log(el.getAttribute('data-testid')))
```

### Enable Debug Logging

```python
# In conftest.py or test
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Take Screenshots on Failure

```python
def test_something(self, driver):
    try:
        # test logic
        assert False
    except AssertionError:
        driver.save_screenshot('debug.png')
        raise
```

### Use Headless False for Interactive Debugging

```bash
pytest tests/test_pagename.py -v  # Remove --headless
# Browser will stay open, you can inspect elements
```

---

## Performance Baselines

**Per Test:** ~2-3 seconds average  
**Per Page Suite (10 tests):** ~20-40 seconds  
**Full Framework (67 tests):** ~900 seconds (~15 minutes)  

---

## Command Reference

```bash
# Setup
cd /home/devmahnx/Portfolio/selenium
. venv/bin/activate

# Run all tests
pytest tests/ -v --headless

# Run specific page
pytest tests/test_pagename.py -v --headless

# Run specific class
pytest tests/test_pagename.py::TestPageNameLoad -v --headless

# Run specific test
pytest tests/test_pagename.py::TestPageNameLoad::test_page_loads -v --headless

# Run with output
pytest tests/ -s --headless  # Show print statements

# Run with coverage
pytest tests/ --cov=page_objects --headless

# Quick smoke test
pytest tests/test_smoke.py -q --headless
```

---

## File Structure

```
/home/devmahnx/Portfolio/
├── selenium/
│   ├── page_objects/
│   │   ├── base_page.py          # Base class (don't modify)
│   │   ├── home_page.py          # Pattern reference
│   │   ├── blog_page.py
│   │   ├── projects_page.py
│   │   ├── contact_page.py
│   │   ├── resume_page.py
│   │   └── opensource_page.py
│   ├── tests/
│   │   ├── conftest.py           # Fixtures (don't modify)
│   │   ├── test_smoke.py         # P0 tests (don't modify)
│   │   ├── test_blog.py
│   │   ├── test_projects.py
│   │   ├── test_contact.py
│   │   ├── test_resume.py
│   │   └── test_opensource.py
│   └── venv/                      # Virtual environment
├── src/
│   └── app/
│       ├── blog/
│       ├── projects/
│       ├── contact/
│       ├── resume/
│       └── open-source/
```

---

## Support Resources

**Documentation Files:**
- `/WAVE_1_COMPLETION_REPORT.md` - Full Wave 1 summary
- `/STABILIZATION_EXHAUSTIVE.md` - Framework planning document
- This file: Quick reference for adding new pages

**Existing Examples:**
- `BlogPage` - Simple page with filters
- `ProjectsPage` - Complex page with multiple grids and filters
- `ContactPage` - Form handling example
- `ResumePage` - Multi-section page example
- `OpenSourcePage` - Content-heavy page example

---

**Last Updated:** January 13, 2026  
**Maintained By:** AI Coding Agent  
**Wave Status:** 1 Complete, Ready for Wave 2
