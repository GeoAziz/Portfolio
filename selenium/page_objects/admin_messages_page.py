from selenium.webdriver.common.by import By
from page_objects.base_page import BasePage
import re


class AdminMessagesPage(BasePage):
    PAGE = (By.CSS_SELECTOR, "[data-testid='admin-messages-page']")
    TITLE = (By.CSS_SELECTOR, "[data-testid='admin-messages-title']")
    DESCRIPTION = (By.CSS_SELECTOR, "[data-testid='admin-messages-description']")
    LOADING = (By.CSS_SELECTOR, "[data-testid='admin-messages-loading']")
    RETRY_BUTTON = (By.CSS_SELECTOR, "[data-testid='admin-messages-retry-button']")

    TOTAL = (By.CSS_SELECTOR, "[data-testid='admin-messages-total']")
    UNREAD = (By.CSS_SELECTOR, "[data-testid='admin-messages-unread']")
    READ = (By.CSS_SELECTOR, "[data-testid='admin-messages-read']")
    EXPORT = (By.CSS_SELECTOR, "[data-testid='admin-messages-export']")

    LIST = (By.CSS_SELECTOR, "[data-testid='admin-messages-list']")
    EMPTY = (By.CSS_SELECTOR, "[data-testid='admin-messages-empty']")
    DETAIL = (By.CSS_SELECTOR, "[data-testid='admin-message-detail']")

    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout)

    def load(self):
        self.navigate_to("/admin/messages")
        self.wait_for_page_load()
        # Wait for the page container to be loaded with extended timeout
        try:
            self.wait_for_element(self.PAGE, timeout=15)
        except Exception:
            # If page container not found, wait for title directly
            self.wait_for_element(self.TITLE, timeout=15)

    def is_loaded(self):
        # Check both page container and title visible
        try:
            page_visible = self.is_element_displayed(self.PAGE)
            title_visible = self.is_element_displayed(self.TITLE)
            return page_visible and title_visible
        except Exception:
            return False

    def get_counts(self):
        total = 0
        unread = 0
        read = 0
        try:
            total_el = self.find_element(self.TOTAL, timeout=2)
            total = int(total_el.text.strip())
        except Exception:
            pass

        try:
            unread_el = self.find_element(self.UNREAD, timeout=2)
            unread = int(unread_el.text.strip())
        except Exception:
            pass

        try:
            read_el = self.find_element(self.READ, timeout=2)
            read = int(read_el.text.strip())
        except Exception:
            pass

        return {"total": total, "unread": unread, "read": read}

    def click_export(self):
        if self.is_element_displayed(self.EXPORT):
            self.click(self.EXPORT)

    def get_message_cards(self):
        try:
            container = self.find_element(self.LIST)
            cards = container.find_elements(By.CSS_SELECTOR, "[data-testid^='admin-message-']")
            return cards
        except Exception:
            return []

    def select_message(self, message_id):
        locator = (By.CSS_SELECTOR, f"[data-testid='admin-message-{message_id}']")
        self.click(locator)
        self.wait_for_element_visible(self.DETAIL)
