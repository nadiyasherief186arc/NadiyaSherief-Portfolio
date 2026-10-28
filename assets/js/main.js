/**
 * NADIYA SHERIEF - PORTFOLIO INTERACTIVITY SCRIPT
 * Handles theme toggling, interactive test simulator, project filtering,
 * modal dialogs, copy-to-clipboard, and smooth scroll spy.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initMouseSpotlight();
  initProjectFilters();
  initQATestRunner();
  initModals();
  initContactAndCopy();
});

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('ns_portfolio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ns_portfolio_theme', newTheme);
    showToast(`Switched to ${newTheme} theme`);
  });
}

/* ==========================================================================
   2. NAVBAR & SCROLL SPY
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navLinksMenu');

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when link clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Scroll Event
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy Active Link
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. MOUSE SPOTLIGHT GLOW
   ========================================================================== */
function initMouseSpotlight() {
  const spotlight = document.getElementById('mouseSpotlight');
  if (!spotlight || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    spotlight.style.left = `${e.clientX}px`;
    spotlight.style.top = `${e.clientY}px`;
  });
}

/* ==========================================================================
   4. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE QA TEST RUNNER PLAYGROUND
   ========================================================================== */
const testSuitesData = {
  orangehrm: {
    name: "OrangeHRM Automation Suite (TestNG / POM)",
    description: "Validates Login, explicit synchronization, PIM personnel creation, and Dashboard telemetry.",
    steps: [
      { name: "Browser Initialization (Chrome Headless)", time: "85ms" },
      { name: "POM Navigation -> LoginPage.open()", time: "112ms" },
      { name: "Explicit Wait for username & password input visibility", time: "42ms" },
      { name: "Enter credentials & submit -> LoginPage.loginAsAdmin()", time: "95ms" },
      { name: "Assertion: Assert.assertTrue(Dashboard.isDisplayed())", time: "38ms" },
      { name: "POM Navigation -> PIMModule.verifyEmployeeList()", time: "74ms" },
      { name: "LeaveModule: Validate pending leave requests table", time: "81ms" }
    ],
    code: `// TestNG Page Object Model Execution
@Test(priority = 1)
public void testOrangeHRMAdminLogin() {
    LoginPage loginPage = new LoginPage(driver);
    loginPage.enterUsername("Admin");
    loginPage.enterPassword("admin123");
    DashboardPage dashboard = loginPage.clickLogin();
    Assert.assertTrue(dashboard.isHeaderVisible(), "Dashboard Header failed to render");
}`
  },
  playwright: {
    name: "Playwright UI Interactions & Events Suite",
    description: "Tests drag & drop, file uploads, multiple tabs/popups, mouse hover tooltips, and keyboard events.",
    steps: [
      { name: "Playwright Context creation with Chromium", time: "60ms" },
      { name: "Drag & Drop: locator.dragTo(targetDropZone)", time: "120ms" },
      { name: "Mouse Hover: locator.hover() & assert tooltip visible", time: "45ms" },
      { name: "Multi-window handling: waitForEvent('popup')", time: "140ms" },
      { name: "File Upload: setInputFiles(['testDoc.pdf'])", time: "90ms" },
      { name: "Keyboard Action: pressSequentially('QA Automation')", time: "65ms" }
    ],
    code: `// Playwright Web Interaction Test
test('should handle drag-and-drop & multi-window', async ({ page, context }) => {
    await page.locator('#sourceElement').dragTo(page.locator('#targetZone'));
    await expect(page.locator('#dropFeedback')).toHaveText('Success');
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.click('#openTabBtn')
    ]);
    await expect(newPage).toHaveTitle(/Verification/);
});`
  },
  saucedemo: {
    name: "Sauce Demo (Swag Labs) E-Commerce Test Matrix",
    description: "End-to-end testing of inventory sorting, cart state persistence, and checkout calculations.",
    steps: [
      { name: "Test Case TC_SD_01: Valid user authentication", time: "40ms" },
      { name: "Test Case TC_SD_02: Locked out user negative test", time: "35ms" },
      { name: "Test Case TC_SD_04: Product catalog price sort (low-high)", time: "62ms" },
      { name: "Test Case TC_SD_05: Add 3 items to Cart & verify badge count", time: "48ms" },
      { name: "Test Case TC_SD_08: Step 1 Checkout information validation", time: "55ms" },
      { name: "Test Case TC_SD_10: Order completion summary & confirmation", time: "50ms" }
    ],
    code: `// Manual & Functional Test Matrix Check
Scenario: E-Commerce Complete Purchase Journey
  Given User is authenticated on Swag Labs portal
  When User adds items [Backpack, Bike Light] to cart
  And Proceeds through multi-step checkout with valid postal data
  Then Order summary tax must calculate correctly at 8%
  And Final confirmation message "Thank you for your order" must display`
  },
  api_postman: {
    name: "REST API Validation Suite (Postman / REST-Assured)",
    description: "Evaluates HTTP status codes, JSON payload schema assertions, and response latencies.",
    steps: [
      { name: "GET /api/v1/health -> Assert Status Code 200 OK", time: "65ms" },
      { name: "POST /api/v1/auth/login -> Assert Bearer token in body", time: "110ms" },
      { name: "GET /api/v1/employees/profile -> Schema assertion passed", time: "85ms" },
      { name: "POST /api/v1/leave/apply -> Payload assertion 201 Created", time: "92ms" },
      { name: "Performance check: Response time < 250ms threshold", time: "40ms" }
    ],
    code: `// Postman API Test Script
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});
pm.test("Response contains valid auth token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.be.a('string');
});`
  }
};

