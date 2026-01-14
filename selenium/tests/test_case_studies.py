import time
from selenium.webdriver.common.by import By
from page_objects.case_studies_page import CaseStudiesPage, CaseStudyDetailPage
from utils.test_data import TestData


def test_case_studies_list_and_navigate(driver):
    page = CaseStudiesPage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.3)

    cards = page.get_case_cards()
    if not cards:
        assert page.is_element_displayed(CaseStudiesPage.DESCRIPTION)
        return

    first = cards[0]
    link = first.find_element(By.TAG_NAME, 'a')
    link.click()
    time.sleep(0.6)

    detail = CaseStudyDetailPage(driver, base_url=TestData.BASE_URL)
    assert detail.is_loaded(), "Case study detail did not load problem section"

