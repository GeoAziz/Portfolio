"""
Page Objects Package

All page object models for the portfolio application.
Import from here for clean test code.

Usage:
    from page_objects import HomePage, BlogPage, ContactPage
    
    home = HomePage(driver)
    home.click_explore_button()
"""

from .base_page import BasePage
from .home_page import HomePage

__all__ = [
    'BasePage',
    'HomePage',
    # More pages will be added as they're implemented
]
