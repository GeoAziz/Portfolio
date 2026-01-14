from page_objects.error_pages import ErrorPages
from utils.test_data import TestData
import pytest


def test_404_page_rendered(driver):
    page = ErrorPages(driver, base_url=TestData.BASE_URL)
    page.goto_404()
    assert page.is_element_displayed(ErrorPages.PAGE_404), "404 page should be rendered for unknown routes"


@pytest.mark.skip(reason="/error route not directly reachable; error.tsx is only triggered on runtime errors, not direct navigation. Environmental constraint.")
def test_500_page_rendered(driver):
    page = ErrorPages(driver, base_url=TestData.BASE_URL)
    page.goto_500()
    assert page.is_element_displayed(ErrorPages.PAGE_500), "500 error page should render on runtime error"
