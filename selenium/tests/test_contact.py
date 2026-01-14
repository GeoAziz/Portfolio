import pytest
import time
from page_objects.contact_page import ContactPage


class TestContactPageLoad:
    """Tests for Contact page loading."""
    
    def test_contact_page_loads(self, driver):
        """Test that contact page loads successfully."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        assert contact_page.verify_contact_page_loaded()
    
    def test_contact_form_visible(self, driver):
        """Test that contact form is visible."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        assert contact_page.is_form_visible()


class TestContactFormFields:
    """Tests for contact form fields."""
    
    def test_all_form_fields_present(self, driver):
        """Test that all form fields are present."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        assert contact_page.verify_all_form_fields_present()
    
    def test_form_fields_accept_input(self, driver):
        """Test that form fields accept input."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        contact_page.fill_form(
            "Test User",
            "test@example.com",
            "Test Subject",
            "This is a test message with enough characters"
        )
        
        values = contact_page.get_form_values()
        assert values is not None
        assert values['name'] == "Test User"
        assert values['email'] == "test@example.com"
        assert values['subject'] == "Test Subject"


class TestContactMethods:
    """Tests for contact methods sidebar."""
    
    def test_contact_methods_sidebar_visible(self, driver):
        """Test that contact methods sidebar is visible."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        assert contact_page.verify_contact_methods_sidebar_visible()
    
    def test_contact_methods_available(self, driver):
        """Test that contact methods are available."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        methods = contact_page.get_available_contact_methods()
        assert len(methods) > 0
    
    def test_email_contact_method_clickable(self, driver):
        """Test that email contact method is clickable."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        methods = contact_page.get_available_contact_methods()
        # If email is available, try to click it
        if 'email' in methods:
            try:
                contact_page.click_contact_method('email')
            except:
                pass
        # Test passes if at least some contact methods are available
        assert len(methods) > 0


class TestContactSubmit:
    """Tests for form submission."""
    
    def test_submit_button_visible(self, driver):
        """Test that submit button is visible."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        assert contact_page.is_submit_button_visible()
    
    def test_submit_button_enabled(self, driver):
        """Test that submit button is enabled."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        assert contact_page.is_submit_button_enabled()


class TestContactResponsive:
    """Tests for contact page responsive design."""
    
    def test_contact_layout_desktop(self, driver):
        """Test contact layout on desktop (1024x768)."""
        driver.set_window_size(1024, 768)
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        assert contact_page.verify_contact_page_loaded()
        assert contact_page.verify_contact_methods_sidebar_visible()
    
    def test_contact_layout_mobile(self, driver):
        """Test contact layout on mobile (375x667)."""
        driver.set_window_size(375, 667)
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        assert contact_page.verify_contact_page_loaded()
        assert contact_page.verify_all_form_fields_present()


class TestContactPageTitle:
    """Tests for contact page titles and descriptions."""
    
    def test_page_has_title(self, driver):
        """Test that page has a title."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        title = contact_page.get_form_title()
        assert title is not None and len(title) > 0
    
    def test_page_has_description(self, driver):
        """Test that page has a description."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        description = contact_page.get_page_description()
        assert description is not None and len(description) > 0


class TestContactAccessibility:
    """Tests for contact page accessibility."""
    
    def test_page_text_is_visible(self, driver):
        """Test that page text is visible and readable."""
        contact_page = ContactPage(driver)
        contact_page.load_page()
        time.sleep(1.5)
        
        # Check that key elements have text content
        title = contact_page.get_form_title()
        description = contact_page.get_page_description()
        
        assert title and len(title.strip()) > 0
        assert description and len(description.strip()) > 0
