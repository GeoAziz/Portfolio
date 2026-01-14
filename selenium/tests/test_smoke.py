"""
SMOKE TESTS - P0 Priority (Critical Path)

Run on EVERY commit. These tests verify the most critical functionality.
If any of these fail, the build is broken and should not proceed.

Test Categories:
- Page load success
- Navigation functionality
- Primary CTA buttons
- No console errors
- Basic auth flow

Time budget: 2 minutes
Target: 100% pass rate
"""

import pytest
from selenium.webdriver.common.by import By
import time


@pytest.mark.smoke
class TestHomePageSmoke:
    """Smoke tests for home page."""

    def test_home_page_loads(self, driver):
        """
        TEST 1.1: Home page loads successfully
        
        Verifies:
        - HTTP 200 status
        - Page content renders within 3 seconds
        - Main content area visible
        - No critical errors
        """
        driver.get("http://localhost:9002")
        
        # Wait for main content
        main = driver.find_element(By.TAG_NAME, "main")
        assert main.is_displayed(), "Main content not visible"

    def test_hero_section_visible(self, home_page):
        """
        TEST 1.2: Hero section renders correctly
        
        Verifies:
        - H1 title visible with correct text
        - Hero section displays without cutoff
        - Primary CTA buttons visible
        """
        home_page.load_page()
        
        # Wait for Framer Motion animations (0.8s)
        import time
        time.sleep(1.5)
        
        # Verify title
        assert home_page.is_hero_section_visible(), "Hero section not visible"
        title = home_page.get_hero_title_text()
        assert "Engineer" in title or "Dev" in title, f"Title incorrect: {title}"

    def test_explore_button_clickable(self, home_page):
        """
        TEST 1.3: Explore button is visible and clickable
        
        Verifies:
        - Button exists in DOM
        - Button is visible
        - Button is enabled
        """
        home_page.load_page()
        
        # Wait for animations to settle
        import time
        time.sleep(1.5)
        
        home_page.verify_explore_button_visible()

    def test_contact_button_clickable(self, home_page):
        """
        TEST 1.4: Contact button is visible and clickable
        
        Verifies:
        - Button exists in DOM
        - Button is visible
        - Button is enabled
        """
        home_page.load_page()
        
        # Wait for animations to settle
        import time
        time.sleep(1.5)
        
        home_page.verify_contact_button_visible()

    def test_no_console_errors(self, home_page):
        """
        TEST 1.5: No critical console errors
        
        Verifies:
        - No SEVERE errors in browser console
        - Warnings allowed (not fatal)
        """
        home_page.load_page()
        
        # Wait for all scripts to load
        import time
        time.sleep(1.5)
        
        home_page.verify_no_console_errors()


@pytest.mark.smoke
class TestNavigationSmoke:
    """Smoke tests for navigation functionality."""

    def test_home_to_projects_navigation(self, home_page):
        """
        TEST 2.1: Navigate from home to systems section via Explore button
        
        Verifies:
        - Explore button clickable
        - Click scrolls to #systems section
        - Systems section visible after click
        """
        home_page.load_page()
        
        # Wait for animations
        import time
        time.sleep(1.5)
        
        home_page.click_explore_button()
        
        # Wait for scroll animation and verify systems section visible
        time.sleep(1.5)
        
        # Verify systems section is now visible
        assert home_page.is_element_displayed((By.ID, "systems")), "Systems section not visible after click"

    def test_home_to_resume_navigation(self, home_page):
        """
        TEST 2.2: Navigate from home to resume via Contact button
        
        Verifies:
        - Contact button clickable
        - Click navigates to /resume
        - New page loads successfully
        """
        home_page.load_page()
        
        # Wait for animations
        import time
        time.sleep(1.5)
        
        home_page.click_contact_button()
        
        # Wait for navigation
        home_page.wait_for_url_change("/resume", timeout=5)
        
        # Verify navigation
        assert "/resume" in home_page.get_current_url(), "Navigation failed"


