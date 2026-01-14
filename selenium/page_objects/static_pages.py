from selenium.webdriver.common.by import By
from page_objects.base_page import BasePage


class StaticPage(BasePage):
    """Shared page object for static/informational pages (AI, Hardware, Research, Newsletter, etc.)."""

    def __init__(self, driver, base_url=None, timeout=15, page_testid=None):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout)
        self.page_testid = page_testid  # e.g., "ai-page", "hardware-page"

    def load(self, path):
        self.navigate_to(path)
        self.wait_for_page_load()

    def is_loaded(self):
        if not self.page_testid:
            return True
        locator = (By.CSS_SELECTOR, f"[data-testid='{self.page_testid}']")
        return self.is_element_displayed(locator)

    def get_page_title(self):
        """Get page title (h1 or first heading)."""
        try:
            title = self.find_element((By.TAG_NAME, "h1"))
            return title.text
        except Exception:
            return None

    def get_page_description(self):
        """Get page description (first p with text-muted-foreground or similar)."""
        try:
            desc = self.find_element((By.CSS_SELECTOR, "p[class*='muted']"), timeout=2)
            return desc.text
        except Exception:
            return None


class AIPage(StaticPage):
    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout, page_testid="ai-page")

    def load(self):
        super().load("/ai")


class HardwarePage(StaticPage):
    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout, page_testid="hardware-page")

    def load(self):
        super().load("/hardware")


class ResearchPage(StaticPage):
    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout, page_testid="research-page")

    def load(self):
        super().load("/research")


class NewsletterPage(StaticPage):
    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout, page_testid="newsletter-page")

    def load(self):
        super().load("/newsletter")


class Models3DPage(StaticPage):
    def __init__(self, driver, base_url=None, timeout=20):
        # 3D models page needs extended timeout due to dynamic content
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout, page_testid="3d-models-page")

    def load(self, path=None):
        self.navigate_to("/3d-models")
        self.wait_for_page_load()
        # Extended wait for 3D model hydration
        try:
            self.wait_for_element(self.page_testid_locator(), timeout=20)
        except Exception:
            # If exact testid not found, wait for title as fallback
            pass

    def page_testid_locator(self):
        """Helper to get page testid locator."""
        return (By.CSS_SELECTOR, f"[data-testid='{self.page_testid}']")

    def is_loaded(self):
        """Override with more resilient checking for 3D page."""
        try:
            # Try to find the page container
            return self.is_element_displayed(self.page_testid_locator())
        except Exception:
            # Fallback: check if any models grid exists
            try:
                return self.get_models_grid()
            except Exception:
                return False

    def get_models_grid(self):
        """Get the main models grid."""
        locator = (By.CSS_SELECTOR, "[data-testid='models-grid']")
        return self.is_element_displayed(locator)

    def get_featured_models_grid(self):
        """Get the featured models grid."""
        locator = (By.CSS_SELECTOR, "[data-testid='featured-models-grid']")
        return self.is_element_displayed(locator)

    def get_controls_guide(self):
        """Get the controls guide grid."""
        locator = (By.CSS_SELECTOR, "[data-testid='controls-guide-grid']")
        return self.is_element_displayed(locator)


class SystemsPage(StaticPage):
    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout, page_testid="systems-page")

    def load(self, path=None):
        super().load("/systems")

    def get_header(self):
        """Get systems header section."""
        locator = (By.CSS_SELECTOR, "[data-testid='systems-header']")
        return self.is_element_displayed(locator)

    def get_architecture_diagram(self):
        """Get architecture diagram."""
        locator = (By.CSS_SELECTOR, "[data-testid='architecture-diagram']")
        return self.is_element_displayed(locator)

    def get_tech_stack_grid(self):
        """Get tech stack grid."""
        locator = (By.CSS_SELECTOR, "[data-testid='tech-stack-grid']")
        return self.is_element_displayed(locator)

    def get_capabilities_grid(self):
        """Get capabilities grid."""
        locator = (By.CSS_SELECTOR, "[data-testid='capabilities-grid']")
        return self.is_element_displayed(locator)

    def get_philosophy_grid(self):
        """Get philosophy grid."""
        locator = (By.CSS_SELECTOR, "[data-testid='philosophy-grid']")
        return self.is_element_displayed(locator)


class SplashPage(StaticPage):
    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout, page_testid="splash-page")

    def load(self, path=None):
        super().load("/splash")

    def get_splash_content(self):
        """Get splash content area."""
        locator = (By.CSS_SELECTOR, "[data-testid='splash-content']")
        return self.is_element_displayed(locator)

    def get_splash_title(self):
        """Get splash title."""
        locator = (By.CSS_SELECTOR, "[data-testid='splash-title']")
        title = self.find_element(locator)
        return title.text if title else None

    def click_enter_button(self):
        """Click the 'Enter Universe' button."""
        locator = (By.CSS_SELECTOR, "[data-testid='splash-enter-button']")
        button = self.find_element(locator)
        button.click()
        self.wait_for_page_load()

    def has_redirect_message(self):
        """Check if redirect message is visible."""
        locator = (By.CSS_SELECTOR, "[data-testid='splash-redirect-message']")
        return self.is_element_displayed(locator)
