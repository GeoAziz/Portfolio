from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from .base_page import BasePage


class ProjectsPage(BasePage):
    """Page object for the Projects page."""
    
    # Locators
    PROJECTS_CONTAINER = (By.CSS_SELECTOR, "[data-testid='projects-container']")
    PROJECTS_TITLE = (By.CSS_SELECTOR, "[data-testid='projects-title']")
    PROJECTS_SEARCH = (By.CSS_SELECTOR, "[data-testid='projects-search']")
    PROJECTS_FILTER = (By.CSS_SELECTOR, "[data-testid='projects-filter']")
    PROJECTS_FILTER_CATEGORY = (By.CSS_SELECTOR, "[data-testid='projects-filter-category']")
    PROJECTS_FILTER_TECH = (By.CSS_SELECTOR, "[data-testid='projects-filter-tech']")
    PROJECTS_FILTER_CLEAR = (By.CSS_SELECTOR, "[data-testid='projects-filter-clear']")
    PROJECTS_FEATURED_GRID = (By.CSS_SELECTOR, "[data-testid='projects-featured-grid']")
    PROJECTS_GRID = (By.CSS_SELECTOR, "[data-testid='projects-grid']")
    FEATURED_PROJECT_CARD = "project-card-featured-{}"
    PROJECT_CARD = "project-card-{}"
    FEATURED_PROJECT_TITLE = "project-title-featured-{}"
    PROJECT_TITLE = "project-title-{}"
    FEATURED_PROJECT_SUMMARY = "project-summary-featured-{}"
    PROJECT_SUMMARY = "project-summary-{}"
    FEATURED_PROJECT_TECH = "project-tech-featured-{}"
    PROJECT_TECH = "project-tech-{}"
    
    def load_page(self):
        """Load the Projects page."""
        self.driver.get(f"{self.base_url}/projects")
        self.wait_for_element(self.PROJECTS_CONTAINER)
        
    def is_projects_container_visible(self):
        """Check if projects container is visible."""
        return self.is_element_displayed(self.PROJECTS_CONTAINER)
    
    def get_projects_title_text(self):
        """Get the projects page title text."""
        element = self.find_element(self.PROJECTS_TITLE)
        return element.text if element else None
    
    def is_search_visible(self):
        """Check if search input is visible."""
        return self.is_element_displayed(self.PROJECTS_SEARCH)
    
    def search_projects(self, search_term):
        """Search for projects by term."""
        search_field = self.find_element(self.PROJECTS_SEARCH)
        if search_field:
            search_field.clear()
            search_field.send_keys(search_term)
            return True
        return False
    
    def get_filter_categories(self):
        """Get list of available category filter buttons."""
        filter_container = self.find_element(self.PROJECTS_FILTER_CATEGORY)
        if filter_container:
            buttons = filter_container.find_elements(By.CSS_SELECTOR, "button")
            return [btn.text for btn in buttons]
        return []
    
    def filter_by_category(self, category):
        """Filter projects by category."""
        filter_element = (By.CSS_SELECTOR, f"[data-testid='projects-filter-category-{category}']")
        button = self.find_element(filter_element)
        if button:
            self.scroll_to_element(button)
            button.click()
            return True
        return False
    
    def get_filter_technologies(self):
        """Get list of available technology filter buttons."""
        filter_container = self.find_element(self.PROJECTS_FILTER_TECH)
        if filter_container:
            buttons = filter_container.find_elements(By.CSS_SELECTOR, "button")
            return [btn.text for btn in buttons]
        return []
    
    def filter_by_technology(self, tech):
        """Filter projects by technology."""
        filter_element = (By.CSS_SELECTOR, f"[data-testid='projects-filter-tech-{tech}']")
        button = self.find_element(filter_element)
        if button:
            self.scroll_to_element(button)
            button.click()
            return True
        return False
    
    def is_clear_filters_visible(self):
        """Check if clear filters button is visible."""
        return self.is_element_displayed(self.PROJECTS_FILTER_CLEAR)
    
    def click_clear_filters(self):
        """Click the clear filters button."""
        button = self.find_element(self.PROJECTS_FILTER_CLEAR)
        if button:
            button.click()
            return True
        return False
    
    def get_featured_project_count(self):
        """Get count of featured projects displayed."""
        try:
            featured_grid = self.find_element(self.PROJECTS_FEATURED_GRID, timeout=2)
            if featured_grid:
                cards = featured_grid.find_elements(By.CSS_SELECTOR, "[data-testid^='project-card-featured-']")
                return len(cards)
        except:
            pass
        return 0
    
    def get_project_count(self):
        """Get count of projects displayed in main grid."""
        try:
            grid = self.find_element(self.PROJECTS_GRID, timeout=2)
            if grid:
                cards = grid.find_elements(By.CSS_SELECTOR, "[data-testid^='project-card-']")
                # Filter out featured cards (which have 'featured-' in data-testid)
                cards = [c for c in cards if 'featured' not in c.get_attribute('data-testid')]
                return len(cards)
        except:
            pass
        return 0
    
    def get_project_title(self, index, is_featured=False):
        """Get project title by index."""
        try:
            if is_featured:
                locator = (By.CSS_SELECTOR, f"[data-testid='{self.FEATURED_PROJECT_TITLE.format(index)}']")
            else:
                locator = (By.CSS_SELECTOR, f"[data-testid='{self.PROJECT_TITLE.format(index)}']")
            element = self.find_element(locator, timeout=2)
            return element.text if element else None
        except:
            return None
    
    def get_project_summary(self, index, is_featured=False):
        """Get project summary by index."""
        try:
            if is_featured:
                locator = (By.CSS_SELECTOR, f"[data-testid='{self.FEATURED_PROJECT_SUMMARY.format(index)}']")
            else:
                locator = (By.CSS_SELECTOR, f"[data-testid='{self.PROJECT_SUMMARY.format(index)}']")
            element = self.find_element(locator, timeout=2)
            return element.text if element else None
        except:
            return None
    
    def get_project_technologies(self, index, is_featured=False):
        """Get technologies list for a project by index."""
        if is_featured:
            locator = (By.CSS_SELECTOR, f"[data-testid='{self.FEATURED_PROJECT_TECH.format(index)}']")
        else:
            locator = (By.CSS_SELECTOR, f"[data-testid='{self.PROJECT_TECH.format(index)}']")
        try:
            element = self.find_element(locator, timeout=2)
            if element:
                tech_badges = element.find_elements(By.CSS_SELECTOR, "[class*='badge']")
                return [badge.text for badge in tech_badges]
        except:
            pass
        return []
    
    def click_project(self, index, is_featured=False):
        """Click a project card by index."""
        if is_featured:
            locator = (By.CSS_SELECTOR, f"[data-testid='{self.FEATURED_PROJECT_CARD.format(index)}']")
        else:
            locator = (By.CSS_SELECTOR, f"[data-testid='{self.PROJECT_CARD.format(index)}']")
        element = self.find_element(locator)
        if element:
            self.scroll_to_element(element)
            element.click()
            return True
        return False
    
    def verify_projects_page_loaded(self):
        """Verify projects page has loaded successfully."""
        return (self.is_projects_container_visible() and 
                self.is_element_displayed(self.PROJECTS_TITLE) and
                self.is_search_visible())
    
    def verify_projects_are_visible(self):
        """Verify that projects are visible on the page."""
        featured_count = self.get_featured_project_count()
        project_count = self.get_project_count()
        return featured_count > 0 or project_count > 0
    
    def verify_project_has_metadata(self, index, is_featured=False):
        """Verify that a project has all required metadata visible."""
        try:
            title = self.get_project_title(index, is_featured)
            summary = self.get_project_summary(index, is_featured)
            tech = self.get_project_technologies(index, is_featured)
            return bool(title and summary and len(tech) > 0)
        except:
            return False
