# QA Automation Assignment - Almas Equities Login Test

This project contains automated tests for the Almas Equities login flow using **Playwright**, a modern web automation framework.

## Prerequisites

- **Node.js** (v16 or higher) — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

Verify your installation:
```powershell
node -v
npm -v
```

## Setup (First Time Only)

1. **Navigate to the project directory:**
   ```powershell
   cd "C:\Users\prasa\Desktop\QA Automation Assignment"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Install Playwright browsers:**
   ```powershell
   npx playwright install
   ```

   This downloads the necessary browser binaries (Chromium, Firefox, WebKit).

## Running the Tests

### Run all tests (headless mode)
```powershell
npm test
```

### Run tests with a visible browser (headed mode)
```powershell
npm run test:headed
```

### Run a specific test by name
```powershell
npx playwright test -g "load the login page"
```

### Run tests in debug mode (opens Playwright Inspector)
```powershell
npm run test:debug
```

### Run a single test file
```powershell
npx playwright test tests\login.spec.ts
```

## Test Execution Flow

The test suite includes:

1. **Load Login Page** — Verifies the login page loads and contains input fields.
2. **Enter Email and Wait for 2FA** — 
   - Fills in a sample email (`test@example.com`)
   - Clicks the Continue button
   - Waits for the 2FA/PIN input to appear on the same page
   - Asserts the 2FA UI is visible

3. **Verify Form Elements** — Checks that the login form has inputs and buttons.

## Test Output & Reports

After running tests, Playwright generates:
- **HTML Report**: `playwright-report/index.html`
- **Test Results**: `test-results/` directory

To view the HTML report:
```powershell
npx playwright show-report
```

## Configuration

The test configuration is in `playwright.config.ts`:
- **Base URL**: `https://one.almasequities.com/`
- **Timeout**: 30 seconds per test
- **Retries**: 0 (headless), 2 (CI)
- **Reporters**: HTML report

## Troubleshooting

### Tests timeout or fail to find elements
- Increase the timeout in the test: `{ timeout: 20000 }` (milliseconds)
- Check the generated screenshot in `debug-2fa-*.png` for what's on the page
- Ensure the email was filled and the button was clicked

### "Executable doesn't exist" error
Re-install Playwright browsers:
```powershell
npx playwright install
```

### Permission denied (on macOS/Linux)
Run with `sudo` or update permissions:
```bash
sudo npx playwright install
```

### Running tests single-threaded (less flaky)
```powershell
npx playwright test --workers=1
```

## Project Structure

```
.
├── tests/
│   └── login.spec.ts              # Login flow test cases
├── playwright.config.ts           # Test configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Test Assertions

The tests validate:
- ✓ Login page loads successfully
- ✓ Email input is visible and can be filled
- ✓ Continue button is visible and enabled
- ✓ After clicking, the 2FA/PIN input appears (with `data-testid="wf-input"`)
- ✓ 2FA container/heading shows "Check your email" or "We've sent a pin..."

## Notes

- **2FA Completion**: Tests stop after the 2FA prompt appears. Full login is not completed due to 2FA requirement.
- **Sample Email**: The test uses `test@example.com` as a sample. An actual email verification code is required to proceed.
- **In-Place Navigation**: The app updates the login form in-place (no page navigation) to show the 2FA UI.
- **Timeouts**: Default wait times are 10–20 seconds for elements to appear.

## Support

For issues or questions, check:
1. The generated test report: `npx playwright show-report`
2. Debug screenshots in the project root (`debug-2fa-*.png`)
3. The console output for detailed error messages

---

**Happy Testing! 🎭**