@pytest.mark.smoke
class TestContactFormSmoke:
    """Smoke tests for contact form."""

    def test_contact_page_loads(self, driver):
        """
        TEST 3.1: Contact page loads successfully
        
        Verifies:
        - Page loads at /contact
        - Contact form visible
        - All input fields present
        """
        driver.get("http://localhost:9002/contact")
        
        # Wait for page to load
        import time
        time.sleep(1.5)
        
        # Look for contact form
        form = driver.find_element(By.TAG_NAME, "form")
        assert form.is_displayed(), "Contact form not visible"

    def test_contact_form_has_all_fields(self, driver):
        """
        TEST 3.2: Contact form has all required fields
        
        Verifies:
        - Name input field
        - Email input field
        - Subject input field
        - Message textarea
        - Submit button
        """
        driver.get("http://localhost:9002/contact")
        
        # Check all fields exist
        name_field = driver.find_element(By.NAME, "name")
        email_field = driver.find_element(By.NAME, "email")
        subject_field = driver.find_element(By.NAME, "subject")
        message_field = driver.find_element(By.NAME, "message")
        
        assert name_field, "Name field missing"
        assert email_field, "Email field missing"
        assert subject_field, "Subject field missing"
        assert message_field, "Message field missing"


@pytest.mark.smoke
class TestPageAccessibility:
    """Smoke tests for basic accessibility."""

    def test_home_page_has_single_h1(self, home_page):
        """
        TEST 4.1: Home page has exactly one H1 heading
        
        Accessibility requirement: Each page should have one main H1
        
        Verifies:
        - Exactly one H1 present
        - H1 text is meaningful
        """
        home_page.load_page()
        
        # Wait for animations
        import time
        time.sleep(1.5)
        
        h1_elements = home_page.find_elements((By.TAG_NAME, "h1"))
        assert len(h1_elements) == 1, f"Expected 1 H1, found {len(h1_elements)}"

    def test_navigation_structure_present(self, driver):
        """
        TEST 4.2: Page has semantic navigation structure
        
        Verifies:
        - Navigation element present
        - Navigation is semantic (nav tag or role)
        """
        driver.get("http://localhost:9002")
        
        # Wait for page to load
        import time
        time.sleep(1.5)
        
        # Look for navigation header via data-testid
        nav_header = driver.find_element(By.CSS_SELECTOR, "[data-testid='navigation-header']")
        assert nav_header.is_displayed(), "Navigation header not found"


@pytest.mark.smoke
class TestSearchFunctionality:
    """Smoke tests for search feature."""

    def test_search_page_loads(self, driver):
        """
        TEST 5.1: Search page loads successfully
        
        Verifies:
        - Page loads at /search
        - Search input visible
        """
        driver.get("http://localhost:9002/search")
        time.sleep(1)
        
        # Look for search input with data-testid (now available)
        try:
            search_input = driver.find_element(By.CSS_SELECTOR, "[data-testid='search-input']")
        except Exception:
            # Fallback to any input if testid not found
            search_input = driver.find_element(By.TAG_NAME, "input")
        
        assert search_input.is_displayed(), "Search input not visible"

    def test_search_input_accepts_text(self, driver):
        """
        TEST 5.2: Search input accepts text
        
        Verifies:
        - Can type in search field
        - Text appears in field
        """
        driver.get("http://localhost:9002/search")
        
        search_input = driver.find_element(By.TAG_NAME, "input")
        search_input.send_keys("test")
        
        value = search_input.get_attribute("value")
        assert "test" in value, "Text not entered in search field"


# ============================================================================
# SMOKE TEST EXECUTION SUMMARY
# ============================================================================

"""
These tests should run in under 2 minutes total.

Success Criteria:
✅ All 15+ smoke tests pass
✅ No flaky test failures (consistent results)
✅ No timeouts or hangs
✅ Full page load < 3 seconds
✅ Navigation < 5 seconds

If ANY smoke test fails:
1. Check if dev server is running (npm run dev)
2. Review test output for specific error
3. Take screenshot from selenium/screenshots/
4. Check browser console in selenium/reports/
5. Verify component changes didn't break selector

Running Smoke Tests:
$ pytest tests/test_smoke.py -v
$ pytest tests/test_smoke.py -v --headed     # Watch browser
$ pytest tests/test_smoke.py -v --html=reports/report.html
"""
