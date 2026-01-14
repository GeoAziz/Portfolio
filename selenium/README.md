# SELENIUM E2E TESTING FRAMEWORK - QUICK START GUIDE

**Portfolio E2E Test Suite**  
Status: ✅ Framework deployment in progress  
Last Updated: January 13, 2026

---

## 📋 QUICK START (5 minutes)

### 1️⃣ Initial Setup

```bash
# Navigate to selenium directory
cd selenium

# Create virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
# OR
venv\Scripts\activate            # Windows

# Install dependencies
pip install -r requirements.txt

# Create configuration file
cat > .env << EOF
BASE_URL=http://localhost:9002
HEADLESS=False
BROWSER_WIDTH=1024
BROWSER_HEIGHT=768
IMPLICIT_WAIT=10
EXPLICIT_WAIT=15
EOF
```

### 2️⃣ Start Development Server

In a new terminal (at portfolio root):

```bash
npm run dev
# Starts on http://localhost:9002
```

### 3️⃣ Run First Test

```bash
cd selenium
source venv/bin/activate
pytest tests/test_smoke.py -v --headed
```

**Expected Output:**
```
tests/test_smoke.py::test_home_page_loads PASSED
tests/test_smoke.py::test_hero_section_visible PASSED
tests/test_smoke.py::test_explore_button_clickable PASSED

============== 3 passed in 2.34s ==============
```

✅ **You're up and running!**

---

## 📁 DIRECTORY STRUCTURE

```
selenium/
├── docs/
│   ├── TEST_STRATEGY.md           ← Read this first!
│   ├── TEST_MATRIX.md             ← Coverage mapping
│   ├── PASS_FAIL_CRITERIA.md      ← Acceptance standards
│   └── EXECUTION_PLAN.md          ← Workflow guide
├── page_objects/
│   ├── base_page.py               ← Base class (common methods)
│   ├── home_page.py               ← Home page interactions
│   └── [other pages...]
├── tests/
│   ├── conftest.py                ← Pytest fixtures & config
│   ├── test_smoke.py              ← P0 tests (critical path)
│   ├── test_critical_path.py      ← P1 tests (full workflows)
│   ├── test_features.py           ← P2 tests (feature-specific)
│   └── test_edge_cases.py         ← P3 tests (boundary conditions)
├── utils/
│   ├── waits.py                   ← Smart wait strategies
│   ├── selectors.py               ← Centralized CSS selectors
│   └── test_data.py               ← Test data management
├── reports/                        ← Test execution reports (auto-generated)
├── screenshots/                    ← Failure screenshots (auto-generated)
├── requirements.txt               ← Python dependencies
├── .env                           ← Configuration (create locally)
└── README.md                      ← This file
```

---

## 🧪 TEST LAYERS

### P0 - SMOKE TESTS (Run Every Commit)
**Time:** 2 minutes | **Coverage:** Critical path only

```bash
pytest tests/test_smoke.py -v
```

**Tests:** Home loads, navigation works, CTAs clickable, no errors

---

### P1 - CRITICAL PATH (Run Every PR)
**Time:** 7 minutes | **Coverage:** All major flows

```bash
pytest tests/test_critical_path.py -v
```

**Tests:** Contact form, blog posts, project cards, auth flow

---

### P2 - FEATURE TESTS (Run Before Deployment)
**Time:** 5 minutes | **Coverage:** Enhanced functionality

```bash
pytest tests/test_features.py -v
```

**Tests:** Animations, 3D models, admin dashboard, user profile

---

### P3 - EDGE CASES (Run Weekly)
**Time:** 8 minutes | **Coverage:** Boundary conditions

```bash
pytest tests/test_edge_cases.py -v
```

**Tests:** Form validation edge cases, keyboard nav, responsive

---

## 🎯 COMMON COMMANDS

### Run All Tests
```bash
cd selenium
source venv/bin/activate
pytest tests/ -v
```

### Run Specific Test
```bash
pytest tests/test_smoke.py::test_home_page_loads -v
```

### Run Tests Matching Pattern
```bash
pytest tests/ -v -k "contact"  # Run all contact-related tests
```

### Watch Browser (Debugging)
```bash
pytest tests/test_smoke.py -v --headed
# Removes --headless, shows browser window
```

### Generate HTML Report
```bash
pytest tests/ -v --html=reports/report.html
open reports/report.html  # macOS
# OR
xdg-open reports/report.html  # Linux
```

### Run in Parallel (Faster)
```bash
pytest tests/ -v -n auto
# Uses all CPU cores, reduces 10min to 2-3min
```

### Stop on First Failure
```bash
pytest tests/test_smoke.py -v -x
```

### Show Print Statements
```bash
pytest tests/test_smoke.py -v -s
```

### Coverage Report
```bash
pytest tests/ --cov=../src --cov-report=html
open htmlcov/index.html
```

---

## 🔧 CONFIGURATION

### .env File Options

```bash
# Base URL (where app is running)
BASE_URL=http://localhost:9002

# Run in headless mode (no visible browser)
HEADLESS=True  # or False for debugging

# Browser window size
BROWSER_WIDTH=1024
BROWSER_HEIGHT=768

# Selenium wait timeouts
IMPLICIT_WAIT=10    # seconds
EXPLICIT_WAIT=15    # seconds

# Screenshots on failure
SCREENSHOT_ON_FAILURE=True

# Browser choice
BROWSER=chrome  # or firefox, edge
```

