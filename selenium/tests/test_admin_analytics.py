import time
from page_objects.admin_analytics_page import AdminAnalyticsPage
from utils.test_data import TestData


def test_admin_analytics_page_loads(driver):
    page = AdminAnalyticsPage(driver, base_url=TestData.BASE_URL)
    page.load()

    # Page shell should be present (auth mode or main component)
    assert page.is_element_displayed(AdminAnalyticsPage.TITLE) or page.is_element_displayed(AdminAnalyticsPage.AUTH_INPUT)


def test_admin_analytics_tab_navigation(driver):
    page = AdminAnalyticsPage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.3)

    # If auth input present, set a dummy token (doesn't need to fully authenticate for our shallow checks)
    try:
        if page.is_element_displayed(AdminAnalyticsPage.AUTH_INPUT):
            page.authenticate('dummy-token')
    except Exception:
        pass

    # Open export tab (representative interaction)
    page.open_export_tab()
    time.sleep(0.2)
    # Try to click export action if present (this is a non-destructive representative action)
    try:
        page.trigger_export()
    except Exception:
        # backend may block export; that's acceptable for this smoke-level test
        pass

    # Open delete tab and ensure controls are present
    page.open_delete_tab()
    time.sleep(0.2)
    assert page.is_element_displayed(AdminAnalyticsPage.DELETE_CONFIRM) or page.is_element_displayed(AdminAnalyticsPage.DELETE_ACTION)
