# EXECUTION PLAN - TEST DEPLOYMENT WORKFLOW

**Date:** January 13, 2026  
**Classification:** OPERATIONAL PROCEDURES  
**Purpose:** Step-by-step test execution workflow for all environments  
**Owner:** QA Engineering Division + Development Team

---

## I. ENVIRONMENT SETUP

### Local Development Environment

#### Prerequisites
- Python 3.9+ installed
- Chrome browser installed (latest version)
- ChromeDriver matching Chrome version
- Git access to repository
- 30 minutes for initial setup

#### Setup Steps

```bash
# 1. Clone repository (if not already done)
git clone https://github.com/GeoAziz/Portfolio.git
cd Portfolio

# 2. Create and activate virtual environment
python -m venv selenium/venv
source selenium/venv/bin/activate  # Windows: selenium\venv\Scripts\activate

# 3. Install dependencies
cd selenium
pip install -r requirements.txt

# 4. Verify installation
python -c "from selenium import webdriver; print('✅ Selenium installed')"
pytest --version  # Should show pytest 7.x+

# 5. Download ChromeDriver (automatic via webdriver-manager)
# No manual step needed - handled by tests

# 6. Create .env file for test configuration
cat > .env << EOF
BASE_URL=http://localhost:9002
HEADLESS=False
BROWSER_WIDTH=1024
BROWSER_HEIGHT=768
IMPLICIT_WAIT=10
EXPLICIT_WAIT=15
EOF

# 7. Start Next.js dev server in another terminal
npm run dev  # Starts on port 9002
```

### CI/CD Environment (GitHub Actions)

#### Automated Setup
- Python environment created by GitHub Actions
- Dependencies installed via `pip install -r requirements.txt`
- ChromeDriver auto-downloaded
- Headless mode enabled automatically
- Reports uploaded as artifacts

#### Configuration
```yaml
# .github/workflows/e2e-tests.yml (to be created)
name: E2E Tests
on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: |
          cd selenium
          pip install -r requirements.txt
      - name: Start dev server
        run: npm run dev &
        working-directory: .
      - name: Wait for server
        run: sleep 5
      - name: Run tests
        run: |
          cd selenium
          pytest tests/ -v --html=reports/report.html --headless
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-reports
          path: selenium/reports/
```

---

## II. TEST EXECUTION WORKFLOWS

### Workflow A: Local Development Testing (DURING FEATURE DEVELOPMENT)

**When:** While working on a new feature  
**Frequency:** Multiple times per day  
**Time commitment:** 5-10 minutes

#### Steps

```bash
# 1. Make code changes in main codebase
# (e.g., modify home page component)

# 2. Navigate to selenium directory
cd selenium

# 3. Activate virtual environment (if not already active)
source venv/bin/activate

# 4. Run relevant test suite
# Option A: Run only affected page tests (FASTEST)
pytest tests/test_home.py -v --headed
# --headed: Watch browser in real-time
# -v: Verbose output

# Option B: Run all smoke tests (5-7 minutes)
pytest tests/test_smoke.py -v

# 5. Review output
# PASSED: Continue development
# FAILED: Review failure message + screenshot
```

#### Expected Output

```
tests/test_home.py::test_home_page_loads PASSED           [10%]
tests/test_home.py::test_hero_title_visible PASSED        [20%]
tests/test_home.py::test_explore_button_clickable PASSED  [30%]
tests/test_home.py::test_explore_button_navigates PASSED  [40%]

============== 4 passed in 2.34s ==============
✅ All tests passed. Ready for commit.
```

#### Troubleshooting

| Issue | Solution |
|-------|----------|
| "ChromeDriver not found" | `pip install webdriver-manager` |
| "Connection refused" | `npm run dev` (start Next.js server) |
| Port 9002 in use | `lsof -i :9002` and kill process |
| Test timeout | Increase `EXPLICIT_WAIT` in .env |
| Browser window doesn't appear | Remove `--headless` flag |

---

### Workflow B: Pre-Commit Testing (BEFORE PUSHING)

**When:** Before `git push`  
**Frequency:** Once per commit  
**Time commitment:** 10-15 minutes

#### Steps

```bash
# 1. Ensure changes are saved
git status

# 2. Run full smoke test suite
cd selenium
source venv/bin/activate
pytest tests/test_smoke.py -v --html=reports/report.html

# 3. Check for test failures
# If ALL pass → proceed to step 4
# If ANY fail → review failure details and fix code

# 4. Check TypeScript (from portfolio root)
npm run typecheck

# 5. Commit and push
git add .
git commit -m "feat: [description of changes]"
git push origin [branch-name]
```

#### Report Review

After tests complete, open report:
```bash
open selenium/reports/report.html  # macOS
# OR
xdg-open selenium/reports/report.html  # Linux
# OR
start selenium/reports/report.html  # Windows
```

#### Failure Handling

If test fails:
```
test_home.py::test_explore_button_navigates FAILED

Traceback:
  AssertionError: assert "/projects" in driver.current_url
  
Screenshot saved to: screenshots/test_explore_button_navigates_20260113_143022.png
```

