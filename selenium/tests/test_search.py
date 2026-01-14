import random
import string
import time

from selenium.webdriver.common.by import By
from page_objects.search_page import SearchPage
from utils.test_data import TestData


def rand_str(length=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))


def test_search_page_loads(driver):
    page = SearchPage(driver, base_url=TestData.BASE_URL)
    page.load()

    # Core visibility checks
    assert page.is_element_displayed(SearchPage.SEARCH_INPUT), "Search input should be visible"
    # Title on parent page
    assert page.is_element_displayed((By.CSS_SELECTOR, "[data-testid='search-title']")), "Search title missing"


def test_search_interaction_and_accessibility(driver):
    page = SearchPage(driver, base_url=TestData.BASE_URL)
    page.load()

    # Representative interaction: type a random query and search
    q = "noresults-" + rand_str(6)
    page.enter_query(q)
    # give suggestions a moment to appear if backend replies
    time.sleep(0.5)

    # Accessibility sanity: focus + tab should move focus (returns data-testid of active element)
    active = page.focus_input_and_tab()
    assert active is not None, "Tab did not move focus to a focusable element"

    # Submit search and verify system responded (either results, no-results, or error)
    page.submit_search()
    time.sleep(0.5)

    has_results = page.get_results_count() > 0
    has_no_results = page.has_no_results()
    has_error = page.has_error()

    assert any([has_results, has_no_results, has_error]), "Search did not return results, no-results, or error state"
