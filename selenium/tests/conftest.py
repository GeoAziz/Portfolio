"""
Pytest Configuration & Fixtures

Handles:
- WebDriver setup/teardown
- Test configuration from .env
- Fixtures for common test scenarios
- Logging and reporting
"""

import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from dotenv import load_dotenv
from datetime import datetime
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.test_data import TestData

# Load environment variables from .env file
load_dotenv()


# ============================================================================
# PYTEST HOOKS & CONFIGURATION
# ============================================================================

def pytest_configure(config):
    """Configure pytest."""
    config.addinivalue_line(
        "markers", "smoke: mark test as smoke test (P0 - critical path)"
    )
    config.addinivalue_line(
        "markers", "critical: mark test as critical path (P1)"
    )
    config.addinivalue_line(
        "markers", "feature: mark test as feature test (P2)"
    )
    config.addinivalue_line(
        "markers", "edge_case: mark test as edge case (P3)"
    )


def pytest_collection_modifyitems(config, items):
    """Modify test collection (add markers if not set)."""
    for item in items:
        # Add default marker if none specified
        if not any(item.iter_markers()):
            item.add_marker(pytest.mark.feature)


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """Hook to capture screenshots on failure."""
    outcome = yield
    rep = outcome.get_result()
    
    # Take screenshot on failure
    if rep.failed and call.when == "call":
        driver = item.funcargs.get('driver')
        if driver:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            test_name = item.name
            filename = f"screenshots/{test_name}_{timestamp}_FAILED.png"
            
            # Create screenshots directory
            os.makedirs("screenshots", exist_ok=True)
            
            try:
                driver.save_screenshot(filename)
                print(f"\n📸 Screenshot saved: {filename}")
            except:
                print(f"\n⚠️ Failed to save screenshot")


# ============================================================================
# FIXTURES - DRIVER SETUP/TEARDOWN
# ============================================================================

@pytest.fixture(scope="function")
def chrome_driver():
    """Create Chrome WebDriver instance."""
    options = ChromeOptions()
    
    # Headless mode (from .env or default False)
    if TestData.HEADLESS:
        options.add_argument("--headless")
    
    # Common arguments
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    
    # Logging
    options.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    
    # Create service
    service = ChromeService(ChromeDriverManager().install())
    
    # Create driver
    driver = webdriver.Chrome(service=service, options=options)
    
    # Set timeouts
    driver.implicitly_wait(TestData.IMPLICIT_WAIT)
    
    # Set window size
    driver.set_window_size(TestData.BROWSER_WIDTH, TestData.BROWSER_HEIGHT)
    
    print(f"\n✅ Chrome driver initialized")
    print(f"   Base URL: {TestData.BASE_URL}")
    print(f"   Viewport: {TestData.BROWSER_WIDTH}x{TestData.BROWSER_HEIGHT}")
    print(f"   Headless: {TestData.HEADLESS}")
    
    yield driver
    
    # Cleanup
    print(f"\n🧹 Closing Chrome driver")
    driver.quit()


@pytest.fixture(scope="function")
def firefox_driver():
    """Create Firefox WebDriver instance."""
    options = FirefoxOptions()
    
    # Headless mode
    if TestData.HEADLESS:
        options.add_argument("--headless")
    
    # Common arguments
    options.add_argument("--width=" + str(TestData.BROWSER_WIDTH))
    options.add_argument("--height=" + str(TestData.BROWSER_HEIGHT))
    
    # Create service
    service = FirefoxService(GeckoDriverManager().install())
    
    # Create driver
    driver = webdriver.Firefox(service=service, options=options)
    
    # Set timeouts
    driver.implicitly_wait(TestData.IMPLICIT_WAIT)
    
    print(f"\n✅ Firefox driver initialized")
    
    yield driver
    
    print(f"\n🧹 Closing Firefox driver")
    driver.quit()


@pytest.fixture(scope="function")
def driver(request):
    """
    Primary driver fixture.
    Uses browser specified in .env (default: chrome).
    """
    browser = TestData.BROWSER.lower()
    
    if browser == "firefox":
        return request.getfixturevalue("firefox_driver")
    else:  # Default to Chrome
        return request.getfixturevalue("chrome_driver")


