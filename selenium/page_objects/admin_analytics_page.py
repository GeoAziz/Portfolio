from selenium.webdriver.common.by import By
from page_objects.base_page import BasePage


class AdminAnalyticsPage(BasePage):
    PAGE = (By.CSS_SELECTOR, "[data-testid='admin-analytics-page']")
    TITLE = (By.CSS_SELECTOR, "[data-testid='admin-analytics-title']")
    DESCRIPTION = (By.CSS_SELECTOR, "[data-testid='admin-analytics-description']")
    AUTH_INPUT = (By.CSS_SELECTOR, "[data-testid='admin-analytics-auth-input']")
    MESSAGE = (By.CSS_SELECTOR, "[data-testid='admin-analytics-message']")

    TAB_STATS = (By.CSS_SELECTOR, "[data-testid='admin-analytics-tab-stats']")
    TAB_EXPORT = (By.CSS_SELECTOR, "[data-testid='admin-analytics-tab-export']")
    TAB_DELETE = (By.CSS_SELECTOR, "[data-testid='admin-analytics-tab-delete']")

    EXPORT_ACTION = (By.CSS_SELECTOR, "[data-testid='admin-analytics-export-action']")
    DELETE_CONFIRM = (By.CSS_SELECTOR, "[data-testid='admin-analytics-delete-confirm']")
    DELETE_ACTION = (By.CSS_SELECTOR, "[data-testid='admin-analytics-delete-action']")

    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout)

    def load(self):
        self.navigate_to("/admin/analytics")
        self.wait_for_page_load()

    def authenticate(self, token: str):
        try:
            self.fill_text(self.AUTH_INPUT, token)
            # authentication triggers loadStats
            self.wait_for_page_load()
        except Exception:
            pass

    def open_export_tab(self):
        self.click(self.TAB_EXPORT)

    def trigger_export(self):
        if self.is_element_displayed(self.EXPORT_ACTION):
            self.click(self.EXPORT_ACTION)

    def open_delete_tab(self):
        self.click(self.TAB_DELETE)

    def set_delete_confirm(self, value: bool):
        el = self.find_element(self.DELETE_CONFIRM)
        # toggle if state does not match
        checked = el.is_selected()
        if checked != value:
            el.click()

    def trigger_delete(self):
        if self.is_element_displayed(self.DELETE_ACTION):
            self.click(self.DELETE_ACTION)

    def has_message(self):
        return self.is_element_displayed(self.MESSAGE)
