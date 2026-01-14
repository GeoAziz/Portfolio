from selenium.webdriver.common.by import By
from .base_page import BasePage


class ResumePage(BasePage):
    """Page object for the Resume page."""
    
    # Locators
    RESUME_CONTAINER = (By.CSS_SELECTOR, "[data-testid='resume-container']")
    RESUME_HEADER = (By.CSS_SELECTOR, "[data-testid='resume-header']")
    RESUME_TITLE = (By.CSS_SELECTOR, "[data-testid='resume-title']")
    RESUME_SUBTITLE = (By.CSS_SELECTOR, "[data-testid='resume-subtitle']")
    RESUME_STATEMENT = (By.CSS_SELECTOR, "[data-testid='resume-statement']")
    RESUME_EXPERTISE_GRID = (By.CSS_SELECTOR, "[data-testid='resume-expertise-grid']")
    RESUME_SKILLS_CARD = (By.CSS_SELECTOR, "[data-testid='resume-skills-card']")
    RESUME_LANGUAGES_CARD = (By.CSS_SELECTOR, "[data-testid='resume-languages-card']")
    RESUME_FRAMEWORKS_CARD = (By.CSS_SELECTOR, "[data-testid='resume-frameworks-card']")
    RESUME_TOOLS_CARD = (By.CSS_SELECTOR, "[data-testid='resume-tools-card']")
    RESUME_EXPERIENCE_LIST = (By.CSS_SELECTOR, "[data-testid='resume-experience-list']")
    RESUME_PROJECTS_GRID = (By.CSS_SELECTOR, "[data-testid='resume-projects-grid']")
    RESUME_CONTACT_CARD = (By.CSS_SELECTOR, "[data-testid='resume-contact-card']")
    RESUME_AVAILABILITY = (By.CSS_SELECTOR, "[data-testid='resume-availability']")
    RESUME_GITHUB_BUTTON = (By.CSS_SELECTOR, "[data-testid='resume-github-button']")
    RESUME_EMAIL_BUTTON = (By.CSS_SELECTOR, "[data-testid='resume-email-button']")
    RESUME_DOWNLOAD_BUTTON = (By.CSS_SELECTOR, "[data-testid='resume-download-button']")
    
    def load_page(self):
        """Load the Resume page."""
        self.driver.get(f"{self.base_url}/resume")
        self.wait_for_element(self.RESUME_CONTAINER)
        
    def is_resume_container_visible(self):
        """Check if resume container is visible."""
        return self.is_element_displayed(self.RESUME_CONTAINER)
    
    def get_resume_title(self):
        """Get the resume page title."""
        element = self.find_element(self.RESUME_TITLE)
        return element.text if element else None
    
    def get_resume_subtitle(self):
        """Get the resume page subtitle."""
        element = self.find_element(self.RESUME_SUBTITLE)
        return element.text if element else None
    
    def get_resume_statement(self):
        """Get the resume statement."""
        element = self.find_element(self.RESUME_STATEMENT)
        return element.text if element else None
    
    def is_expertise_section_visible(self):
        """Check if expertise section is visible."""
        return self.is_element_displayed(self.RESUME_EXPERTISE_GRID)
    
    def get_expertise_cards_count(self):
        """Get count of expertise cards."""
        try:
            grid = self.find_element(self.RESUME_EXPERTISE_GRID, timeout=2)
            if grid:
                cards = grid.find_elements(By.CSS_SELECTOR, "[class*='Card']")
                return len(cards)
        except:
            pass
        return 0
    
    def is_experience_section_visible(self):
        """Check if experience section is visible."""
        return self.is_element_displayed(self.RESUME_EXPERIENCE_LIST)
    
    def get_experience_entries_count(self):
        """Get count of experience entries."""
        try:
            experience_list = self.find_element(self.RESUME_EXPERIENCE_LIST, timeout=2)
            if experience_list:
                entries = experience_list.find_elements(By.CSS_SELECTOR, "[data-testid^='resume-experience-']")
                # Filter out non-numeric entries
                entries = [e for e in entries if e.get_attribute('data-testid').split('-')[-1].isdigit()]
                return len(entries)
        except:
            pass
        return 0
    
    def is_projects_section_visible(self):
        """Check if projects section is visible."""
        return self.is_element_displayed(self.RESUME_PROJECTS_GRID)
    
    def get_projects_count(self):
        """Get count of projects displayed."""
        try:
            grid = self.find_element(self.RESUME_PROJECTS_GRID, timeout=2)
            if grid:
                projects = grid.find_elements(By.CSS_SELECTOR, "[data-testid^='resume-project-']")
                # Filter to only the main project cards (not title/role/impact)
                projects = [p for p in projects if p.get_attribute('data-testid').split('-')[-1].isdigit()]
                return len(projects)
        except:
            pass
        return 0
    
    def get_project_name(self, index):
        """Get project name by index."""
        locator = (By.CSS_SELECTOR, f"[data-testid='resume-project-name-{index}']")
        try:
            element = self.find_element(locator, timeout=2)
            return element.text if element else None
        except:
            return None
    
    def is_contact_section_visible(self):
        """Check if contact section is visible."""
        return self.is_element_displayed(self.RESUME_CONTACT_CARD)
    
    def get_availability_text(self):
        """Get availability text from contact section."""
        element = self.find_element(self.RESUME_AVAILABILITY)
        return element.text if element else None
    
    def is_github_button_visible(self):
        """Check if GitHub button is visible."""
        return self.is_element_displayed(self.RESUME_GITHUB_BUTTON)
    
    def is_download_button_visible(self):
        """Check if download button is visible."""
        return self.is_element_displayed(self.RESUME_DOWNLOAD_BUTTON)
    
    def click_github_button(self):
        """Click the GitHub button."""
        button = self.find_clickable_element(self.RESUME_GITHUB_BUTTON)
        if button:
            self.scroll_to_element(button)
            button.click()
            return True
        return False
    
    def verify_resume_page_loaded(self):
        """Verify resume page has loaded successfully."""
        return (self.is_resume_container_visible() and 
                self.is_element_displayed(self.RESUME_TITLE) and
                self.is_expertise_section_visible())
    
    def verify_key_sections_present(self):
        """Verify all key sections are present."""
        return (self.is_expertise_section_visible() and
                self.is_experience_section_visible() and
                self.is_projects_section_visible() and
                self.is_contact_section_visible())
    
    def verify_header_content(self):
        """Verify header has all required content."""
        title = self.get_resume_title()
        subtitle = self.get_resume_subtitle()
        statement = self.get_resume_statement()
        return bool(title and subtitle and statement)