# ============================================================================
# FIXTURES - PAGE OBJECTS
# ============================================================================

@pytest.fixture
def home_page(driver):
    """Provide HomePage instance."""
    from page_objects.home_page import HomePage
    return HomePage(driver, base_url=TestData.BASE_URL)


@pytest.fixture
def blog_page(driver):
    """Provide BlogPage instance (when created)."""
    # from page_objects.blog_page import BlogPage
    # return BlogPage(driver, base_url=TestData.BASE_URL)
    pass


@pytest.fixture
def projects_page(driver):
    """Provide ProjectsPage instance (when created)."""
    # from page_objects.projects_page import ProjectsPage
    # return ProjectsPage(driver, base_url=TestData.BASE_URL)
    pass


@pytest.fixture
def contact_page(driver):
    """Provide ContactPage instance (when created)."""
    # from page_objects.contact_page import ContactPage
    # return ContactPage(driver, base_url=TestData.BASE_URL)
    pass


# ============================================================================
# FIXTURES - TEST DATA
# ============================================================================

@pytest.fixture
def valid_contact_form_data():
    """Provide valid contact form data."""
    return TestData.CONTACT_FORM_VALID


@pytest.fixture
def invalid_contact_form_data():
    """Provide invalid contact form data."""
    return TestData.CONTACT_FORM_INVALID_EMAIL


@pytest.fixture
def viewport_sizes():
    """Provide all viewport sizes for responsive testing."""
    return {
        "mobile": TestData.VIEWPORT_MOBILE,
        "tablet": TestData.VIEWPORT_TABLET,
        "desktop": TestData.VIEWPORT_DESKTOP,
        "wide": TestData.VIEWPORT_WIDE,
    }


# ============================================================================
# FIXTURES - CONFIGURATION
# ============================================================================

@pytest.fixture(scope="session", autouse=True)
def print_test_config():
    """Print test configuration at session start."""
    TestData.print_config()


@pytest.fixture(autouse=True)
def test_logger(request):
    """Log test start/end for debugging."""
    print(f"\n{'='*80}")
    print(f"▶️  TEST: {request.node.name}")
    print(f"{'='*80}")
    
    yield
    
    print(f"\n{'='*80}")
    print(f"✅ TEST COMPLETE: {request.node.name}")
    print(f"{'='*80}\n")


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

@pytest.fixture
def navigate_to_home(driver):
    """Navigate to home page."""
    def _navigate():
        driver.get(TestData.BASE_URL)
        return driver
    return _navigate


@pytest.fixture
def screenshot_on_failure(driver):
    """Take screenshot on test failure."""
    def _screenshot(name="failure"):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        os.makedirs("screenshots", exist_ok=True)
        filename = f"screenshots/{name}_{timestamp}.png"
        driver.save_screenshot(filename)
        print(f"📸 Screenshot: {filename}")
    return _screenshot


@pytest.fixture
def wait_for_element(driver):
    """Helper to wait for element."""
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    def _wait(locator, timeout=10):
        wait = WebDriverWait(driver, timeout)
        return wait.until(EC.presence_of_element_located(locator))
    return _wait


@pytest.fixture
def assert_text_in_element(driver):
    """Helper to assert text in element."""
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    
    def _assert(locator, text, timeout=5):
        wait = WebDriverWait(driver, timeout)
        wait.until(EC.text_to_be_present_in_element(locator, text))
    return _assert


# ============================================================================
# COMMAND LINE OPTIONS
# ============================================================================

def pytest_addoption(parser):
    """Add custom command line options."""
    parser.addoption(
        "--headless",
        action="store_true",
        default=False,
        help="Run tests in headless mode"
    )
    parser.addoption(
        "--browser",
        action="store",
        default="chrome",
        help="Browser to use (chrome, firefox, edge)"
    )
    parser.addoption(
        "--base-url",
        action="store",
        default="http://localhost:9002",
        help="Base URL for tests"
    )


def pytest_configure(config):
    """Configure pytest with command line options."""
    if config.getoption("--headless"):
        TestData.HEADLESS = True
    if config.getoption("--browser"):
        TestData.BROWSER = config.getoption("--browser")
    if config.getoption("--base-url"):
        TestData.BASE_URL = config.getoption("--base-url")
