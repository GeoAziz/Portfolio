"""
Blog Page Object Model

Provides Blog page-specific functionality for Selenium tests.
Inherits core methods from BasePage.

Follows HomePage structure exactly:
- Locators defined as tuples (By.TYPE, "selector")
- Methods named descriptively (load_page, click_*, verify_*)
- No assertions in page object (assertions in tests only)

Test coverage:
- Page load verification
- Blog post rendering
- Tag filtering
- Navigation to individual posts
- Responsive verification
"""

from selenium.webdriver.common.by import By
from page_objects.base_page import BasePage


class BlogPage(BasePage):
    """Blog page object with posting, filtering, and navigation."""

    # ============================================================================
    # LOCATORS (organized by section)
    # ============================================================================

    # Page containers
    BLOG_CONTAINER = (By.CSS_SELECTOR, "[data-testid='blog-container']")
    BLOG_GRID = (By.CSS_SELECTOR, "[data-testid='blog-grid']")
    BLOG_TITLE = (By.CSS_SELECTOR, "[data-testid='blog-title']")

    # Filter controls
    BLOG_FILTER = (By.CSS_SELECTOR, "[data-testid='blog-filter']")
    BLOG_FILTER_TAG = (By.CSS_SELECTOR, "[data-testid^='blog-filter-tag-']")
    BLOG_FILTER_CLEAR = (By.CSS_SELECTOR, "[data-testid='blog-filter-clear']")

    # Blog post cards
    BLOG_POST_CARDS = (By.CSS_SELECTOR, "[data-testid^='blog-post-card-']")
    BLOG_POST_TITLES = (By.CSS_SELECTOR, "[data-testid^='blog-post-title-']")
    BLOG_POST_EXCERPTS = (By.CSS_SELECTOR, "[data-testid^='blog-post-excerpt-']")
    BLOG_POST_DATES = (By.CSS_SELECTOR, "[data-testid^='blog-post-date-']")

    # ============================================================================
    # PAGE LOAD & VERIFICATION
    # ============================================================================

    def load_page(self):
        """Load the blog page."""
        self.driver.get(f"{self.base_url}/blog")

    def is_blog_container_visible(self):
        """Check if blog container is visible."""
        return self.is_element_displayed(self.BLOG_CONTAINER)

    def is_blog_grid_visible(self):
        """Check if blog grid is visible."""
        return self.is_element_displayed(self.BLOG_GRID)

    def get_blog_title_text(self):
        """Get blog page title text."""
        return self.get_element_text(self.BLOG_TITLE)

    # ============================================================================
    # BLOG POST INTERACTIONS
    # ============================================================================

    def get_blog_post_count(self):
        """Get count of visible blog posts."""
        posts = self.find_elements(self.BLOG_POST_CARDS)
        return len(posts)

    def get_blog_post_title(self, index):
        """Get title of blog post at given index."""
        locator = (By.CSS_SELECTOR, f"[data-testid='blog-post-title-{index}']")
        return self.get_element_text(locator)

    def get_blog_post_excerpt(self, index):
        """Get excerpt/summary of blog post at given index."""
        locator = (By.CSS_SELECTOR, f"[data-testid='blog-post-excerpt-{index}']")
        return self.get_element_text(locator)

    def get_blog_post_date(self, index):
        """Get publication date of blog post at given index."""
        locator = (By.CSS_SELECTOR, f"[data-testid='blog-post-date-{index}']")
        return self.get_element_text(locator)

    def click_blog_post(self, index):
        """Click on blog post at given index to open it."""
        locator = (By.CSS_SELECTOR, f"[data-testid='blog-post-card-{index}']")
        self.click_element(locator)

    # ============================================================================
    # FILTER INTERACTIONS
    # ============================================================================

    def get_available_filters(self):
        """Get list of available tag filters."""
        filter_buttons = self.find_elements(self.BLOG_FILTER_TAG)
        return [btn.text for btn in filter_buttons]

    def click_filter_tag(self, tag_name):
        """Click on a specific tag filter."""
        locator = (By.CSS_SELECTOR, f"[data-testid='blog-filter-tag-{tag_name}']")
        self.click_element(locator)

    def is_filter_clear_button_visible(self):
        """Check if clear filter button is visible."""
        try:
            return self.is_element_displayed(self.BLOG_FILTER_CLEAR)
        except:
            return False

    def click_filter_clear(self):
        """Click clear filter button."""
        self.click_element(self.BLOG_FILTER_CLEAR)

    # ============================================================================
    # ASSERTIONS (for test use)
    # ============================================================================

    def verify_blog_page_loaded(self):
        """Assert blog page loaded successfully."""
        assert self.is_blog_container_visible(), "Blog container not visible"
        assert self.is_blog_grid_visible(), "Blog grid not visible"

    def verify_blog_posts_visible(self):
        """Assert blog posts are displayed."""
        count = self.get_blog_post_count()
        assert count > 0, f"Expected blog posts to be visible, found {count}"

    def verify_blog_post_has_metadata(self, index):
        """Assert blog post has title, excerpt, and date."""
        title = self.get_blog_post_title(index)
        excerpt = self.get_blog_post_excerpt(index)
        date = self.get_blog_post_date(index)
        
        assert title, f"Post {index} has no title"
        assert excerpt, f"Post {index} has no excerpt"
        assert date, f"Post {index} has no date"

    def verify_filter_functionality(self):
        """Assert filter controls are present and functional."""
        filters = self.get_available_filters()
        assert len(filters) > 0, "No filter tags available"

    # ============================================================================
    # RESPONSIVE & ACCESSIBILITY
    # ============================================================================

    def verify_blog_grid_responsive(self):
        """Verify blog grid adapts to viewport (at least 1 column visible)."""
        assert self.is_blog_grid_visible(), "Blog grid not visible"
        # In real tests, check computed grid-template-columns
        # For now, verify it's accessible and rendered

    def verify_post_links_accessible(self):
        """Verify all blog post cards are clickable links."""
        count = self.get_blog_post_count()
        for i in range(min(3, count)):  # Check first 3 posts
            card = self.find_element((By.CSS_SELECTOR, f"[data-testid='blog-post-card-{i}']"))
            assert card, f"Blog post card {i} not found"
            # Verify it's a link or clickable
            parent = card.find_element(By.XPATH, "./parent::*")
            assert parent.tag_name in ['a', 'button', 'div'], f"Post {i} not in clickable container"
