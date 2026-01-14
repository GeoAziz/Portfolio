#!/usr/bin/env python3
"""Selenium script to inspect header on wide screen"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import time

# Setup Chrome options
chrome_options = Options()
chrome_options.add_argument("--window-size=1920,1080")  # Wide screen
chrome_options.add_argument("--disable-blink-features=AutomationControlled")

# Create driver
driver = webdriver.Chrome(options=chrome_options)

try:
    # Navigate to the app
    driver.get("http://localhost:9002")
    
    # Wait for page to load
    wait = WebDriverWait(driver, 10)
    header = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "header[data-testid='navigation-header']")))
    
    time.sleep(2)  # Give it time to render
    
    print("=" * 80)
    print("HEADER INSPECTION ON WIDE SCREEN (1920x1080)")
    print("=" * 80)
    
    # Get header element
    header_element = driver.find_element(By.CSS_SELECTOR, "header[data-testid='navigation-header']")
    print(f"\nHeader HTML:\n{header_element.get_attribute('outerHTML')[:2000]}")
    
    # Check visible elements in header
    print("\n" + "=" * 80)
    print("VISIBLE ELEMENTS IN HEADER:")
    print("=" * 80)
    
    # Check logo
    try:
        logo = header_element.find_element(By.CSS_SELECTOR, "[data-testid='home-logo-link']")
        print(f"✓ Logo: VISIBLE")
        print(f"  Display: {logo.value_of_css_property('display')}")
    except:
        print(f"✗ Logo: NOT FOUND")
    
    # Check desktop navigation
    try:
        desktop_nav = header_element.find_element(By.CSS_SELECTOR, "[data-testid='desktop-navigation']")
        display = desktop_nav.value_of_css_property('display')
        visibility = desktop_nav.value_of_css_property('visibility')
        is_displayed = desktop_nav.is_displayed()
        print(f"✓ Desktop Navigation: display={display}, visibility={visibility}, is_displayed={is_displayed}")
        
        # Check nav links
        links = desktop_nav.find_elements(By.TAG_NAME, "a")
        print(f"  Number of nav links: {len(links)}")
        for link in links:
            print(f"    - {link.text}: {link.value_of_css_property('display')}")
    except Exception as e:
        print(f"✗ Desktop Navigation: ERROR - {str(e)}")
    
    # Check search button
    try:
        search = header_element.find_element(By.CSS_SELECTOR, "[data-testid='search-button']")
        display = search.value_of_css_property('display')
        is_displayed = search.is_displayed()
        print(f"✓ Search Button: display={display}, is_displayed={is_displayed}")
    except:
        print(f"✗ Search Button: NOT FOUND")
    
    # Check theme toggle
    try:
        theme_toggle = header_element.find_element(By.CSS_SELECTOR, "[data-testid='theme-toggle']")
        display = theme_toggle.value_of_css_property('display')
        is_displayed = theme_toggle.is_displayed()
        print(f"✓ Theme Toggle: display={display}, is_displayed={is_displayed}")
    except:
        print(f"✗ Theme Toggle: NOT FOUND")
    
    # Check language switcher
    try:
        lang_switch = header_element.find_element(By.CSS_SELECTOR, "[data-testid='language-switcher']")
        display = lang_switch.value_of_css_property('display')
        is_displayed = lang_switch.is_displayed()
        print(f"✓ Language Switcher: display={display}, is_displayed={is_displayed}")
    except:
        print(f"✗ Language Switcher: NOT FOUND")
    
    # Check mobile menu trigger
    try:
        mobile_menu = header_element.find_element(By.CSS_SELECTOR, "[data-testid='mobile-menu-trigger']")
        display = mobile_menu.value_of_css_property('display')
        visibility = mobile_menu.value_of_css_property('visibility')
        is_displayed = mobile_menu.is_displayed()
        print(f"✓ Mobile Menu Trigger (Hamburger): display={display}, visibility={visibility}, is_displayed={is_displayed}")
        if is_displayed:
            print("  ⚠️  HAMBURGER IS STILL VISIBLE ON WIDE SCREEN - THIS IS THE BUG!")
    except:
        print(f"✗ Mobile Menu Trigger: NOT FOUND")
    
    print("\n" + "=" * 80)
    print("SCREENSHOT ANALYSIS:")
    print("=" * 80)
    
    # Take screenshot
    driver.save_screenshot("/tmp/header_wide_screen.png")
    print("Screenshot saved to /tmp/header_wide_screen.png")
    
    # Get body width to confirm wide screen
    body_width = driver.execute_script("return window.innerWidth")
    print(f"Actual window width: {body_width}px")
    
finally:
    driver.quit()
    print("\n✓ Selenium session closed")
