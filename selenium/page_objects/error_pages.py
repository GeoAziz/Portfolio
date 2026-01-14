from selenium.webdriver.common.by import By
from page_objects.base_page import BasePage


class ErrorPages(BasePage):
    PAGE_404 = (By.CSS_SELECTOR, "[data-testid='404-page']")
    PAGE_500 = (By.CSS_SELECTOR, "[data-testid='500-page']")

    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout)

    def goto_404(self):
        self.navigate_to('/this-page-does-not-exist-xyz')
        self.wait_for_page_load()

    def goto_500(self):
        self.navigate_to('/error')
        self.wait_for_page_load()
