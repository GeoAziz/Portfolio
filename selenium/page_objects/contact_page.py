from selenium.webdriver.common.by import By
from .base_page import BasePage


class ContactPage(BasePage):
    """Page object for the Contact page."""
    
    # Locators
    CONTACT_CONTAINER = (By.CSS_SELECTOR, "[data-testid='contact-container']")
    CONTACT_DESCRIPTION = (By.CSS_SELECTOR, "[data-testid='contact-description']")
    CONTACT_FORM_TITLE = (By.CSS_SELECTOR, "[data-testid='contact-form-title']")
    CONTACT_FORM_SUBTITLE = (By.CSS_SELECTOR, "[data-testid='contact-form-subtitle']")
    CONTACT_FORM = (By.CSS_SELECTOR, "[data-testid='contact-form']")
    CONTACT_FORM_CARD = (By.CSS_SELECTOR, "[data-testid='contact-form-card']")
    CONTACT_METHODS_TITLE = (By.CSS_SELECTOR, "[data-testid='contact-methods-title']")
    CONTACT_INPUT_NAME = (By.CSS_SELECTOR, "[data-testid='contact-input-name']")
    CONTACT_INPUT_EMAIL = (By.CSS_SELECTOR, "[data-testid='contact-input-email']")
    CONTACT_INPUT_SUBJECT = (By.CSS_SELECTOR, "[data-testid='contact-input-subject']")
    CONTACT_INPUT_MESSAGE = (By.CSS_SELECTOR, "[data-testid='contact-input-message']")
    CONTACT_SUBMIT_BUTTON = (By.CSS_SELECTOR, "[data-testid='contact-submit-button']")
    CONTACT_METHOD_EMAIL = (By.CSS_SELECTOR, "[data-testid='contact-method-email']")
    CONTACT_METHOD_GITHUB = (By.CSS_SELECTOR, "[data-testid='contact-method-github']")
    CONTACT_METHOD_LINKEDIN = (By.CSS_SELECTOR, "[data-testid='contact-method-linkedin']")
    CONTACT_METHOD_TWITTER = (By.CSS_SELECTOR, "[data-testid='contact-method-twitter/x']")
    
    def load_page(self):
        """Load the Contact page."""
        self.driver.get(f"{self.base_url}/contact")
        self.wait_for_element(self.CONTACT_CONTAINER)
        
    def is_contact_container_visible(self):
        """Check if contact container is visible."""
        return self.is_element_displayed(self.CONTACT_CONTAINER)
    
    def get_page_description(self):
        """Get the contact page description text."""
        element = self.find_element(self.CONTACT_DESCRIPTION)
        return element.text if element else None
    
    def get_form_title(self):
        """Get the contact form title."""
        element = self.find_element(self.CONTACT_FORM_TITLE)
        return element.text if element else None
    
    def is_form_visible(self):
        """Check if contact form is visible."""
        return self.is_element_displayed(self.CONTACT_FORM)
    
    def fill_name(self, name):
        """Fill in the name field."""
        field = self.find_element(self.CONTACT_INPUT_NAME)
        if field:
            field.clear()
            field.send_keys(name)
            return True
        return False
    
    def fill_email(self, email):
        """Fill in the email field."""
        field = self.find_element(self.CONTACT_INPUT_EMAIL)
        if field:
            field.clear()
            field.send_keys(email)
            return True
        return False
    
    def fill_subject(self, subject):
        """Fill in the subject field."""
        field = self.find_element(self.CONTACT_INPUT_SUBJECT)
        if field:
            field.clear()
            field.send_keys(subject)
            return True
        return False
    
    def fill_message(self, message):
        """Fill in the message field."""
        field = self.find_element(self.CONTACT_INPUT_MESSAGE)
        if field:
            field.clear()
            field.send_keys(message)
            return True
        return False
    
    def fill_form(self, name, email, subject, message):
        """Fill in the entire contact form."""
        self.fill_name(name)
        self.fill_email(email)
        self.fill_subject(subject)
        self.fill_message(message)
        return True
    
    def get_form_values(self):
        """Get current form values."""
        try:
            name = self.find_element(self.CONTACT_INPUT_NAME).get_attribute('value')
            email = self.find_element(self.CONTACT_INPUT_EMAIL).get_attribute('value')
            subject = self.find_element(self.CONTACT_INPUT_SUBJECT).get_attribute('value')
            message = self.find_element(self.CONTACT_INPUT_MESSAGE).get_attribute('value')
            return {'name': name, 'email': email, 'subject': subject, 'message': message}
        except:
            return None
    
    def submit_form(self):
        """Submit the contact form."""
        button = self.find_clickable_element(self.CONTACT_SUBMIT_BUTTON)
        if button:
            button.click()
            return True
        return False
    
    def is_submit_button_visible(self):
        """Check if submit button is visible."""
        return self.is_element_displayed(self.CONTACT_SUBMIT_BUTTON)
    
    def is_submit_button_enabled(self):
        """Check if submit button is enabled."""
        button = self.find_element(self.CONTACT_SUBMIT_BUTTON)
        return button.is_enabled() if button else False
    
    def get_contact_method(self, method_name):
        """Get a contact method element by name (email, github, linkedin, twitter/x)."""
        locator = (By.CSS_SELECTOR, f"[data-testid='contact-method-{method_name}']")
        element = self.find_element(locator, timeout=2)
        return element
    
    def get_available_contact_methods(self):
        """Get list of available contact methods."""
        methods = ['email', 'github', 'linkedin', 'twitter/x']
        available = []
        for method in methods:
            try:
                self.get_contact_method(method)
                available.append(method)
            except:
                pass
        return available
    
    def click_contact_method(self, method_name):
        """Click on a contact method."""
        element = self.get_contact_method(method_name)
        if element:
            self.scroll_to_element(element)
            element.click()
            return True
        return False
    
    def verify_contact_page_loaded(self):
        """Verify contact page has loaded successfully."""
        return (self.is_contact_container_visible() and 
                self.is_element_displayed(self.CONTACT_FORM_TITLE) and
                self.is_form_visible())
    
    def verify_all_form_fields_present(self):
        """Verify all form fields are present and visible."""
        fields = [
            self.CONTACT_INPUT_NAME,
            self.CONTACT_INPUT_EMAIL,
            self.CONTACT_INPUT_SUBJECT,
            self.CONTACT_INPUT_MESSAGE,
        ]
        for field in fields:
            if not self.is_element_displayed(field):
                return False
        return True
    
    def verify_contact_methods_sidebar_visible(self):
        """Verify contact methods sidebar is visible."""
        return self.is_element_displayed(self.CONTACT_METHODS_TITLE)
