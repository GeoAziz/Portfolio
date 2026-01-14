from selenium.webdriver.common.by import By
from .base_page import BasePage


class OpenSourcePage(BasePage):
    """Page object for the Open Source page."""
    
    # Locators
    OPENSOURCE_CONTAINER = (By.CSS_SELECTOR, "[data-testid='opensource-container']")
    OPENSOURCE_TITLE = (By.CSS_SELECTOR, "[data-testid='opensource-title']")
    OPENSOURCE_SUBTITLE = (By.CSS_SELECTOR, "[data-testid='opensource-subtitle']")
    OPENSOURCE_DESCRIPTION = (By.CSS_SELECTOR, "[data-testid='opensource-description']")
    OPENSOURCE_PROJECTS_SECTION = (By.CSS_SELECTOR, "[data-testid='opensource-projects-section']")
    OPENSOURCE_PROJECTS_GRID = (By.CSS_SELECTOR, "[data-testid='opensource-projects-grid']")
    OPENSOURCE_PHILOSOPHY_SECTION = (By.CSS_SELECTOR, "[data-testid='opensource-philosophy-section']")
    OPENSOURCE_PHILOSOPHY_CONTENT = (By.CSS_SELECTOR, "[data-testid='opensource-philosophy-content']")
    OPENSOURCE_PHILOSOPHY_STATEMENT = (By.CSS_SELECTOR, "[data-testid='opensource-philosophy-statement']")
    OPENSOURCE_PHILOSOPHY_VALUES = (By.CSS_SELECTOR, "[data-testid='opensource-philosophy-values']")
    
    def load_page(self):
        """Load the Open Source page."""
        self.driver.get(f"{self.base_url}/open-source")
        self.wait_for_element(self.OPENSOURCE_CONTAINER)
        
    def is_opensource_container_visible(self):
        """Check if open source container is visible."""
        return self.is_element_displayed(self.OPENSOURCE_CONTAINER)
    
    def get_page_title(self):
        """Get the open source page title."""
        element = self.find_element(self.OPENSOURCE_TITLE)
        return element.text if element else None
    
    def get_page_subtitle(self):
        """Get the page subtitle."""
        element = self.find_element(self.OPENSOURCE_SUBTITLE)
        return element.text if element else None
    
    def get_page_description(self):
        """Get the page description."""
        element = self.find_element(self.OPENSOURCE_DESCRIPTION)
        return element.text if element else None
    
    def is_projects_section_visible(self):
        """Check if projects section is visible."""
        return self.is_element_displayed(self.OPENSOURCE_PROJECTS_SECTION)
    
    def get_projects_count(self):
        """Get count of open source projects displayed."""
        try:
            grid = self.find_element(self.OPENSOURCE_PROJECTS_GRID, timeout=2)
            if grid:
                projects = grid.find_elements(By.CSS_SELECTOR, "[data-testid^='opensource-project-']")
                return len(projects)
        except:
            pass
        return 0
    
    def is_philosophy_section_visible(self):
        """Check if philosophy section is visible."""
        return self.is_element_displayed(self.OPENSOURCE_PHILOSOPHY_SECTION)
    
    def get_philosophy_statement(self):
        """Get the philosophy statement."""
        element = self.find_element(self.OPENSOURCE_PHILOSOPHY_STATEMENT)
        return element.text if element else None
    
    def get_philosophy_values(self):
        """Get the philosophy values."""
        try:
            values_container = self.find_element(self.OPENSOURCE_PHILOSOPHY_VALUES, timeout=2)
            if values_container:
                badges = values_container.find_elements(By.CSS_SELECTOR, "[data-testid^='opensource-value-']")
                return [badge.text for badge in badges]
        except:
            pass
        return []
    
    def verify_opensource_page_loaded(self):
        """Verify open source page has loaded successfully."""
        return (self.is_opensource_container_visible() and 
                self.is_element_displayed(self.OPENSOURCE_TITLE) and
                self.is_projects_section_visible())
    
    def verify_all_sections_present(self):
        """Verify all main sections are present."""
        return (self.is_projects_section_visible() and
                self.is_philosophy_section_visible())
    
    def verify_header_content(self):
        """Verify header has all required content."""
        title = self.get_page_title()
        subtitle = self.get_page_subtitle()
        description = self.get_page_description()
        return bool(title and subtitle and description)
    
    def verify_philosophy_content(self):
        """Verify philosophy section has content."""
        statement = self.get_philosophy_statement()
        values = self.get_philosophy_values()
        return bool(statement and len(values) > 0)
    
    def verify_projects_visible(self):
        """Verify projects are visible."""
        count = self.get_projects_count()
        return count > 0