**Action:**
1. Review screenshot
2. Check component code for changes
3. Update test selector if component changed
4. OR fix component code if test is correct
5. Re-run test until passes

---

### Workflow C: Pull Request Testing (CI/CD AUTOMATIC)

**When:** Push to branch with open PR  
**Frequency:** Automatic on every push  
**Responsibility:** GitHub Actions

#### Automated Steps

1. GitHub Actions triggered on push
2. Python environment created
3. Dependencies installed
4. Development server started
5. Test suite runs (headless Chrome)
6. Report uploaded as artifact
7. Comment added to PR with results

#### PR Comment Template

```markdown
### E2E Test Results ✅

✅ **All tests passed** (48/48)
- Smoke tests (P0): 5/5 passed (2m 14s)
- Critical path (P1): 43/43 passed (6m 52s)

📊 **Coverage:** 85% of portfolio pages
⏱️ **Total time:** 9m 06s
🌐 **Browser:** Chrome Headless 120.0

[View detailed report](https://github.com/GeoAziz/Portfolio/actions/runs/12345678)

---

**Ready for merge** ✨
```

#### Failure Notification

```markdown
### E2E Test Results ❌

❌ **Tests failed** (46/48 passed)

**Failures:**
- `test_contact_form_submission` FAILED
- `test_blog_post_loads` FAILED

📋 **Details:**
See [test report](https://github.com/.../artifacts/12345678) for screenshots

**Action required:** Fix failing tests before merge.
```

---

### Workflow D: Production Deployment Testing (BEFORE RELEASE)

**When:** Before merging to main and deploying  
**Frequency:** Once per release  
**Time commitment:** 15-20 minutes

#### Steps

```bash
# 1. Create release branch
git checkout -b release/v1.2.3

# 2. Run FULL test suite (P0 + P1 + P2)
cd selenium
source venv/bin/activate
pytest tests/test_smoke.py tests/test_critical_path.py tests/test_features.py \
  -v \
  --html=reports/release_report.html \
  --tb=short

# 3. Check coverage
pytest tests/ --cov=../src --cov-report=html

# 4. Run cross-browser tests
pytest tests/test_smoke.py -v -m chrome
pytest tests/test_smoke.py -v -m firefox

# 5. Performance tests
pytest tests/test_performance.py -v

# 6. Review all reports
open selenium/reports/release_report.html
open htmlcov/index.html

# 7. If all pass, sign off for deployment
echo "✅ Release candidate approved"
```

#### Sign-Off Checklist

- [ ] Smoke tests: 100% pass
- [ ] Critical path tests: 100% pass
- [ ] Feature tests: 100% pass
- [ ] No new console errors
- [ ] Performance benchmarks met
- [ ] Cross-browser validation complete
- [ ] Accessibility scan passed
- [ ] Mobile/tablet responsive verified

---

## III. FAILURE TRIAGE & RESOLUTION

### Step 1: Capture Failure Information

When a test fails, automatic capture happens:

```
FAILED tests/test_home.py::test_explore_button_navigates
├── Error message: AssertionError: assert "/projects" in driver.current_url
├── Screenshot: screenshots/test_explore_button_navigates_fail_20260113_143022.png
├── Console log: logs/test_explore_button_navigates_20260113_143022.log
├── Browser: Chrome 120.0
├── Resolution: 1024x768
└── Timestamp: 2026-01-13 14:30:22 UTC
```

### Step 2: Classify Failure Type

| Type | Indicator | Example |
|------|-----------|---------|
| **Infrastructure** | Server error, timeout | "Connection refused", "504 Gateway Timeout" |
| **Flaky** | Intermittent, inconsistent | "Passed once, failed twice, passed again" |
| **Code Issue** | Consistent failure in code | Button not clickable, wrong text |
| **Selector Broken** | Element not found | "Element not found by data-testid" |
| **Next.js Routing** | Navigation fails | "URL didn't change after click" |
| **Environment** | Config issue | "Port 9002 not available" |

### Step 3: Investigate & Fix

#### Infrastructure Failure
```
Error: Connection refused on port 9002
→ Action: Start dev server (npm run dev)
→ Re-run test
```

#### Flaky Test
```
Error: Intermittent "element not visible"
→ Likely cause: Animation timing or race condition
→ Fix: Add explicit wait or increase timeout
→ Re-run 5x to verify stability
```

#### Code Issue
```
Error: Button click doesn't navigate
→ Investigate: Did button onClick handler change?
→ Check: Component code vs test expectations
→ Fix: Update component code
→ Re-run test
```

#### Selector Broken
```
Error: Element not found by data-testid="explore-button"
→ Investigate: Was component renamed or removed?
→ Action: Update POM locator OR update component
→ Re-run test
```

### Step 4: Document Resolution

Update failure report:

