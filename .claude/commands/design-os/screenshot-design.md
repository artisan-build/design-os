# Screenshot Screen Design

You are helping the user capture screenshots of screen designs. The screenshots will be saved to the product folder for documentation purposes.

This command supports **scenarios** — multiple data states for a single screen design. If a section's `data.json` contains a `_scenarios` key, each scenario is screenshotted separately with its own data configuration.

## Prerequisites: Check for Playwright MCP

Before proceeding, verify that you have access to the Playwright MCP tool. Look for a tool named `browser_take_screenshot` or `mcp__playwright__browser_take_screenshot`.

If the Playwright MCP tool is not available, output this EXACT message to the user (copy it verbatim, do not modify or "correct" it):

---
To capture screenshots, I need the Playwright MCP server installed. Please run:

```
claude mcp add playwright npx @playwright/mcp@latest
```

Then restart this Claude Code session and run `/screenshot-design` again.
---

Do not substitute different package names or modify the command. Output it exactly as written above.

Do not proceed with the rest of this command if Playwright MCP is not available.

## Step 1: Identify Screen Designs

First, determine which screen design(s) to screenshot.

Read `/product/product-roadmap.md` to get the list of available sections, then check `src/sections/` to see what screen designs exist (`.tsx` files directly under each section directory, NOT in `components/`).

If the user specified a section, screenshot only that section's designs.

If no section was specified, screenshot ALL sections — iterate through every section that has screen design files.

For each section, also check if `product/sections/[section-id]/data.json` contains a `_scenarios` key.

### Scenario Format in data.json

When `data.json` includes a `_scenarios` array, each scenario defines a named data variation:

```json
{
  "_meta": { ... },
  "_scenarios": [
    {
      "name": "default",
      "description": "Standard populated view",
      "overrides": {}
    },
    {
      "name": "empty-state",
      "description": "No records yet",
      "overrides": {
        "coaches": [],
        "batchSummary": { "totalCoaches": 0, "eligibleCount": 0 }
      }
    },
    {
      "name": "locked",
      "description": "Camp has started, sections locked",
      "overrides": {
        "confirmedCoaches": [{ "...": "coach with campStarted: true" }]
      }
    }
  ],
  "coach": { ... },
  "events": [ ... ]
}
```

- `name` — Used in the screenshot filename (kebab-case)
- `description` — Logged during capture for context
- `overrides` — Deep-merged over the base data before rendering

If no `_scenarios` key exists, capture a single screenshot using the base data (the "default" scenario).

## Step 2: Start the Dev Server

Start the dev server yourself using Bash. Run `npm run dev` in the background so you can continue with the screenshot capture.

Do NOT ask the user if the server is running or tell them to start it. You must start it yourself.

After starting the server, wait a few seconds for it to be ready before navigating.

## Step 3: Delete Existing Screenshots

Before capturing new screenshots, delete any existing `.png` files in the section's product folder:

```bash
rm -f product/sections/[section-id]/*.png
```

This ensures stale screenshots from previous iterations are removed.

## Step 4: Capture Screenshots

Use the Playwright MCP tool to navigate to each screen design and capture screenshots.

### Setting Up

1. Resize the browser to desktop viewport: 1280px width, 900px height
2. The fullscreen URL pattern is: `http://localhost:3000/sections/[section-id]/screen-designs/[ScreenDesignName]/fullscreen`

### For Sections WITHOUT Scenarios

1. Navigate to the fullscreen URL
2. Wait for the page to fully load
3. Use `browser_take_screenshot` with `fullPage: true` to capture the entire scrollable page
4. Save with filename: `[section-id].png`
5. Copy to `product/sections/[section-id]/[section-id].png`

### For Sections WITH Scenarios

For each scenario defined in `_scenarios`:

1. The screen design preview wrapper needs to know which scenario to render. Use `browser_run_code` to set the scenario data on the page before capturing:

```js
async (page) => {
  // Navigate to the fullscreen URL
  await page.goto('http://localhost:3000/sections/[section-id]/screen-designs/[ScreenDesignName]/fullscreen');
  await page.waitForLoadState('networkidle');
  
  // Apply scenario overrides via window.__SCENARIO_OVERRIDES__
  await page.evaluate((overrides) => {
    window.__SCENARIO_OVERRIDES__ = overrides;
    // Dispatch a custom event so the component can react
    window.dispatchEvent(new CustomEvent('scenario-change'));
  }, scenarioOverrides);
  
  // Wait for re-render
  await page.waitForTimeout(500);
}
```

**Note:** If the preview wrapper doesn't support `__SCENARIO_OVERRIDES__`, fall back to capturing only the default state. Scenario support requires the preview wrapper to be updated to read from `window.__SCENARIO_OVERRIDES__` — this can be done incrementally as scenarios are defined.

**Simplified approach (recommended):** If scenarios aren't wired into the preview wrappers yet, just capture the single default screenshot for each screen design. When the user adds `_scenarios` to their data.json files AND updates the preview wrappers to support scenario switching, this command will automatically capture each scenario.

2. Capture with `fullPage: true`
3. Save with filename: `[section-id]-[scenario-name].png`
4. Copy to `product/sections/[section-id]/[section-id]-[scenario-name].png`

### Screenshot Specifications

- Capture at desktop viewport width (1280px)
- Use **full page screenshot** to capture the entire scrollable content
- PNG format for best quality
- One screenshot per screen design per scenario

### Sections with Multiple Screen Designs

Some sections have multiple preview wrappers (e.g., `coach-post-hire` has `CoachRsvp.tsx` and `AdminCamps.tsx`). Capture each one separately:

- `product/sections/coach-post-hire/coach-rsvp.png`
- `product/sections/coach-post-hire/admin-camps.png`

Use the screen design name (converted to kebab-case) as the filename.

## Step 5: Clean Up

After all screenshots are captured:

1. Remove any temporary screenshot files from the working directory
2. Close the browser
3. Kill the dev server (if you started it)

## Step 6: Confirm Completion

Let the user know what was captured:

"Screenshots captured for [N] sections ([M] total images):

- **[Section 1]** — [screen-design-name].png [+ scenario names if applicable]
- **[Section 2]** — [screen-design-name].png
...

All screenshots saved to `product/sections/[section-id]/`."

## Important Notes

- Start the dev server yourself — do not ask the user to do it
- Delete existing screenshots before capturing new ones
- Screenshots are saved to `product/sections/[section-id]/` alongside spec.md and data.json
- Use descriptive filenames: `[section-id].png` for single designs, `[screen-design-name].png` for sections with multiple designs, `[section-id]-[scenario-name].png` for scenarios
- Capture at a consistent viewport width (1280px) for documentation consistency
- Always capture full page screenshots to include all scrollable content
- Convert PascalCase screen design names to kebab-case for filenames (e.g., `AdminCamps` → `admin-camps`)

## Git: Commit

After saving all screenshots, commit the changes:

```bash
git add product/sections/ && git commit -m "Capture fresh screenshots for all sections"
```
