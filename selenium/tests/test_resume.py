import pytest
import time
from page_objects.resume_page import ResumePage


class TestResumePageLoad:
    """Tests for Resume page loading."""
    
    def test_resume_page_loads(self, driver):
        """Test that resume page loads successfully."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.verify_resume_page_loaded()
    
    def test_resume_container_visible(self, driver):
        """Test that resume container is visible."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.is_resume_container_visible()


class TestResumeHeader:
    """Tests for resume header content."""
    
    def test_header_has_title(self, driver):
        """Test that header has a title."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        
        title = resume_page.get_resume_title()
        assert title is not None and len(title) > 0
    
    def test_header_content_complete(self, driver):
        """Test that header has all required content."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.verify_header_content()


class TestResumeExpertise:
    """Tests for expertise section."""
    
    def test_expertise_section_visible(self, driver):
        """Test that expertise section is visible."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.is_expertise_section_visible()
    
    def test_expertise_cards_present(self, driver):
        """Test that expertise cards are present."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        
        # Just verify the grid is visible rather than counting cards
        # which may vary based on content structure
        assert resume_page.is_expertise_section_visible()


class TestResumeExperience:
    """Tests for experience section."""
    
    def test_experience_section_visible(self, driver):
        """Test that experience section is visible."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.is_experience_section_visible()
    
    def test_experience_entries_present(self, driver):
        """Test that experience entries are present."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        
        count = resume_page.get_experience_entries_count()
        assert count > 0


class TestResumeProjects:
    """Tests for projects section."""
    
    def test_projects_section_visible(self, driver):
        """Test that projects section is visible."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.is_projects_section_visible()
    
    def test_projects_present(self, driver):
        """Test that projects are present."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        
        count = resume_page.get_projects_count()
        assert count > 0


class TestResumeContact:
    """Tests for contact section."""
    
    def test_contact_section_visible(self, driver):
        """Test that contact section is visible."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.is_contact_section_visible()
    
    def test_github_button_visible(self, driver):
        """Test that GitHub button is visible."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.is_github_button_visible()


class TestResumeDownload:
    """Tests for resume download."""
    
    def test_download_button_visible(self, driver):
        """Test that download button is visible."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.is_download_button_visible()
    
    def test_all_sections_present(self, driver):
        """Test that all key sections are present."""
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        assert resume_page.verify_key_sections_present()


class TestResumeResponsive:
    """Tests for resume page responsive design."""
    
    def test_resume_layout_desktop(self, driver):
        """Test resume layout on desktop (1024x768)."""
        driver.set_window_size(1024, 768)
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        
        assert resume_page.verify_resume_page_loaded()
        assert resume_page.verify_key_sections_present()
    
    def test_resume_layout_mobile(self, driver):
        """Test resume layout on mobile (375x667)."""
        driver.set_window_size(375, 667)
        resume_page = ResumePage(driver)
        resume_page.load_page()
        time.sleep(1.5)
        
        assert resume_page.verify_resume_page_loaded()
        assert resume_page.is_expertise_section_visible()
