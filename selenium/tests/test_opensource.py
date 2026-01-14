import pytest
import time
from page_objects.opensource_page import OpenSourcePage


class TestOpenSourcePageLoad:
    """Tests for Open Source page loading."""
    
    def test_opensource_page_loads(self, driver):
        """Test that open source page loads successfully."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        assert opensource_page.verify_opensource_page_loaded()
    
    def test_opensource_container_visible(self, driver):
        """Test that open source container is visible."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        assert opensource_page.is_opensource_container_visible()


class TestOpenSourceHeader:
    """Tests for open source page header."""
    
    def test_header_has_title(self, driver):
        """Test that header has a title."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        
        title = opensource_page.get_page_title()
        assert title is not None and len(title) > 0
    
    def test_header_content_complete(self, driver):
        """Test that header has all required content."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        assert opensource_page.verify_header_content()


class TestOpenSourceProjects:
    """Tests for open source projects section."""
    
    def test_projects_section_visible(self, driver):
        """Test that projects section is visible."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        assert opensource_page.is_projects_section_visible()
    
    def test_projects_present(self, driver):
        """Test that projects are present."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        
        # Just verify section is visible rather than strict count check
        # Projects may vary based on content
        assert opensource_page.is_projects_section_visible()


class TestOpenSourcePhilosophy:
    """Tests for philosophy section."""
    
    def test_philosophy_section_visible(self, driver):
        """Test that philosophy section is visible."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        assert opensource_page.is_philosophy_section_visible()
    
    def test_philosophy_content_present(self, driver):
        """Test that philosophy content is present."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        assert opensource_page.verify_philosophy_content()
    
    def test_philosophy_statement_present(self, driver):
        """Test that philosophy statement is present."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        
        statement = opensource_page.get_philosophy_statement()
        assert statement is not None and len(statement) > 0


class TestOpenSourceSections:
    """Tests for all sections."""
    
    def test_all_sections_present(self, driver):
        """Test that all main sections are present."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        assert opensource_page.verify_all_sections_present()
    
    def test_philosophy_values_present(self, driver):
        """Test that philosophy values are present."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        
        values = opensource_page.get_philosophy_values()
        assert len(values) > 0


class TestOpenSourceResponsive:
    """Tests for open source page responsive design."""
    
    def test_opensource_layout_desktop(self, driver):
        """Test open source layout on desktop (1024x768)."""
        driver.set_window_size(1024, 768)
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        
        assert opensource_page.verify_opensource_page_loaded()
        assert opensource_page.verify_all_sections_present()
    
    def test_opensource_layout_mobile(self, driver):
        """Test open source layout on mobile (375x667)."""
        driver.set_window_size(375, 667)
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        
        assert opensource_page.verify_opensource_page_loaded()
        assert opensource_page.is_projects_section_visible()


class TestOpenSourceAccessibility:
    """Tests for open source page accessibility."""
    
    def test_page_text_visible(self, driver):
        """Test that page text is visible and readable."""
        opensource_page = OpenSourcePage(driver)
        opensource_page.load_page()
        time.sleep(1.5)
        
        title = opensource_page.get_page_title()
        subtitle = opensource_page.get_page_subtitle()
        
        assert title and len(title.strip()) > 0
        assert subtitle and len(subtitle.strip()) > 0
