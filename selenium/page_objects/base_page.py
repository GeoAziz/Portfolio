"""
Base Page Object Model Class

Provides common functionality for all page objects:
- Driver management
- Smart wait conditions
- Element interaction methods
- Screenshot capability
- Error handling

All page objects should inherit from BasePage.
"""
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time
import os
from datetime import datetime


class BasePage:
    """Base class for all page objects."""

    def __init__(self, driver, base_url="http://localhost:9002", timeout=15):
        """
        Initialize page object.
        
        Args:
            driver: Selenium WebDriver instance
            base_url: Base URL of the application
            timeout: Default wait timeout in seconds
        """
        self.driver = driver
        self.base_url = base_url
        self.timeout = timeout
        self.wait = WebDriverWait(driver, timeout)
        self.actions = ActionChains(driver)

    # ============================================================================
    # NAVIGATION METHODS
    # ============================================================================

    def navigate_to(self, path):
        """Navigate to a specific path on the site."""
        url = f"{self.base_url}{path}"
        self.driver.get(url)
        time.sleep(0.5)  # Small buffer for initial render

    def navigate_to_home(self):
        """Navigate to home page."""
        self.navigate_to("/")

    def get_current_url(self):
        """Get current URL."""
        return self.driver.current_url

    def wait_for_url_change(self, expected_path, timeout=None):
        """
        Wait for URL to change to expected path.
        Used for Next.js client-side routing.
        
        Args:
            expected_path: Expected path (e.g., "/blog", "/projects")
            timeout: Wait timeout in seconds (default: self.timeout)
        """
        timeout = timeout or self.timeout
        wait = WebDriverWait(self.driver, timeout)
        wait.until(lambda d: expected_path in d.current_url)

    def refresh_page(self):
        """Refresh the current page."""
        self.driver.refresh()
        time.sleep(0.5)

    # ============================================================================
    # ELEMENT FINDING METHODS
    # ============================================================================

    def find_element(self, locator, timeout=None):
        """
        Find element with explicit wait.
        
        Args:
            locator: Tuple of (By.X, "selector")
            timeout: Wait timeout (default: self.timeout)
            
        Returns:
            WebElement
        """
        timeout = timeout or self.timeout
        wait = WebDriverWait(self.driver, timeout)
        return wait.until(EC.presence_of_element_located(locator))

    def find_elements(self, locator, timeout=None):
        """
        Find multiple elements.
        
        Args:
            locator: Tuple of (By.X, "selector")
            timeout: Wait timeout (default: self.timeout)
            
        Returns:
            List of WebElements
        """
        timeout = timeout or self.timeout
        wait = WebDriverWait(self.driver, timeout)
        wait.until(EC.presence_of_all_elements_located(locator))
        return self.driver.find_elements(*locator)

    def find_clickable_element(self, locator, timeout=None):
        """
        Find element that is clickable (visible AND enabled).
        Used for buttons, links, etc.
        
        Args:
            locator: Tuple of (By.X, "selector")
            timeout: Wait timeout (default: self.timeout)
            
        Returns:
            WebElement (clickable)
        """
        timeout = timeout or self.timeout
        wait = WebDriverWait(self.driver, timeout)
        return wait.until(EC.element_to_be_clickable(locator))

    def find_visible_element(self, locator, timeout=None):
        """
        Find element that is visible on screen.
        
        Args:
            locator: Tuple of (By.X, "selector")
            timeout: Wait timeout (default: self.timeout)
            
        Returns:
            WebElement (visible)
        """
        timeout = timeout or self.timeout
        wait = WebDriverWait(self.driver, timeout)
        return wait.until(EC.visibility_of_element_located(locator))

    # ============================================================================
    # ELEMENT INTERACTION METHODS
    # ============================================================================

    def click(self, locator):
        """Click an element."""
        element = self.find_clickable_element(locator)
        element.click()

    def submit_form(self, locator):
        """Submit a form."""
        element = self.find_element(locator)
        element.submit()

    def fill_text(self, locator, text):
        """Fill a text input field."""
        element = self.find_clickable_element(locator)
        element.clear()
        element.send_keys(text)

    def get_text(self, locator):
        """Get text content of an element."""
        element = self.find_element(locator)
        return element.text

    def get_attribute(self, locator, attribute):
        """Get attribute value of an element."""
        element = self.find_element(locator)
        return element.get_attribute(attribute)

    def is_element_displayed(self, locator):
        """Check if element is displayed."""
        try:
            element = self.find_element(locator, timeout=2)
            return element.is_displayed()
        except:
            return False

    def is_element_enabled(self, locator):
        """Check if element is enabled."""
        element = self.find_element(locator)
        return element.is_enabled()

    def hover_over(self, locator):
        """Hover over an element."""
        element = self.find_element(locator)
        self.actions.move_to_element(element).perform()
        time.sleep(0.3)  # Small wait for hover state to render

    def double_click(self, locator):
        """Double-click an element."""
        element = self.find_clickable_element(locator)
        self.actions.double_click(element).perform()

    def right_click(self, locator):
        """Right-click an element."""
        element = self.find_element(locator)
        self.actions.context_click(element).perform()

    def scroll_to_element(self, locator):
        """Scroll to element and make it visible."""
        element = self.find_element(locator)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", element)
        time.sleep(0.5)

    def scroll_to_top(self):
        """Scroll to top of page."""
        self.driver.execute_script("window.scrollTo(0, 0);")

    def scroll_to_bottom(self):
        """Scroll to bottom of page."""
        self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

    def scroll_by(self, x, y):
        """Scroll by x, y pixels."""
        self.driver.execute_script(f"window.scrollBy({x}, {y});")

    # ============================================================================
    # WAIT METHODS
    # ============================================================================

    def wait_for_element(self, locator, timeout=None):
        """Wait for element to be present in DOM."""
        return self.find_element(locator, timeout)

    def wait_for_element_visible(self, locator, timeout=None):
        """Wait for element to be visible."""
        return self.find_visible_element(locator, timeout)

    def wait_for_element_clickable(self, locator, timeout=None):
        """Wait for element to be clickable."""
        return self.find_clickable_element(locator, timeout)

    def wait_for_text(self, locator, text, timeout=None):
        """Wait for element to contain specific text."""
        timeout = timeout or self.timeout
        wait = WebDriverWait(self.driver, timeout)
        wait.until(EC.text_to_be_present_in_element(locator, text))

    def wait_for_element_to_disappear(self, locator, timeout=None):
        """Wait for element to disappear from DOM."""
        timeout = timeout or self.timeout
        wait = WebDriverWait(self.driver, timeout)
        wait.until(EC.invisibility_of_element_located(locator))

    def wait_for_animation_complete(self, locator, timeout=1):
        """
        Wait for animation to complete (element opacity = 1).
        Used for Framer Motion and CSS animations.
        """
        def animation_complete(driver):
            element = driver.find_element(*locator)
            opacity = driver.execute_script(
                "return window.getComputedStyle(arguments[0]).opacity",
                element
            )
            return float(opacity) == 1.0
        
        wait = WebDriverWait(self.driver, timeout)
        wait.until(animation_complete)

    def wait_for_route_change(self, expected_path, timeout=None):
        """Wait for Next.js route to change."""
        self.wait_for_url_change(expected_path, timeout)

    # ============================================================================
    # ASSERTION HELPER METHODS
    # ============================================================================

    def assert_element_present(self, locator):
        """Assert element is present in DOM."""
        assert self.find_element(locator), f"Element not found: {locator}"

    def assert_element_visible(self, locator):
        """Assert element is visible."""
        element = self.find_visible_element(locator)
        assert element.is_displayed(), f"Element not visible: {locator}"

    def assert_element_text(self, locator, expected_text):
        """Assert element contains expected text."""
        text = self.get_text(locator)
        assert expected_text in text, f"Expected '{expected_text}' in '{text}'"

    def assert_url_contains(self, path):
        """Assert current URL contains path."""
        current_url = self.get_current_url()
        assert path in current_url, f"Expected '{path}' in URL '{current_url}'"

    def assert_page_title(self, expected_title):
        """Assert page title."""
        assert self.driver.title == expected_title, f"Title mismatch: '{self.driver.title}'"

    # ============================================================================
    # UTILITY METHODS
    # ============================================================================

    def get_page_source(self):
        """Get entire page source HTML."""
        return self.driver.page_source

    def take_screenshot(self, filename=None):
        """
        Take screenshot of current page.
        
        Args:
            filename: Optional custom filename (default: auto-generated timestamp)
            
        Returns:
            Path to screenshot file
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"screenshot_{timestamp}.png"
        
        # Create screenshots directory if it doesn't exist
        os.makedirs("screenshots", exist_ok=True)
        filepath = f"screenshots/{filename}"
        
        self.driver.save_screenshot(filepath)
        return filepath

    def get_page_height(self):
        """Get total page height in pixels."""
        return self.driver.execute_script("return document.body.scrollHeight")

    def get_page_width(self):
        """Get total page width in pixels."""
        return self.driver.execute_script("return document.body.scrollWidth")

    def get_element_location(self, locator):
        """Get x, y coordinates of element."""
        element = self.find_element(locator)
        return element.location

    def get_element_size(self, locator):
        """Get width, height of element."""
        element = self.find_element(locator)
        return element.size

    def execute_script(self, script, *args):
        """Execute JavaScript in browser."""
        return self.driver.execute_script(script, *args)

    def execute_async_script(self, script, *args):
        """Execute async JavaScript in browser."""
        return self.driver.execute_async_script(script, *args)

    def switch_to_frame(self, locator):
        """Switch to iframe."""
        frame = self.find_element(locator)
        self.driver.switch_to.frame(frame)

    def switch_to_parent_frame(self):
        """Switch back to parent frame."""
        self.driver.switch_to.parent_frame()

    def switch_to_default_content(self):
        """Switch to main content (out of all frames)."""
        self.driver.switch_to.default_content()

    def switch_to_window(self, window_handle):
        """Switch to different window/tab."""
        self.driver.switch_to.window(window_handle)

    def get_window_handles(self):
        """Get list of all window handles."""
        return self.driver.window_handles

    def close_current_window(self):
        """Close current window/tab."""
        self.driver.close()

    def get_console_logs(self):
        """Get browser console logs (requires logging preference)."""
        logs = self.driver.get_log('browser')
        return logs

    def check_console_errors(self):
        """
        Check for console errors.
        Filters out harmless network 404 errors (missing PWA icons, etc.)
        
        Returns:
            List of error messages (excluding network 404s)
        """
        logs = self.get_console_logs()
        errors = [log for log in logs if log['level'] == 'SEVERE']
        # Filter out harmless 404s (PWA icons, offline resources, etc.)
        filtered_errors = [
            log for log in errors 
            if 'Failed to load resource: the server responded with a status of 404' not in log.get('message', '')
        ]
        return filtered_errors

    # ============================================================================
    # KEYBOARD METHODS
    # ============================================================================

    def press_key(self, key):
        """Press a single key."""
        self.actions.send_keys(key).perform()

    def press_enter_on_element(self, locator):
        """Press Enter key on specific element."""
        element = self.find_clickable_element(locator)
        element.send_keys(Keys.RETURN)

    def press_escape(self):
        """Press Escape key."""
        self.actions.send_keys(Keys.ESCAPE).perform()

    def press_tab(self):
        """Press Tab key (move focus)."""
        self.actions.send_keys(Keys.TAB).perform()

    def press_shift_tab(self):
        """Press Shift+Tab (move focus backward)."""
        self.actions.key_down(Keys.SHIFT).send_keys(Keys.TAB).key_up(Keys.SHIFT).perform()

    # ============================================================================
    # WINDOW/VIEWPORT METHODS
    # ============================================================================

    def set_window_size(self, width, height):
        """Set browser window size."""
        self.driver.set_window_size(width, height)

    def maximize_window(self):
        """Maximize browser window."""
        self.driver.maximize_window()

    def get_window_size(self):
        """Get current window size."""
        return self.driver.get_window_size()

    def set_mobile_viewport(self):
        """Set mobile viewport (375x667)."""
        self.set_window_size(375, 667)

    def set_tablet_viewport(self):
        """Set tablet viewport (768x1024)."""
        self.set_window_size(768, 1024)

    def set_desktop_viewport(self):
        """Set desktop viewport (1024x768)."""
        self.set_window_size(1024, 768)

    def set_wide_viewport(self):
        """Set wide desktop viewport (1280x720)."""
        self.set_window_size(1280, 720)

    # ============================================================================
    # WAIT HELPERS (TIMING)
    # ============================================================================

    def wait(self, seconds):
        """Wait for specified seconds (use sparingly, prefer explicit waits)."""
        time.sleep(seconds)

    def wait_for_framer_animation(self, duration=0.8):
        """Wait for Framer Motion animation (default 0.8s)."""
        time.sleep(duration)

    def wait_for_page_load(self):
        """Wait for page to load (document.readyState = complete)."""
        wait = WebDriverWait(self.driver, self.timeout)
        wait.until(lambda d: d.execute_script("return document.readyState") == "complete")

    # ============================================================================
    # DEBUGGING METHODS
    # ============================================================================

    def print_element_tree(self, locator, depth=2):
        """Print HTML element tree for debugging."""
        element = self.find_element(locator)
        html = element.get_attribute("outerHTML")
        print(f"\n{'='*80}")
        print(f"Element Tree: {locator}")
        print(f"{'='*80}")
        print(html[:500] + "..." if len(html) > 500 else html)
        print(f"{'='*80}\n")

    def print_page_source(self):
        """Print full page source (for debugging)."""
        source = self.get_page_source()
        print(f"\n{'='*80}")
        print("Full Page Source:")
        print(f"{'='*80}")
        print(source)
        print(f"{'='*80}\n")

    def debug_element(self, locator):
        """Print debug info about element."""
        element = self.find_element(locator)
        print(f"\n{'='*80}")
        print(f"Element Debug: {locator}")
        print(f"{'='*80}")
        print(f"Text: {element.text}")
        print(f"Tag: {element.tag_name}")
        print(f"Classes: {element.get_attribute('class')}")
        print(f"ID: {element.get_attribute('id')}")
        print(f"Visible: {element.is_displayed()}")
        print(f"Enabled: {element.is_enabled()}")
        print(f"Location: {element.location}")
        print(f"Size: {element.size}")
        print(f"{'='*80}\n")
