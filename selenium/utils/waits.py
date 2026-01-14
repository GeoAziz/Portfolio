"""
Smart Wait Strategies for Next.js Testing

Custom wait conditions for Next.js-specific challenges:
- Client-side routing detection
- React hydration timing
- Animation completion
- API response waiting
- Code splitting delays
"""

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class NextJSWaits:
    """Custom wait conditions for Next.js applications."""

    @staticmethod
    def wait_for_route_change(driver, expected_path, timeout=10):
        """
        Wait for Next.js route to change.
        Works with client-side routing (no full page reload).
        
        Args:
            driver: Selenium WebDriver
            expected_path: Expected path (e.g., "/blog", "/projects")
            timeout: Wait timeout in seconds
        """
        wait = WebDriverWait(driver, timeout)
        wait.until(lambda d: expected_path in d.current_url)

    @staticmethod
    def wait_for_route_and_content(driver, expected_path, content_locator, timeout=10):
        """
        Wait for BOTH route change AND new content to load.
        More robust than just checking URL.
        
        Args:
            driver: Selenium WebDriver
            expected_path: Expected path
            content_locator: Tuple of (By.X, "selector") for new page content
            timeout: Wait timeout
        """
        wait = WebDriverWait(driver, timeout)
        # First wait for URL
        wait.until(lambda d: expected_path in d.current_url)
        # Then wait for content
        wait.until(EC.presence_of_element_located(content_locator))

    @staticmethod
    def wait_for_hydration(driver, timeout=5):
        """
        Wait for React hydration to complete.
        Ensures server-rendered HTML is now interactive.
        
        Args:
            driver: Selenium WebDriver
            timeout: Wait timeout in seconds
        """
        wait = WebDriverWait(driver, timeout)
        # React app is hydrated when document is ready
        wait.until(lambda d: d.execute_script("return document.readyState") == "complete")

    @staticmethod
    def wait_for_element_clickable_after_hydration(driver, locator, timeout=10):
        """
        Wait for element to be clickable (not just visible).
        Essential after client-side route changes.
        
        Args:
            driver: Selenium WebDriver
            locator: Tuple of (By.X, "selector")
            timeout: Wait timeout
        """
        wait = WebDriverWait(driver, timeout)
        return wait.until(EC.element_to_be_clickable(locator))

    @staticmethod
    def wait_for_animation_complete(driver, locator, duration=0.8, timeout=5):
        """
        Wait for Framer Motion animation to complete.
        Checks that element opacity = 1 (fully visible).
        
        Args:
            driver: Selenium WebDriver
            locator: Tuple of (By.X, "selector")
            duration: Known animation duration (used as hint)
            timeout: Max wait time
        """
        # Simple approach: wait for known duration
        time.sleep(duration)
        
        # Then verify element is fully opaque
        wait = WebDriverWait(driver, timeout)
        wait.until(lambda d: NextJSWaits._element_fully_visible(d, locator))

    @staticmethod
    def wait_for_api_response(driver, response_indicator_locator, timeout=10):
        """
        Wait for API response to complete (loading spinner disappears).
        
        Args:
            driver: Selenium WebDriver
            response_indicator_locator: Locator for success/error message
            timeout: Wait timeout
        """
        wait = WebDriverWait(driver, timeout)
        # First wait for spinner to disappear
        wait.until(EC.invisibility_of_element_located(
            (By.CLASS_NAME, "loading-spinner")
        ))
        # Then wait for response message
        wait.until(EC.presence_of_element_located(response_indicator_locator))

    @staticmethod
    def wait_for_code_split_component(driver, component_locator, timeout=10):
        """
        Wait for code-split component to load (dynamic import).
        Used for components with ssr: false or lazy-loaded features.
        
        Args:
            driver: Selenium WebDriver
            component_locator: Tuple of (By.X, "selector")
            timeout: Wait timeout
        """
        wait = WebDriverWait(driver, timeout)
        # Wait for component to appear after code split loads
        return wait.until(EC.presence_of_element_located(component_locator))

    @staticmethod
    def wait_for_form_validation_error(driver, error_locator, timeout=5):
        """
        Wait for form validation error message to appear.
        Client-side validation should be instant.
        
        Args:
            driver: Selenium WebDriver
            error_locator: Tuple of (By.X, "selector")
            timeout: Wait timeout
        """
        wait = WebDriverWait(driver, timeout)
        return wait.until(EC.visibility_of_element_located(error_locator))

    @staticmethod
    def wait_for_form_submission_response(driver, response_message_locator, timeout=10):
        """
        Wait for form submission response.
        Handles loading state and API response.
        
        Args:
            driver: Selenium WebDriver
            response_message_locator: Locator for success/error message
            timeout: Wait timeout
        """
        wait = WebDriverWait(driver, timeout)
        # Wait for spinner to disappear
        try:
            wait.until(EC.invisibility_of_element_located(
                (By.CLASS_NAME, "loading-spinner")
            ))
        except:
            pass  # Spinner may not exist, proceed
        
        # Wait for response message
        return wait.until(EC.visibility_of_element_located(response_message_locator))

    @staticmethod
    def wait_for_scroll_reveal_animation(driver, locator, timeout=3):
        """
        Wait for ScrollReveal animation to trigger (on viewport entry).
        
        Args:
            driver: Selenium WebDriver
            locator: Tuple of (By.X, "selector")
            timeout: Wait timeout
        """
        # Scroll element into view
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located(locator)
        )
        driver.execute_script("arguments[0].scrollIntoView(true);", element)
        
        # Wait for reveal animation
        time.sleep(0.5)  # ScrollReveal trigger delay
        return element

    @staticmethod
    def wait_for_next_image_load(driver, image_locator, timeout=5):
        """
        Wait for Next.js Image component to load.
        Checks for naturalWidth > 0 (image actually loaded).
        
        Args:
            driver: Selenium WebDriver
            image_locator: Tuple of (By.X, "selector")
            timeout: Wait timeout
        """
        wait = WebDriverWait(driver, timeout)
        wait.until(lambda d: NextJSWaits._image_loaded(d, image_locator))

    @staticmethod
    def wait_for_page_transition_animation(driver, timeout=1):
        """
        Wait for Next.js page transition animation to complete.
        Default duration: 0.3-0.5s for fade+slide.
        
        Args:
            driver: Selenium WebDriver
            timeout: Max wait time
        """
        time.sleep(0.5)  # Known animation duration

    # ========================================================================
    # HELPER METHODS (Private)
    # ========================================================================

    @staticmethod
    def _element_fully_visible(driver, locator):
        """Check if element is fully visible (opacity = 1)."""
        try:
            element = driver.find_element(*locator)
            opacity = driver.execute_script(
                "return window.getComputedStyle(arguments[0]).opacity",
                element
            )
            return float(opacity) == 1.0
        except:
            return False

    @staticmethod
    def _image_loaded(driver, locator):
        """Check if image is loaded (naturalWidth > 0)."""
        try:
            img = driver.find_element(*locator)
            return driver.execute_script(
                "return arguments[0].complete && arguments[0].naturalHeight > 0",
                img
            )
        except:
            return False


# Import By for use in other modules
from selenium.webdriver.common.by import By


__all__ = ['NextJSWaits']
