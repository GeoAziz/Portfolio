"""
Home Page Object Model

Maps all locators and interactions for the home page (/).
Inherits from BasePage for common functionality.

Usage:
    home_page = HomePage(driver)
    home_page.click_explore_button()
    home_page.verify_hero_section_visible()
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from .base_page import BasePage


class HomePage(BasePage):
    """Page Object Model for home page (/)."""

    # ============================================================================
    # LOCATORS (organized by section)
    # ============================================================================

    # Hero Section
    HERO_SECTION = (By.CSS_SELECTOR, "[data-testid='hero-section']")
    HERO_TITLE = (By.CSS_SELECTOR, "[data-testid='hero-title']")
    HERO_SUBTITLE = (By.CLASS_NAME, "hero-subtitle")
    
    # CTA Buttons
    EXPLORE_BUTTON = (By.CSS_SELECTOR, "[data-testid='explore-work-button']")
    CONTACT_BUTTON = (By.CSS_SELECTOR, "[data-testid='contact-button']")
    
    # SkillOrbit Component
    SKILL_ORBIT = (By.CSS_SELECTOR, "[data-testid='skill-orbit']")
    SKILL_ORBIT_NODES = (By.CLASS_NAME, "orbit-node")
    SKILL_ORBIT_CENTER = (By.CLASS_NAME, "orbit-center")
    SKILL_ORBIT_LABEL = (By.CLASS_NAME, "orbit-label")
    
    # Accordion (mobile fallback for SkillOrbit)
    SKILLS_ACCORDION = (By.CLASS_NAME, "accordion")
    ACCORDION_ITEMS = (By.CLASS_NAME, "accordion-item")
    
    # Projects Section
    PROJECTS_SECTION = (By.ID, "systems")
    PROJECT_CARDS = (By.CSS_SELECTOR, "[data-testid='project-card']")
    
    # Core Philosophies Section
    PHILOSOPHIES_SECTION = (By.CLASS_NAME, "philosophies")
    PHILOSOPHY_ITEMS = (By.CLASS_NAME, "philosophy-item")
    
    # Systems Section
    SYSTEMS_SECTION = (By.ID, "systems")
    
    # Competency Cards
    COMPETENCY_CARDS = (By.CLASS_NAME, "competency-card")
    
    # Navigation & Structure
    MAIN_CONTENT = (By.TAG_NAME, "main")
    PAGE_HEADER = (By.CLASS_NAME, "page-header")

    # ============================================================================
    # INITIALIZATION
    # ============================================================================

    def __init__(self, driver, base_url="http://localhost:9002"):
        """Initialize HomePage object."""
        super().__init__(driver, base_url, timeout=15)

    # ============================================================================
    # PAGE LOAD & VERIFICATION
    # ============================================================================

    def load_page(self):
        """Load home page."""
        self.navigate_to("/")
        self.wait_for_page_load()

    def verify_page_loaded(self):
        """Verify home page loaded correctly."""
        self.assert_element_visible(self.HERO_SECTION)
        self.assert_element_visible(self.HERO_TITLE)
        self.assert_element_text(self.HERO_TITLE, "Engineer Dev Mahn X")

    def verify_page_title(self):
        """Verify page title is correct."""
        assert "Dev Mahn X" in self.driver.title or "Portfolio" in self.driver.title

    # ============================================================================
    # HERO SECTION INTERACTIONS
    # ============================================================================

    def get_hero_title_text(self):
        """Get hero title text."""
        return self.get_text(self.HERO_TITLE)

    def is_hero_section_visible(self):
        """Check if hero section is visible."""
        return self.is_element_displayed(self.HERO_SECTION)

    def scroll_to_hero_section(self):
        """Scroll to hero section."""
        self.scroll_to_element(self.HERO_SECTION)

    # ============================================================================
    # BUTTON INTERACTIONS
    # ============================================================================

    def click_explore_button(self):
        """Click 'Explore the Work' button."""
        self.click(self.EXPLORE_BUTTON)

    def click_contact_button(self):
        """Click 'Contact / Collaborate' button."""
        self.click(self.CONTACT_BUTTON)

    def verify_explore_button_visible(self):
        """Verify Explore button is visible and clickable."""
        self.assert_element_visible(self.EXPLORE_BUTTON)

    def verify_contact_button_visible(self):
        """Verify Contact button is visible and clickable."""
        self.assert_element_visible(self.CONTACT_BUTTON)

    # ============================================================================
    # SKILL ORBIT INTERACTIONS (Desktop)
    # ============================================================================

    def is_skill_orbit_visible(self):
        """Check if SkillOrbit is visible (desktop only)."""
        return self.is_element_displayed(self.SKILL_ORBIT)

    def get_skill_orbit_nodes(self):
        """Get all SkillOrbit node elements."""
        return self.find_elements(self.SKILL_ORBIT_NODES)

    def get_skill_orbit_node_count(self):
        """Get count of SkillOrbit nodes."""
        nodes = self.get_skill_orbit_nodes()
        return len(nodes)

    def hover_over_skill_orbit_node(self, node_index=0):
        """
        Hover over a specific SkillOrbit node by index.
        
        Args:
            node_index: Index of node to hover (0-based)
        """
        nodes = self.get_skill_orbit_nodes()
        if node_index < len(nodes):
            self.hover_over(self.SKILL_ORBIT_NODES)

    def click_skill_orbit_node(self, node_index=0):
        """
        Click a specific SkillOrbit node by index.
        
        Args:
            node_index: Index of node to click (0-based)
        """
        nodes = self.get_skill_orbit_nodes()
        if node_index < len(nodes):
            nodes[node_index].click()

    # ============================================================================
    # ACCORDION INTERACTIONS (Mobile)
    # ============================================================================

    def is_accordion_visible(self):
        """Check if Accordion is visible (mobile only)."""
        return self.is_element_displayed(self.SKILLS_ACCORDION)

    def get_accordion_items(self):
        """Get all accordion items."""
        return self.find_elements(self.ACCORDION_ITEMS)

    def expand_accordion_item(self, item_index=0):
        """
        Expand an accordion item by index.
        
        Args:
            item_index: Index of item to expand (0-based)
        """
        items = self.get_accordion_items()
        if item_index < len(items):
            items[item_index].click()
            self.wait_for_framer_animation(duration=0.3)

    # ============================================================================
    # PROJECTS SECTION
    # ============================================================================

    def scroll_to_projects_section(self):
        """Scroll to featured projects section."""
        self.scroll_to_element(self.PROJECTS_SECTION)

    def get_featured_projects(self):
        """Get all featured project cards."""
        return self.find_elements(self.PROJECT_CARDS)

    def get_featured_projects_count(self):
        """Get count of featured projects."""
        projects = self.get_featured_projects()
        return len(projects)

    def click_project_card(self, project_index=0):
        """
        Click a project card by index.
        
        Args:
            project_index: Index of project to click (0-based)
        """
        projects = self.get_featured_projects()
        if project_index < len(projects):
            projects[project_index].click()
            self.wait_for_url_change("/projects/")

    def hover_over_project_card(self, project_index=0):
        """
        Hover over a project card by index.
        
        Args:
            project_index: Index of project to hover (0-based)
        """
        projects = self.get_featured_projects()
        if project_index < len(projects):
            self.hover_over(self.PROJECT_CARDS)

    # ============================================================================
    # PHILOSOPHIES SECTION
    # ============================================================================

    def is_philosophies_section_visible(self):
        """Check if Core Philosophies section is visible."""
        return self.is_element_displayed(self.PHILOSOPHIES_SECTION)

    def get_philosophy_items(self):
        """Get all philosophy items."""
        return self.find_elements(self.PHILOSOPHY_ITEMS)

    def get_philosophy_count(self):
        """Get count of philosophy items."""
        items = self.get_philosophy_items()
        return len(items)

    # ============================================================================
    # COMPETENCIES SECTION
    # ============================================================================

    def get_competency_cards(self):
        """Get all competency cards."""
        return self.find_elements(self.COMPETENCY_CARDS)

    def get_competency_count(self):
        """Get count of competency cards."""
        cards = self.get_competency_cards()
        return len(cards)

    # ============================================================================
    # NAVIGATION & SCROLLING
    # ============================================================================

    def scroll_to_systems_section(self):
        """Scroll to Systems section."""
        self.scroll_to_element(self.SYSTEMS_SECTION)

    def scroll_down_slowly(self, pixel_increment=200):
        """Scroll down slowly by pixel increments."""
        self.scroll_by(0, pixel_increment)
        self.wait(0.3)

    def scroll_to_bottom_of_page(self):
        """Scroll to bottom of page."""
        self.scroll_to_bottom()

    # ============================================================================
    # RESPONSIVE BREAKPOINT TESTS
    # ============================================================================

    def set_mobile_viewport(self):
        """Set mobile viewport (375px)."""
        super().set_mobile_viewport()

    def set_tablet_viewport(self):
        """Set tablet viewport (768px)."""
        super().set_tablet_viewport()

    def set_desktop_viewport(self):
        """Set desktop viewport (1024px)."""
        super().set_desktop_viewport()

    def verify_mobile_layout(self):
        """Verify page is rendered correctly for mobile."""
        self.set_mobile_viewport()
        # Mobile should NOT show SkillOrbit
        assert not self.is_skill_orbit_visible(), "SkillOrbit should not be visible on mobile"
        # Mobile should show Accordion instead
        assert self.is_accordion_visible(), "Accordion should be visible on mobile"

    def verify_desktop_layout(self):
        """Verify page is rendered correctly for desktop."""
        self.set_desktop_viewport()
        # Desktop should show SkillOrbit
        assert self.is_skill_orbit_visible(), "SkillOrbit should be visible on desktop"
        # Desktop should NOT show Accordion
        assert not self.is_accordion_visible(), "Accordion should not be visible on desktop"

    # ============================================================================
    # PERFORMANCE & ACCESSIBILITY
    # ============================================================================

    def get_console_errors(self):
        """Get any console errors on page."""
        return self.check_console_errors()

    def has_console_errors(self):
        """Check if page has console errors."""
        errors = self.get_console_errors()
        return len(errors) > 0

    def verify_no_console_errors(self):
        """Assert page has no console errors."""
        errors = self.get_console_errors()
        assert not errors, f"Console errors found: {errors}"

    def verify_h1_unique(self):
        """Verify page has only one H1 heading."""
        h1_elements = self.find_elements((By.TAG_NAME, "h1"))
        assert len(h1_elements) == 1, f"Expected 1 H1, found {len(h1_elements)}"

    def verify_page_accessible(self):
        """Verify basic accessibility (heading hierarchy, etc)."""
        self.verify_h1_unique()
        # Add more accessibility checks as needed

    # ============================================================================
    # DEBUGGING & SCREENSHOTS
    # ============================================================================

    def take_hero_screenshot(self):
        """Take screenshot of hero section."""
        return self.take_screenshot("home_hero.png")

    def take_full_page_screenshot(self):
        """Take screenshot of full page."""
        return self.take_screenshot("home_full_page.png")

    def print_page_structure(self):
        """Print page structure for debugging."""
        self.print_element_tree(self.MAIN_CONTENT, depth=3)

    # ============================================================================
    # COMPLEX WORKFLOWS
    # ============================================================================

    def navigate_to_projects_via_explore_button(self):
        """
        Complete workflow: Click Explore button and verify navigation.
        
        Returns:
            bool: True if navigation successful
        """
        self.verify_page_loaded()
        self.click_explore_button()
        self.wait_for_url_change("/projects", timeout=5)
        self.assert_url_contains("/projects")
        return True

    def navigate_to_resume_via_contact_button(self):
        """
        Complete workflow: Click Contact button and verify navigation.
        
        Returns:
            bool: True if navigation successful
        """
        self.verify_page_loaded()
        self.click_contact_button()
        self.wait_for_url_change("/resume", timeout=5)
        self.assert_url_contains("/resume")
        return True

    def explore_skill_orbit_on_desktop(self):
        """
        Complete workflow: Interact with SkillOrbit on desktop.
        
        Returns:
            int: Number of nodes found
        """
        self.set_desktop_viewport()
        self.verify_page_loaded()
        assert self.is_skill_orbit_visible()
        
        node_count = self.get_skill_orbit_node_count()
        assert node_count >= 6, f"Expected at least 6 nodes, found {node_count}"
        
        # Hover over first node
        self.hover_over_skill_orbit_node(0)
        self.wait(0.3)
        
        return node_count