---

## 📊 DOCUMENTATION HIERARCHY

**You are here:** README.md (quick start)  
↓  
**Next:** [TEST_STRATEGY.md](docs/TEST_STRATEGY.md) (testing philosophy & architecture)  
↓  
**Then:** [TEST_MATRIX.md](docs/TEST_MATRIX.md) (per-page coverage mapping)  
↓  
**Then:** [PASS_FAIL_CRITERIA.md](docs/PASS_FAIL_CRITERIA.md) (acceptance standards)  
↓  
**Finally:** [EXECUTION_PLAN.md](docs/EXECUTION_PLAN.md) (workflow procedures)

---

## 🐛 TROUBLESHOOTING

### Issue: "ChromeDriver not found"
```bash
pip install webdriver-manager
# Auto-downloads matching ChromeDriver version
```

### Issue: "Connection refused" / "Port 9002 not available"
```bash
# Make sure dev server is running
npm run dev
# In another terminal, should see:
# ▲ Next.js 14.0.0
# - Local: http://localhost:9002
```

### Issue: "Element not found" / Timeout
```bash
# 1. Check .env file EXPLICIT_WAIT value
# 2. Increase if tests timeout too quickly
# 3. Check if element selector has changed
# 4. Run with --headed flag to watch browser
pytest tests/test_home.py::test_failing_test -v --headed
```

### Issue: Test passes locally but fails in CI/CD
```bash
# Likely timing/animation issue
# Add waits or custom wait conditions
# Check TEST_STRATEGY.md section on Next.js timing
```

### Issue: Tests run too slowly
```bash
# Use parallel execution
pytest tests/ -v -n auto

# OR run smaller test file
pytest tests/test_smoke.py -v
```

---

## 🚀 FIRST-TIME SETUP CHECKLIST

- [ ] Python 3.9+ installed
- [ ] Chrome browser latest version
- [ ] `venv` created and activated
- [ ] `pip install -r requirements.txt` completed
- [ ] `.env` file created with BASE_URL
- [ ] `npm run dev` running on port 9002
- [ ] `pytest tests/test_smoke.py -v --headed` runs successfully
- [ ] All P0 tests pass
- [ ] HTML report generated in `reports/report.html`

---

## 📚 LEARNING RESOURCES

### Understanding the Framework

1. **Page Object Model Pattern**
   - See `page_objects/base_page.py` for base class
   - See `page_objects/home_page.py` for example
   - All locators in class attributes
   - All interactions as methods
   - No assertions in page objects

2. **Test Structure**
   - See `tests/test_smoke.py` for examples
   - Import page object → create instance → call methods → assert
   - Clear, readable test names
   - Independent test execution

3. **Smart Waits**
   - `tests/utils/waits.py` has custom wait functions
   - Always use explicit waits (not `time.sleep()`)
   - Wait for element clickable, not just visible
   - Handle Next.js routing delays

4. **Selector Strategy**
   - Prefer `data-testid` (needs to be added to components)
   - Fall back to semantic HTML (button, form, nav)
   - Last resort: CSS classes (fragile)
   - Never use XPath unless absolutely necessary

### Adding a New Test

1. **Identify page** in TEST_MATRIX.md
2. **Create page object** if doesn't exist
3. **Define locators** as class attributes
4. **Create interaction methods** (click_button, fill_form, etc.)
5. **Write test** that calls methods and asserts results
6. **Run locally** until it passes
7. **Commit** and push for CI/CD

---

## 🤝 GETTING HELP

### Questions?

1. **Read the docs** - 90% of answers are there
   - TEST_STRATEGY.md for "why"
   - EXECUTION_PLAN.md for "how"
   - PASS_FAIL_CRITERIA.md for "what passes"

2. **Check existing tests** - Learn from examples
   - `test_smoke.py` - Simplest tests
   - `test_critical_path.py` - Full workflows
   - `test_edge_cases.py` - Complex scenarios

3. **Review page object** - See how interactions are built
   - Open `page_objects/home_page.py`
   - See pattern of locators and methods
   - Replicate pattern for new pages

4. **Consult the team** - No silly questions
   - Check issues/PRs for similar problems
   - Ask in #engineering Slack channel
   - Create GitHub issue if blockers

---

## 🎯 NEXT STEPS

Once you're comfortable with the framework:

1. **Implement Page Objects** for top 10 pages (See TEST_MATRIX.md)
2. **Write Critical Path Tests** (P1 layer)
3. **Set Up CI/CD** GitHub Actions workflow
4. **Add data-testid** attributes to components (coordinate with dev team)
5. **Expand coverage** to all 78 pages progressively

---

## 📈 SUCCESS METRICS

- ✅ All smoke tests pass (P0)
- ✅ All critical path tests pass (P1)
- ✅ Test execution < 10 minutes for full suite
- ✅ False positive rate < 1%
- ✅ New features tested within 1 sprint of implementation
- ✅ Team confident: "Tests pass = ship it"

---

## 📝 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 13, 2026 | Initial framework deployment |

---

## 📞 SUPPORT

For issues, questions, or suggestions:
- Create GitHub issue in repository
- Post in #engineering Slack
- Review [TEST_STRATEGY.md](docs/TEST_STRATEGY.md)

---

**Happy Testing! 🚀**

Next: Read [TEST_STRATEGY.md](docs/TEST_STRATEGY.md) for deep dive into testing philosophy.
