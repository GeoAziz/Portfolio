from selenium.webdriver.common.by import By
from page_objects.base_page import BasePage


class CaseStudiesPage(BasePage):
    PAGE = (By.CSS_SELECTOR, "[data-testid='case-studies-page']")
    GRID = (By.CSS_SELECTOR, "[data-testid='case-studies-grid']")
    DESCRIPTION = (By.CSS_SELECTOR, "[data-testid='case-studies-description']")

    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout)

    def load(self):
        self.navigate_to("/case-studies")
        self.wait_for_page_load()

    def get_case_cards(self):
        try:
            container = self.find_element(self.GRID)
            return container.find_elements(By.CSS_SELECTOR, "[data-testid^='case-study-']")
        except Exception:
            return []


class CaseStudyDetailPage(BasePage):
    PAGE = (By.CSS_SELECTOR, "[data-testid='case-study-detail-page']")
    PROBLEM = (By.CSS_SELECTOR, "[data-testid='case-study-problem']")
    SOLUTION = (By.CSS_SELECTOR, "[data-testid='case-study-solution']")
    CHALLENGES = (By.CSS_SELECTOR, "[data-testid='case-study-challenges']")
    RESULTS = (By.CSS_SELECTOR, "[data-testid='case-study-results']")
    LESSONS = (By.CSS_SELECTOR, "[data-testid='case-study-lessons']")

    def __init__(self, driver, base_url=None, timeout=15):
        super().__init__(driver, base_url=base_url or self.base_url, timeout=timeout)

    def is_loaded(self):
        return self.is_element_displayed(self.PROBLEM)
