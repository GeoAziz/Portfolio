"""
Centralized Test Data Management

Stores test data, fixtures, and constants used across all tests.
Single source of truth for test inputs.
"""

import os
from typing import Dict, List, Any


class TestData:
    """Test data constants and fixtures."""

    # ========================================================================
    # BASE URLS
    # ========================================================================
    
    BASE_URL = os.getenv("BASE_URL", "http://localhost:9002")
    
    # ========================================================================
    # BROWSER SETTINGS
    # ========================================================================
    
    HEADLESS = os.getenv("HEADLESS", "False").lower() == "true"
    BROWSER = os.getenv("BROWSER", "chrome")
    IMPLICIT_WAIT = int(os.getenv("IMPLICIT_WAIT", "10"))
    EXPLICIT_WAIT = int(os.getenv("EXPLICIT_WAIT", "15"))
    BROWSER_WIDTH = int(os.getenv("BROWSER_WIDTH", "1024"))
    BROWSER_HEIGHT = int(os.getenv("BROWSER_HEIGHT", "768"))

    # ========================================================================
    # VIEWPORT SIZES
    # ========================================================================
    
    VIEWPORT_MOBILE = {"width": 375, "height": 667}
    VIEWPORT_TABLET = {"width": 768, "height": 1024}
    VIEWPORT_DESKTOP = {"width": 1024, "height": 768}
    VIEWPORT_WIDE = {"width": 1280, "height": 720}

    # ========================================================================
    # ANIMATION DURATIONS (milliseconds)
    # ========================================================================
    
    FRAMER_MOTION_DEFAULT = 0.8  # seconds
    CSS_ANIMATION_DEFAULT = 0.5
    PAGE_TRANSITION = 0.3
    ACCORDION_ANIMATION = 0.3
    HOVER_ANIMATION = 0.2

    # ========================================================================
    # CONTACT FORM TEST DATA
    # ========================================================================
    
    CONTACT_FORM_VALID = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "subject": "Test Message",
        "message": "This is a test message from the E2E test suite."
    }

    CONTACT_FORM_INVALID_EMAIL = {
        "name": "Jane Doe",
        "email": "not-an-email",
        "subject": "Test",
        "message": "Message"
    }

    CONTACT_FORM_MISSING_FIELDS = {
        "name": "",
        "email": "",
        "subject": "",
        "message": ""
    }

    # ========================================================================
    # FORM VALIDATION EDGE CASES
    # ========================================================================
    
    FORM_EDGE_CASES = {
        "long_text": "A" * 1000,
        "special_chars": "Test @#$%^&*() Message",
        "unicode": "Test メッセージ 🎉",
        "sql_injection": "'; DROP TABLE--",
        "html_injection": "<script>alert('xss')</script>",
        "whitespace_only": "   ",
        "single_char": "A",
    }

    # ========================================================================
    # LOGIN/AUTH TEST DATA
    # ========================================================================
    
    LOGIN_VALID = {
        "email": "test@example.com",
        "password": "Test@Password123"
    }

    LOGIN_INVALID_PASSWORD = {
        "email": "test@example.com",
        "password": "WrongPassword"
    }

    # ========================================================================
    # SEARCH TEST DATA
    # ========================================================================
    
    SEARCH_QUERIES = {
        "blog": ["blog", "post", "article"],
        "project": ["project", "work", "portfolio"],
        "technical": ["python", "javascript", "react"],
        "nonexistent": ["xyzabc", "nosuchpage", "invalid_query_12345"]
    }

    # ========================================================================
    # EXPECTED TEXT CONTENT
    # ========================================================================
    
    HOME_PAGE_TEXTS = {
        "hero_title": "Engineer Dev Mahn X",
        "explore_button": "Explore the Work",
        "contact_button": "Contact / Collaborate",
    }

    BLOG_PAGE_TEXTS = {
        "page_title": "Systems Journal",
        "page_description": "Thoughts on systems"  # partial match
    }

    # ========================================================================
    # PAGE PATHS
    # ========================================================================
    
    PAGES = {
        "home": "/",
        "blog": "/blog",
        "projects": "/projects",
        "resume": "/resume",
        "contact": "/contact",
        "ai": "/ai",
        "chat": "/ai/chat",
        "research": "/research",
        "open_source": "/open-source",
        "hardware": "/hardware",
        "case_studies": "/case-studies",
        "3d_models": "/3d-models",
        "newsletter": "/newsletter",
        "search": "/search",
    }

    # ========================================================================
    # SELECTORS (Centralized for easy updates)
    # ========================================================================
    
    # Data-testid attributes (preferred)
    SELECTORS = {
        "explore_button": "[data-testid='explore-work-button']",
        "contact_button": "[data-testid='contact-button']",
        "submit_button": "[data-testid='submit-button']",
        "loading_spinner": "[data-testid='loading-spinner']",
        "success_message": "[data-testid='success-message']",
        "error_message": "[data-testid='error-message']",
    }

    # ========================================================================
    # EXPECTED COUNTS
    # ========================================================================
    
    EXPECTED_COUNTS = {
        "skill_orbit_nodes": 6,  # Minimum
        "featured_projects": 3,  # Minimum
        "philosophy_items": 3,  # Minimum
        "blog_posts": 5,  # Minimum
    }

    # ========================================================================
    # TIMEOUTS (in seconds)
    # ========================================================================
    
    TIMEOUTS = {
        "page_load": 10,
        "element_presence": 5,
        "element_clickable": 5,
        "animation": 2,
        "api_response": 10,
        "form_submission": 15,
        "navigation": 5,
    }

    # ========================================================================
    # ERROR MESSAGES
    # ========================================================================
    
    ERROR_MESSAGES = {
        "email_required": "Email is required",
        "email_invalid": "Invalid email",
        "name_required": "Name is required",
        "message_required": "Message is required",
        "password_required": "Password is required",
        "username_taken": "Username already taken",
    }

    # ========================================================================
    # SUCCESS MESSAGES
    # ========================================================================
    
    SUCCESS_MESSAGES = {
        "form_sent": "Message sent successfully",
        "newsletter_subscribed": "Successfully subscribed",
        "profile_updated": "Profile updated",
        "login_success": "Successfully logged in",
    }

    # ========================================================================
    # PERFORMANCE BENCHMARKS
    # ========================================================================
    
    PERFORMANCE_BENCHMARKS = {
        "page_load_time": 3.0,  # seconds
        "first_paint": 1.5,
        "first_contentful_paint": 2.0,
        "largest_contentful_paint": 3.0,
        "first_input_delay": 0.1,
        "cumulative_layout_shift": 0.1,
    }

    # ========================================================================
    # RESPONSIVE BREAKPOINTS
    # ========================================================================
    
    BREAKPOINTS = {
        "mobile_small": 320,
        "mobile": 375,
        "mobile_large": 425,
        "tablet": 768,
        "laptop": 1024,
        "desktop": 1280,
        "large_desktop": 1920,
    }

    @classmethod
    def get_page_url(cls, page_name: str) -> str:
        """Get full URL for a page."""
        return f"{cls.BASE_URL}{cls.PAGES.get(page_name, '/')}"

    @classmethod
    def get_viewport(cls, size: str) -> Dict[str, int]:
        """Get viewport dimensions by size name."""
        viewports = {
            "mobile": cls.VIEWPORT_MOBILE,
            "tablet": cls.VIEWPORT_TABLET,
            "desktop": cls.VIEWPORT_DESKTOP,
            "wide": cls.VIEWPORT_WIDE,
        }
        return viewports.get(size, cls.VIEWPORT_DESKTOP)

    @classmethod
    def print_config(cls):
        """Print test configuration (for debugging)."""
        print("\n" + "="*80)
        print("TEST CONFIGURATION")
        print("="*80)
        print(f"Base URL: {cls.BASE_URL}")
        print(f"Browser: {cls.BROWSER}")
        print(f"Headless: {cls.HEADLESS}")
        print(f"Implicit Wait: {cls.IMPLICIT_WAIT}s")
        print(f"Explicit Wait: {cls.EXPLICIT_WAIT}s")
        print(f"Viewport: {cls.BROWSER_WIDTH}x{cls.BROWSER_HEIGHT}")
        print("="*80 + "\n")


__all__ = ['TestData']
