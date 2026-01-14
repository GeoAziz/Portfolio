from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from page_objects.base_page import BasePage


class SearchPage(BasePage):
    """Page object for the Search page."""

    # Locators
    SEARCH_INPUT = (By.CSS_SELECTOR, "[data-testid='search-input']")
    SEARCH_BUTTON = (By.CSS_SELECTOR, "[data-testid='search-button']")
    SUGGESTIONS = (By.CSS_SELECTOR, "[data-testid='search-suggestions']")
    ACTIVE_FILTERS = (By.CSS_SELECTOR, "[data-testid='search-active-filters']")
    ERROR = (By.CSS_SELECTOR, "[data-testid='search-error']")
    NO_RESULTS = (By.CSS_SELECTOR, "[data-testid='search-no-results']")
    RESULTS_COUNT = (By.CSS_SELECTOR, "[data-testid='search-results-count']")

    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout)

    # Navigation
    def load(self):
        self.navigate_to("/search")
        self.wait_for_page_load()

    # Interactions
    def enter_query(self, text):
        self.fill_text(self.SEARCH_INPUT, text)

    def submit_search(self):
        # Click button (preferred) to trigger search
        try:
            self.click(self.SEARCH_BUTTON)
        except Exception:
            # fallback: press enter on input
            self.press_enter_on_element(self.SEARCH_INPUT)

    def get_suggestions(self):
        try:
            container = self.find_element(self.SUGGESTIONS, timeout=2)
            buttons = container.find_elements(By.TAG_NAME, "button")
            return [b.text for b in buttons]
        except Exception:
            return []

    def click_suggestion(self, suggestion_text):
        locator = (By.CSS_SELECTOR, f"[data-testid='search-suggestion-{suggestion_text}']")
        try:
            self.click(locator)
        except Exception:
            raise

    def has_error(self):
        return self.is_element_displayed(self.ERROR)

    def has_no_results(self):
        return self.is_element_displayed(self.NO_RESULTS)

    def get_results_count(self):
        try:
            el = self.find_element(self.RESULTS_COUNT, timeout=2)
            text = el.text or ""
            # Expected format: Found N result(s)
            import re
            m = re.search(r"Found\s+(\d+)", text)
            if m:
                return int(m.group(1))
        except Exception:
            pass
        # fallback: count result cards
        items = self.driver.find_elements(By.CSS_SELECTOR, "[data-testid^='search-result-']")
        return len(items)

    def focus_input_and_tab(self):
        el = self.find_clickable_element(self.SEARCH_INPUT)
        el.click()
        # Press Tab to move focus to next focusable element (should be search button)
        self.actions.send_keys(Keys.TAB).perform()
        # Return current active element's data-testid (if present)
        return self.driver.execute_script("return document.activeElement.getAttribute('data-testid');")

    # Filters
    def toggle_type_filter(self, type_name):
        locator = (By.CSS_SELECTOR, f"[data-testid='search-filter-type-{type_name}']")
        self.click(locator)

    def toggle_tag_filter(self, tag_name):
        locator = (By.CSS_SELECTOR, f"[data-testid='search-filter-tag-{tag_name}']")
        self.click(locator)