```markdown
### Failure Resolution

**Original Error:**
Button click did not navigate to projects page

**Root Cause:**
Button onClick handler was using <a> instead of Next Link component,
causing full page reload instead of client-side navigation.

**Fix Applied:**
- Changed `<a href="/projects">` to `<Link href="/projects">`
- Test now waits for URL change using custom wait function

**Verification:**
- ✅ Test passes locally
- ✅ Test passes in CI/CD
- ✅ Manual verification: navigation works

**Prevention:**
Added test case to verify Next.js routing specifically.
```

---

## IV. MAINTENANCE SCHEDULE

### Daily (During Active Development)
- Run smoke tests (P0)
- Review any failures immediately
- Update selectors if components changed

### Weekly
- Run full critical path suite (P0 + P1)
- Review flaky tests
- Update test documentation
- Verify responsive breakpoints

### Monthly
- Run full test suite (P0 + P1 + P2 + P3)
- Update coverage report
- Evaluate new tools/approaches
- Update TEST_MATRIX.md with progress

### Quarterly
- Full strategy review
- Tool evaluation
- Process improvements
- Team training/documentation

---

## V. REPORTING & METRICS

### Daily Test Report

```
Date: January 13, 2026
Smoke Tests (P0):   ✅ 5/5 passed (2m 14s)
Critical Path (P1): ✅ 48/48 passed (6m 52s)
Total:              ✅ 53/53 passed (9m 06s)

No failures.
New tests added: 0
Flaky tests: 0
```

### Weekly Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Test Pass Rate | 95%+ | 100% | ✅ |
| Smoke test time | < 3 min | 2m 14s | ✅ |
| Critical path time | < 8 min | 6m 52s | ✅ |
| Flaky tests | 0 | 0 | ✅ |
| Coverage | 85%+ | 87% | ✅ |

### Failure Trend Report

```
Week of Jan 8-14:
- Total runs: 42
- Passed: 42 (100%)
- Failed: 0 (0%)
- Flaky: 0

Trend: ↘️ Excellent (downward flaky trend)
```

---

## VI. TEAM COMMUNICATION PROTOCOL

### When Tests Fail on Main Branch

**Immediate (Within 5 minutes):**
1. Post in Slack #engineering channel
2. Tag relevant developers
3. Include test failure details + screenshot

**Example Message:**
```
🚨 E2E Test Failure on main

Test: test_contact_form_submission
Error: Form submit button not responding
Screenshot: [link]
Branch: main
Severity: 🔴 Blocker

@devmahnx - needs immediate fix
```

**Within 1 hour:**
1. Either: Fix applied + pushed + tests re-run
2. Or: Root cause analyzed + plan shared

**Within 24 hours:**
1. If not yet fixed, escalate to tech lead
2. Consider rolling back commit

### When Tests Fail on PR

**Immediate (Within push):**
1. GitHub Actions adds comment to PR
2. No manual notification needed
3. PR blocked from merge if tests fail

**Developer Action:**
1. Review failure details
2. Fix code or test
3. Push fix (re-triggers CI)
4. Repeat until passes

---

## VII. QUICK REFERENCE COMMANDS

```bash
# Setup
cd selenium && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Run tests
pytest tests/test_smoke.py -v                    # Smoke tests only
pytest tests/test_smoke.py::test_home -v         # Specific test
pytest tests/ -v -k "navigation"                 # Tests matching pattern
pytest tests/ -v --headed                        # Watch browser
pytest tests/ -v --tb=short                      # Short error output
pytest tests/ -v --tb=long                       # Detailed error output

# Reports
pytest tests/ --html=reports/report.html         # Generate HTML report
pytest tests/ --cov=../src --cov-report=html    # Coverage report

# Debug
pytest tests/test_home.py -v -s --pdb            # Drop into debugger on fail
pytest tests/test_home.py -v -x                  # Stop on first failure
pytest tests/ -v --maxfail=3                     # Stop after 3 failures

# Parallel execution
pytest tests/ -v -n auto                         # Use all CPU cores

# CI/CD simulation
HEADLESS=True pytest tests/ -v                   # Headless mode (like CI)
```

---

## VIII. ESCALATION MATRIX

| Scenario | Owner | Action | Timeline |
|----------|-------|--------|----------|
| Single test fails on PR | Dev | Fix code, re-run, merge when pass | 1-4 hours |
| Multiple tests fail on PR | Dev + Lead | Investigate, discuss approach | 1-2 hours |
| Tests fail on main | Lead | Decide: hotfix or rollback | 30 minutes |
| Repeated flakiness | QA Lead | Root cause analysis, fix framework | 1-3 days |
| Test coverage gap | Tech Lead | Prioritize new tests | Next sprint |

---

**Document Version:** 1.0  
**Last Updated:** January 13, 2026  
**Next Review:** February 13, 2026

---

## Quick Start for New Team Members

```
1. Follow "Local Development Environment" setup above
2. Read TEST_STRATEGY.md (understanding)
3. Run: pytest tests/test_smoke.py -v --headed
4. Watch tests execute in real browser
5. Read corresponding test code to understand patterns
6. Ask questions! This is a learning phase.
```
