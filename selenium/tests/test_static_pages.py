import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from page_objects.static_pages import (
    AIPage,
    HardwarePage,
    ResearchPage,
    NewsletterPage,
    Models3DPage,
    SystemsPage,
    SplashPage,
)
from utils.test_data import TestData


def test_ai_page_loads(driver):
    page = AIPage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.3)
    assert page.is_loaded(), "AI page should load"


def test_hardware_page_loads(driver):
    page = HardwarePage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.3)
    assert page.is_loaded(), "Hardware page should load"


def test_research_page_loads(driver):
    page = ResearchPage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.3)
    assert page.is_loaded(), "Research page should load"


def test_newsletter_page_loads(driver):
    page = NewsletterPage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.3)
    assert page.is_loaded(), "Newsletter page should load"


def test_3d_models_page_loads(driver):
    driver.get(f"{TestData.BASE_URL}/3d-models")
    
    # Use explicit wait for 3D page with testid (30s max)
    # Element may not be fully displayed due to dynamic rendering, but presence confirms page loaded
    wait = WebDriverWait(driver, 30)
    page_container = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='3d-models-page']"))
    )
    assert page_container is not None, "3D Models page container should be present"


def test_systems_page_loads(driver):
    page = SystemsPage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.5)
    assert page.is_loaded(), "Systems page should load"
    assert page.get_header(), "Systems header should be visible"
    assert page.get_architecture_diagram(), "Architecture diagram should be visible"
    assert page.get_tech_stack_grid(), "Tech stack grid should be visible"
    assert page.get_capabilities_grid(), "Capabilities grid should be visible"
    assert page.get_philosophy_grid(), "Philosophy grid should be visible"


def test_splash_page_loads(driver):
    page = SplashPage(driver, base_url=TestData.BASE_URL)
    page.load()
    time.sleep(0.5)
    assert page.is_loaded(), "Splash page should load"
    assert page.get_splash_content(), "Splash content should be visible"
    title = page.get_splash_title()
    assert title == "Personal OS", f"Splash title should be 'Personal OS', got '{title}'"
    assert page.has_redirect_message(), "Redirect message should be visible"