function initQATestRunner() {
  const suiteSelect = document.getElementById('playgroundSuiteSelect');
  const runBtn = document.getElementById('runTestSuiteBtn');
  const suiteNameEl = document.getElementById('playgroundSuiteName');
  const suiteDescEl = document.getElementById('playgroundSuiteDesc');
  const stepsContainer = document.getElementById('playgroundStepsContainer');
  const consoleLogs = document.getElementById('playgroundConsoleLogs');
  const clearBtn = document.getElementById('clearConsoleBtn');

  if (!suiteSelect || !runBtn) return;

  function loadSuite(key) {
    const data = testSuitesData[key];
    if (!data) return;

    suiteNameEl.textContent = data.name;
    suiteDescEl.textContent = data.description;

    stepsContainer.innerHTML = '';
    data.steps.forEach((step, idx) => {
      const stepRow = document.createElement('div');
      stepRow.className = 'assertion-step';
      stepRow.id = `step-row-${idx}`;
      stepRow.innerHTML = `
        <div class="assertion-name">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
          <span>${step.name}</span>
        </div>
        <span class="assertion-status-badge status-idle">IDLE</span>
      `;
      stepsContainer.appendChild(stepRow);
    });
  }

  suiteSelect.addEventListener('change', (e) => {
    loadSuite(e.target.value);
    logToConsole(`Switched active suite to: [${e.target.value.toUpperCase()}]`, 'info');
  });

  // Initial load
  loadSuite(suiteSelect.value);

  let isRunning = false;

  runBtn.addEventListener('click', async () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    runBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      Executing Tests...
    `;

    const activeKey = suiteSelect.value;
    const suite = testSuitesData[activeKey];

    logToConsole(`------------------------------------------------`, 'dim');
    logToConsole(`[INIT] Initializing Test Runner for: ${suite.name}`, 'info');
    logToConsole(`[ENV] Browser: Chromium Headless | OS: Windows | Runner: TestNG/Playwright`, 'dim');

    // Reset all steps to idle
    suite.steps.forEach((_, idx) => {
      const row = document.getElementById(`step-row-${idx}`);
      if (row) {
        const badge = row.querySelector('.assertion-status-badge');
        badge.className = 'assertion-status-badge status-idle';
        badge.textContent = 'QUEUED';
      }
    });

    let startTime = Date.now();

    for (let i = 0; i < suite.steps.length; i++) {
      const step = suite.steps[i];
      const row = document.getElementById(`step-row-${i}`);
      const badge = row.querySelector('.assertion-status-badge');

      badge.className = 'assertion-status-badge status-running';
      badge.textContent = 'RUNNING';

      logToConsole(`[EXEC] Step ${i + 1}/${suite.steps.length}: ${step.name}...`, 'info');

      // Simulated step execution delay
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300));

      badge.className = 'assertion-status-badge status-passed';
      badge.textContent = 'PASSED';
      logToConsole(`[PASS] \u2714 ${step.name} completed in ${step.time}`, 'success');
    }

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    logToConsole(`[SUMMARY] Suite execution finished: ${suite.steps.length} passed, 0 failed.`, 'success');
    logToConsole(`[RESULT] Test Suite Status: 100% PASSED (${totalDuration}s)`, 'success');
    logToConsole(`------------------------------------------------`, 'dim');

    showToast(`Test Suite: 100% Passed (${suite.steps.length}/${suite.steps.length} steps)`);

    runBtn.disabled = false;
    runBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
      Run Test Suite
    `;
    isRunning = false;
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      consoleLogs.innerHTML = '';
      logToConsole(`Console cleared. Ready for next test run.`, 'dim');
    });
  }

  function logToConsole(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    const logLine = document.createElement('div');
    logLine.className = 'log-line';

    let prefixColor = 'log-prefix';
    if (type === 'success') prefixColor = 'log-success';
    if (type === 'dim') prefixColor = 'log-dim';

    logLine.innerHTML = `
      <span class="log-dim">[${time}]</span>
      <span class="${prefixColor}">${message}</span>
    `;
    consoleLogs.appendChild(logLine);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }
}

/* ==========================================================================
   6. MODAL SYSTEM (PROJECT DETAILS & RESUME VIEWER)
   ========================================================================== */
function initModals() {
  const modalOverlay = document.getElementById('globalModalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (!modalOverlay) return;

  function openModal(title, contentHtml) {
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach to Quick Resume Preview Button
  const previewResumeBtn = document.getElementById('quickResumePreviewBtn');
  if (previewResumeBtn) {
    previewResumeBtn.addEventListener('click', () => {
      openModal(
        'Nadiya Sherief - Official Resume Preview',
        `
        <div style="text-align: center; margin-bottom: 16px;">
          <p style="color: var(--text-secondary); margin-bottom: 12px;">
            Software Tester Resume • Generated & Verified for QA Positions
          </p>
          <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 14px;">
            <a href="assets/resume/Nadiya_Sherief_Resume.pdf" download="Nadiya_Sherief_Resume.pdf" class="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              Download PDF (270 KB)
            </a>
            <a href="assets/resume/resume.html" target="_blank" class="btn btn-secondary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
              Open in New Window
            </a>
          </div>
        </div>
        <iframe src="assets/resume/resume.html" style="width: 100%; height: 580px; border: 1px solid var(--border-subtle); border-radius: 8px;"></iframe>
        `
      );
    });
  }

  // Project Details Triggers
  const projectDetailBtns = document.querySelectorAll('.view-project-details-btn');
  projectDetailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      showProjectDetailsModal(projectId);
    });
  });

  function showProjectDetailsModal(id) {
    if (id === 'orangehrm') {
      openModal(
        'OrangeHRM - Test Automation Framework',
        `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <div style="margin-bottom: 18px;">
            <span class="project-overlay-badge badge-auto" style="position:static; display:inline-block; margin-bottom: 8px;">TestNG + Selenium + Playwright</span>
            <h4 style="color:var(--text-primary); font-size: 1.15rem; margin-bottom: 6px;">End-to-End Enterprise HRMS Automation</h4>
            <p>Developed an enterprise-grade automated testing framework adhering strictly to the Page Object Model (POM) pattern to separate web locators and UI actions from test business logic.</p>
          </div>
          
          <div style="background:var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-subtle);">
            <h5 style="color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom: 8px; font-size: 0.85rem;">KEY TESTING HIGHLIGHTS & ARCHITECTURE</h5>
            <ul style="padding-left: 20px; font-size: 0.88rem;">
              <li><strong>Object-Oriented Programming (OOP) Principles:</strong> Leveraged Java Inheritance (BaseTest, BasePage), Encapsulation (private locators, public action methods), and Polymorphism.</li>
              <li><strong>Module Coverage:</strong> Admin User Management, PIM Employee records, Leave allocation requests, Recruitment candidates, and Dashboard metrics.</li>
              <li><strong>Robust Synchronization:</strong> Applied explicit WebDriverWait conditions to handle dynamic asynchronous DOM states, eliminating flaky tests.</li>
              <li><strong>Assertion Standards:</strong> TestNG hard & soft assertions for title validations, toast messages, and table row counts.</li>
            </ul>
          </div>

          <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 14px;">
            <a href="https://github.com/nadiyasherief186arc/Orange-Automation-Playwright" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              View Repository on GitHub &rarr;
            </a>
          </div>
        </div>
        `
      );
    } else if (id === 'automation_practice') {
      openModal(
        'Automation Testing Practice Lab',
        `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <div style="margin-bottom: 18px;">
            <span class="project-overlay-badge badge-auto" style="position:static; display:inline-block; margin-bottom: 8px;">Playwright & Selenium Practice</span>
            <h4 style="color:var(--text-primary); font-size: 1.15rem; margin-bottom: 6px;">Complex Web Element & Event Automation</h4>
            <p>A rigorous automated test harness specifically built to test and validate complex browser interactions, asynchronous events, and edge cases.</p>
          </div>

          <div style="background:var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-subtle);">
            <h5 style="color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom: 8px; font-size: 0.85rem;">TEST SUITE CAPABILITIES</h5>
            <ul style="padding-left: 20px; font-size: 0.88rem;">
              <li><strong>Drag and Drop:</strong> Element relocation across dynamic bounding boxes with coordinate validation.</li>
              <li><strong>Mouse Hover & Context Menus:</strong> Simulating hover actions, secondary clicks, and double clicks.</li>
              <li><strong>Multiple Windows & Frames:</strong> Managing parent/child windows, popup contexts, and iframe switching.</li>
              <li><strong>File Upload Automation:</strong> Single and multi-file input injection via headless browser streams.</li>
              <li><strong>Keyboard Events:</strong> Modifier keys (Shift, Ctrl, Alt), Enter, Tab, and sequential text entry.</li>
            </ul>
          </div>

          <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 14px;">
            <a href="https://github.com/nadiyasherief186arc/Playwright_automation_Testing_Project" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              View Repository on GitHub &rarr;
            </a>
          </div>
        </div>
        `
      );
    } else if (id === 'saucedemo') {
      openModal(
        'Sauce Demo (Swag Labs) - Manual E-Commerce QA',
        `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <div style="margin-bottom: 18px;">
            <span class="project-overlay-badge badge-manual" style="position:static; display:inline-block; margin-bottom: 8px;">Manual Testing & Quality Assurance</span>
            <h4 style="color:var(--text-primary); font-size: 1.15rem; margin-bottom: 6px;">End-to-End Test Case Design & Defect Logging</h4>
            <p>Executed comprehensive manual functional, usability, and cross-browser compatibility testing against standard e-commerce workflows.</p>
          </div>

          <div style="background:var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-subtle);">
            <h5 style="color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom: 8px; font-size: 0.85rem;">TESTING METHODOLOGY & SCOPE</h5>
            <ul style="padding-left: 20px; font-size: 0.88rem;">
              <li><strong>SRS Requirement Analysis:</strong> Deconstructed user stories to determine positive, negative, and edge test scenarios.</li>
              <li><strong>Authentication Testing:</strong> Evaluated standard user, locked-out user, problem user, and performance glitch user personas.</li>
              <li><strong>Cart & Checkout Verification:</strong> Verified persistent state across sessions, badge count accuracy, tax arithmetic, and cancel/finish handlers.</li>
              <li><strong>Defect Documentation:</strong> Created defect tickets with steps to reproduce, actual vs expected results, screenshots, and severity rankings.</li>
            </ul>
          </div>

          <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 14px;">
            <a href="https://github.com/nadiyasherief186arc/Source-Demo" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              View Repository on GitHub &rarr;
            </a>
          </div>
        </div>
        `
      );
    } else if (id === 'obs_auto') {
      openModal(
        'OBS Automobiles Application - Manual Testing',
        `
        <div style="line-height: 1.7; color: var(--text-secondary);">
          <div style="margin-bottom: 18px;">
            <span class="project-overlay-badge badge-manual" style="position:static; display:inline-block; margin-bottom: 8px;">Multi-Role Manual QA</span>
            <h4 style="color:var(--text-primary); font-size: 1.15rem; margin-bottom: 6px;">Customer, Service Provider & Admin Module QA</h4>
            <p>Complete lifecycle testing based on detailed Software Requirement Specifications (SRS) for a multi-tenant automotive service platform.</p>
          </div>

          <div style="background:var(--bg-tertiary); padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-subtle);">
            <h5 style="color:var(--accent-cyan); font-family:var(--font-mono); margin-bottom: 8px; font-size: 0.85rem;">KEY COVERAGE & DEFECT LIFECYCLE</h5>
            <ul style="padding-left: 20px; font-size: 0.88rem;">
              <li><strong>SRS Analysis & Test Scenario Authoring:</strong> Derived 60+ functional test cases across Customer, Provider, and Admin portals.</li>
              <li><strong>Smoke & Sanity Testing:</strong> Verified deployment build stability for critical path user login and service appointment requests.</li>
              <li><strong>UI & Form Validation:</strong> Evaluated boundary values on vehicle registration numbers, date pickers, and contact forms.</li>
              <li><strong>JIRA Defect Tracking:</strong> Tracked bugs across states: New -> Open -> In Progress -> Resolved -> Verified & Closed.</li>
            </ul>
          </div>

          <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 14px;">
            <a href="https://github.com/nadiyasherief186arc/NadiyaSherief-Portfolio" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              View Repository on GitHub &rarr;
            </a>
          </div>
        </div>
        `
      );
    }
  }
}

/* ==========================================================================
   7. CONTACT, FORM SUBMISSION & COPY TO CLIPBOARD
   ========================================================================== */
function initContactAndCopy() {
  // Copy Email Buttons
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const email = 'nadiyasherief186@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Copied!
        `;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        showToast('Failed to copy email');
      });
    });
  });

  // Contact Form Handling
  const contactForm = document.getElementById('portfolioContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Create mailto link for seamless local email client trigger
      const mailtoLink = `mailto:nadiyasherief186@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
      
      showToast('Opening email client to send message...');
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 500);

      contactForm.reset();
    });
  }
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}
