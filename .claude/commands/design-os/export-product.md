# Export Product

You are helping the user export their complete product design as a handoff package for implementation. This generates all files needed to build the product in a separate codebase.

## Step 1: Check Prerequisites

Verify the minimum requirements exist:

**Required:**
- `/product/product-overview.md` — Product overview
- `/product/product-roadmap.md` — Sections defined
- At least one section with a `spec.md` in `product/sections/[section-id]/`

**Recommended (show warning if missing):**
- `/product/data-shape/data-shape.md` — Product entities
- `/product/data-shape/schema.md` — Database schema
- `/product/design-system/colors.json` — Color tokens
- `/product/design-system/typography.json` — Typography tokens
- `src/shell/components/AppShell.tsx` — Application shell
- `/product/architecture/tech-decisions.md` — Technical decisions
- At least one section with screen designs in `src/sections/[section-id]/`
- At least one section with an `acceptance.feature` file in `product/sections/[section-id]/` (Gherkin tests for exspec)

If required files are missing:

"To export your product, you need at minimum:
- A product overview (`/product-vision`)
- A roadmap with sections (`/product-roadmap`)
- At least one section with a specification

Please complete these first."

Stop here if required files are missing.

If recommended files are missing, show warnings but continue:

"Note: Some recommended items are missing:
- [ ] Product entities — Run `/data-shape` for consistent entity naming
- [ ] Database schema — Define column-level schema for implementation
- [ ] Design tokens — Run `/design-tokens` for consistent styling
- [ ] Application shell — Run `/design-shell` for navigation structure
- [ ] Technical decisions — Run `/create-tdd` for tech stack and architecture
- [ ] Screen designs — Run `/design-screen` for visual references
- [ ] Acceptance tests — Run `/write-acceptance-tests` for Gherkin behavior specs

You can proceed without these, but they help ensure a complete handoff."

## Step 2: Detect Export Mode

Examine the project to determine the implementation target:

1. Read `/product/architecture/tech-decisions.md` (if exists) for tech stack information
2. Check if screen design components exist in `src/sections/`

**If tech-decisions.md specifies a non-React/non-JS implementation target** (e.g., Laravel, Rails, Django, etc.):
- Set mode to `architecture-first`
- Screen design components are treated as **visual references** (like screenshots), not integration-ready code
- The export emphasizes specs, architecture docs, schemas, and configuration over component code

**If no tech stack is specified, or tech stack is React/Next.js/similar:**
- Set mode to `component-first`
- Screen design components are treated as **integration-ready code** to copy into the target codebase
- This is the original Design OS export behavior

Inform the user which mode was detected and why.

## Step 3: Gather Export Information

Read all relevant files:

1. `/product/product-overview.md` — Product name, description, features
2. `/product/product-roadmap.md` — List of sections in order
3. `/product/data-shape/data-shape.md` (if exists)
4. `/product/data-shape/schema.md` (if exists)
5. `/product/design-system/colors.json` (if exists)
6. `/product/design-system/typography.json` (if exists)
7. `/product/shell/spec.md` (if exists)
8. All files in `/product/architecture/` (not just tech-decisions.md)
9. `/product/after-build-client-discussion.md` (if exists)
10. For each section: `spec.md`, `data.json`, `types.ts`, `acceptance.feature` (if exists)
11. For each section's `data.json`, detect whether it uses the `_scenarios` structure (multiple named data states) so scenarios can be documented downstream
12. List screen design components in `src/sections/` and `src/shell/`
13. List screenshots (`.png` files) in `product/sections/` and `product/shell/`

## Step 4: Create Export Directory Structure

Create the `product-plan/` directory. The structure adapts based on export mode:

```
product-plan/
├── README.md                    # Quick start guide
├── product-overview.md          # Product summary (always provide)
│
├── prompts/                     # Ready-to-use prompts for coding agents
│   ├── one-shot-prompt.md       # Prompt for full implementation
│   └── section-prompt.md        # Prompt template for section-by-section
│
├── instructions/                # Implementation instructions
│   ├── one-shot-instructions.md # All milestones combined
│   └── incremental/             # For milestone-by-milestone implementation
│       ├── 01-foundation.md     # Design tokens, shell, database schema
│       ├── 02-[first-section].md
│       ├── 03-[second-section].md
│       └── ...
│
├── architecture/                # ALL architecture docs (not just tech-decisions)
│   ├── tech-decisions.md
│   └── [all other architecture files]
│
├── data-shapes/                 # Data contracts
│   ├── README.md
│   ├── data-shape.md            # Entity descriptions
│   ├── schema.md                # Column-level schema (if exists)
│   └── overview.ts              # Combined TypeScript interfaces
│
├── specs/                       # Raw section specifications
│   └── [section-id]/
│       ├── spec.md              # Full specification (always included)
│       └── types.ts             # TypeScript interfaces
│
├── design-system/               # Design tokens
│   ├── tokens.css
│   ├── tailwind-colors.md
│   └── fonts.md
│
├── shell/                       # Shell components/reference
│   ├── README.md
│   ├── spec.md                  # Shell specification
│   ├── components/              # (component-first mode only)
│   └── screenshot.png (if exists)
│
├── sections/                    # Section packages
│   └── [section-id]/
│       ├── README.md
│       ├── tests.md             # UI behavior test specs (companion to acceptance.feature)
│       ├── acceptance.feature   # Gherkin acceptance tests (if defined)
│       ├── components/          # (component-first mode) or
│       ├── screenshots/         # (architecture-first mode: visual references)
│       ├── types.ts
│       └── sample-data.json     # May include `_scenarios` for multiple data states
│
├── features/                    # Aggregated Gherkin acceptance tests (for exspec)
│   └── [section-id].feature     # One file per section with acceptance.feature defined
│
├── notes/                       # Additional context
│   └── after-build-discussion.md  # (if exists)
│
└── config/                      # Configuration specs (if exists)
    └── [config files referenced in architecture]
```

## Step 5: Generate product-overview.md

Create `product-plan/product-overview.md`:

```markdown
# [Product Name] — Product Overview

## Summary

[Product description from product-overview.md]

## Planned Sections

[Ordered list of sections from roadmap with descriptions]

1. **[Section 1]** — [Description]
2. **[Section 2]** — [Description]
...

## Product Entities

[If data shape exists: list entity names and brief descriptions]
[If not: "Entities to be defined during implementation"]

## Database Schema

[If schema.md exists:]
See `product-plan/data-shapes/schema.md` for full column-level schema definitions, indexes, enums, and JSON DTO shapes.

[If not:]
Database schema to be defined during implementation.

## Design System

**Colors:**
- Primary: [color or "Not defined"]
- Secondary: [color or "Not defined"]
- Neutral: [color or "Not defined"]

**Typography:**
- Heading: [font or "Not defined"]
- Body: [font or "Not defined"]
- Mono: [font or "Not defined"]

## Tech Stack

[If architecture/tech-decisions.md exists:]

**Framework:** [Framework name and version]
**Database:** [Database name]
**Frontend:** [Frontend framework]
**Hosting:** [Hosting platform]

See `product-plan/architecture/tech-decisions.md` for full technical decisions.

[If not:]

Tech stack decisions to be made during implementation.

## Architecture Documents

[List all architecture docs included in the export with brief descriptions]

- `architecture/tech-decisions.md` — ADRs and tech stack
- `architecture/[other-file].md` — [Brief description]
...

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, application shell, and database schema
2. **[Section 1]** — [Brief description]
3. **[Section 2]** — [Brief description]
...

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
```

## Step 6: Generate Milestone Instructions

Each milestone instruction file should begin with the following preamble (adapt based on export mode):

### Architecture-First Mode Preamble

```markdown
---

## About This Handoff

**What you're receiving:**
- Complete product specifications with user flows and business rules
- Database schema with column-level definitions, indexes, and enums
- Architecture decision records and integration documentation
- Screen design mockups as visual references (React components for layout/styling reference only)
- TypeScript interfaces defining the shape of data for each feature
- Sample data showing realistic test scenarios — some sections include `_scenarios` (multiple named data states like "Empty Form", "Completed", "Declined") that the UI must handle
- Gherkin acceptance tests in `features/` defining required behavior (run with [exspec](https://github.com/mnapoli/exspec))
- Configuration specs for business rules and thresholds

**Your job:**
- Build the application using the specified tech stack
- Implement the user flows described in each section's specification
- Use the screen designs as visual targets, not code to integrate
- Wire up integrations as described in the architecture docs
- Follow the database schema for data modeling
- Make the acceptance tests in `features/` pass — they are the executable definition of done
- Ensure every state described by `_scenarios` in sample data renders correctly

The specifications describe WHAT to build. The architecture docs describe HOW the pieces connect. The screen designs show what the UI should LOOK like. The acceptance tests describe how it should BEHAVE.

---
```

### Component-First Mode Preamble

```markdown
---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect — some sections include `_scenarios` (multiple named data states the UI must support, e.g. "Empty Form", "Completed", "Declined")
- Gherkin acceptance tests in `features/` defining required behavior (run with [exspec](https://github.com/mnapoli/exspec))
- Test specs (`tests.md`) focused on user-facing UI behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states
- Make the acceptance tests in `features/` pass — they are the executable definition of done
- Ensure every state described by `_scenarios` in sample data renders correctly

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---
```

### 01-foundation.md

Place in `product-plan/instructions/incremental/01-foundation.md`:

```markdown
# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`, all `architecture/` docs
> **Prerequisites:** None

[Include the appropriate preamble above]

## Goal

Set up the project foundation — design tokens, application shell, and database schema.

## What to Implement

### 1. Design Tokens

[If design tokens exist:]
Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

[If not:]
Define your own design tokens based on your brand guidelines.

### 2. Database Schema

[If schema.md exists:]
Set up the database schema as defined in `product-plan/data-shapes/schema.md`. This includes:

- Table definitions with column types and modifiers
- Indexes and unique constraints
- Enum definitions (PHP backed enums stored as strings/integers)
- JSON column DTO shapes

Create migrations for all tables. Refer to the schema notes for conventions (money in cents, no boolean columns, etc.).

[If not:]
Define your database schema based on the entity descriptions in `product-plan/data-shapes/data-shape.md`.

### 3. Application Shell

[If shell exists:]

**Architecture-first mode:**
Implement the application shell based on `product-plan/shell/spec.md`. Use the React components in `product-plan/shell/components/` as visual reference for layout, spacing, and responsive behavior. Rebuild using your target framework's component system.

**Component-first mode:**
Copy the shell components from `product-plan/shell/components/` to your project and wire up navigation.

[Shell specification details, nav items, etc.]

### 4. Configuration

[If architecture docs reference configuration files (e.g., settings-config.md):]
Set up application configuration as documented in the architecture files. Key configuration includes:

[List configuration sections and their purpose]

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-shapes/` — Schema and entity definitions
- `product-plan/shell/` — Shell specification and visual reference
- `product-plan/architecture/` — All architecture decisions and integration docs

## Done When

- [ ] Design tokens are configured
- [ ] Database migrations created for all tables
- [ ] Shell renders with navigation
- [ ] Navigation links to correct routes
- [ ] Configuration files created with documented values
- [ ] Responsive on mobile
```

### [NN]-[section-id].md (for each section)

Place in `product-plan/instructions/incremental/[NN]-[section-id].md`:

```markdown
# Milestone [N]: [Section Title]

> **Provide alongside:** `product-overview.md`, relevant `architecture/` docs
> **Prerequisites:** Milestone 1 (Foundation) complete, plus any prior section milestones

[Include the appropriate preamble]

## Goal

Implement the [Section Title] feature — [brief description from roadmap].

## Specification

The full specification for this section is at `product-plan/specs/[section-id]/spec.md`. Read it thoroughly before implementing — it contains:
- Detailed user flows with step-by-step interactions
- Business rules and edge cases
- UI requirements and layout guidance
- Configuration references
- Role-based visibility rules (if applicable)
- Time-boxing or locking rules (if applicable)

## Overview

[One paragraph describing what this section enables users to do. Extract from spec.md overview.]

**Key Functionality:**
- [Bullet point 1]
- [Bullet point 2]
- [Bullet point 3]

[List 3-6 key capabilities]

## Visual Reference

[Architecture-first mode:]
Screen design mockups are available in `product-plan/sections/[section-id]/`. These are React components built for visual reference — use them to understand the intended layout, styling, and component structure, then rebuild using your target framework.

[Component-first mode:]
Copy the section components from `product-plan/sections/[section-id]/components/`:
[List components with brief descriptions]

## Data Shapes

The components/views expect these data shapes (see `product-plan/specs/[section-id]/types.ts` for full definitions):

**Data types:**
[Key types from types.ts — show the main interfaces briefly]

**Callbacks / Actions:**
| Action | Triggered When |
|--------|---------------|
[List from Props interface]

## Multi-Page Sections

[If section has multiple pages/routes with different shell configurations:]

This section produces multiple routes:

| Page | Shell | Access |
|------|-------|--------|
| [Page 1] | [In-app / Standalone] | [Admin / Coach / Public] |
| [Page 2] | [In-app / Standalone] | [Admin / Coach / Public] |

[Describe each page's purpose and how they connect]

## Architecture References

[List relevant architecture docs for this section]
- `architecture/[file].md` — [Why it's relevant]

## Expected User Flows

[Extract from spec.md — include 2-4 key flows with steps and outcomes]

## Testing

Two test artifacts are provided for this section:

- **`product-plan/features/[section-id].feature`** — Gherkin acceptance tests. These are the authoritative behavior contract. Run them with [exspec](https://github.com/mnapoli/exspec): `npx exspec features/[section-id].feature`. The implementation is not done until these pass.
- **`product-plan/sections/[section-id]/tests.md`** — UI behavior test specs (companion notes describing exact labels, empty states, and assertions to verify).

[If the section's sample data uses `_scenarios`:]

## Data Scenarios

This section's sample data defines multiple states that the UI must handle:

[List each scenario name from `_scenarios` with a one-line description]

Each scenario is a complete data payload representing one state of the screen (e.g. empty form, completed form, error state). The implementation must render correctly for every scenario — verify by feeding each scenario's data into your components.

## Files to Reference

- `product-plan/specs/[section-id]/spec.md` — Full specification
- `product-plan/specs/[section-id]/types.ts` — TypeScript interfaces
- `product-plan/sections/[section-id]/` — Screen designs / visual reference
- `product-plan/sections/[section-id]/sample-data.json` — Test data (with scenarios if defined)
- `product-plan/sections/[section-id]/acceptance.feature` — Gherkin acceptance tests (also at `product-plan/features/[section-id].feature`)
- `product-plan/architecture/` — Relevant architecture docs

## Done When

- [ ] All user flows from the spec are implemented
- [ ] Data shapes match the TypeScript interfaces
- [ ] UI matches the visual reference
- [ ] Every scenario in `sample-data.json` renders correctly (if `_scenarios` is defined)
- [ ] Acceptance tests in `features/[section-id].feature` pass with exspec
- [ ] Edge cases from the spec are handled
- [ ] Responsive on mobile
- [ ] [Section-specific acceptance criteria from spec]
```

## Step 7: Generate one-shot-instructions.md

Create `product-plan/instructions/one-shot-instructions.md` by combining all milestone content into a single document. Include the preamble at the very top, then product-overview content, then all milestones in order without repeating the preamble.

## Step 8: Copy Architecture Files

Copy ALL files from `product/architecture/` to `product-plan/architecture/`. Do not limit to just `tech-decisions.md` — include every architecture document in the directory.

## Step 9: Copy Data Shape Files

Copy to `product-plan/data-shapes/`:
- `product/data-shape/data-shape.md` → `product-plan/data-shapes/data-shape.md`
- `product/data-shape/schema.md` → `product-plan/data-shapes/schema.md` (if exists)

Also generate the `README.md` and `overview.ts` as described in the original export flow.

## Step 10: Copy Section Specs

For each section, copy the raw specification files to `product-plan/specs/[section-id]/`:
- `product/sections/[section-id]/spec.md` → `product-plan/specs/[section-id]/spec.md`
- `product/sections/[section-id]/types.ts` → `product-plan/specs/[section-id]/types.ts`

These are the authoritative implementation references. The generated READMEs and instruction files summarize them, but the raw specs contain the full detail.

## Step 11: Copy and Transform Components

### Architecture-First Mode

Screen design components are visual references. For each section:

1. Copy components from `src/sections/[section-id]/components/` to `product-plan/sections/[section-id]/components/`
2. Transform import paths as usual
3. Copy any screenshots from `product/sections/[section-id]/*.png` to `product-plan/sections/[section-id]/`
4. In the section README, note that these are visual references, not integration-ready code

### Component-First Mode

Follow the original export behavior:

1. Copy from `src/sections/[section-id]/components/` to `product-plan/sections/[section-id]/components/`
2. Transform import paths:
   - `@/../product/sections/[section-id]/types` → `../types`
3. Remove Design OS-specific imports
4. Keep only the exportable components (not preview wrappers)

### Shell Components (both modes)

Copy from `src/shell/components/` to `product-plan/shell/components/`:
- Transform import paths
- Also copy `product/shell/spec.md` to `product-plan/shell/spec.md`

### Types and Sample Data (both modes)

- Copy `product/sections/[section-id]/types.ts` to `product-plan/sections/[section-id]/types.ts`
- Copy `product/sections/[section-id]/data.json` to `product-plan/sections/[section-id]/sample-data.json` — preserve the `_meta` and `_scenarios` keys exactly as written; downstream READMEs and instructions reference them by name.

## Step 11.5: Copy Acceptance Tests

For each section that has `product/sections/[section-id]/acceptance.feature`:

1. Copy it to `product-plan/sections/[section-id]/acceptance.feature` (keeps it adjacent to its spec and screen designs)
2. Also copy it to `product-plan/features/[section-id].feature` (the aggregated location exspec runs against — `npx exspec features/[section-id].feature`)

Both copies are intentional: the per-section copy keeps the test next to the spec it tests so a reader can browse them together; the `features/` copy is the runnable bundle that the implementation codebase will execute.

If a section has no `acceptance.feature`, skip it for that section but still create the `features/` directory if at least one section has acceptance tests defined. If no section has acceptance tests, omit `features/` entirely and note this in the completion summary so the user knows tests are missing.

## Step 12: Copy Additional Context Files

- If `product/after-build-client-discussion.md` exists, copy to `product-plan/notes/after-build-discussion.md`
- If any architecture docs reference configuration file structures (e.g., `config/staffing.php` content in settings-config.md), the architecture file itself serves as the config reference — no separate extraction needed.

## Step 13: Generate Section READMEs

For each section, create `product-plan/sections/[section-id]/README.md`:

```markdown
# [Section Title]

## Overview

[From spec.md overview]

## User Flows

[From spec.md user flows — summarized]

## Design Decisions

[Notable design choices from the screen design and spec]

## Multi-Page Layout

[If section has multiple pages with different shell configurations, document each]

## Data Shapes

**Entities:** [List entities from types.ts]

**From global entities:** [Which entities from data shape are used]

## Visual Reference

[Architecture-first mode:]
The React components in `components/` are screen design mockups. Use them as visual targets for layout, spacing, and responsive behavior. Rebuild using your target framework.

[Component-first mode:]
See `screenshot.png` for the target UI design.

## Components Provided

- `[Component]` — [Brief description]

## Callback Props / Actions

| Action | Triggered When |
|--------|---------------|
[From Props interface]

## Sample Data Scenarios

[If `sample-data.json` contains a `_scenarios` key, list each scenario with the description from spec/data context. Otherwise: "Sample data is provided as a single state in `sample-data.json`."]

| Scenario | What it represents |
|----------|--------------------|
[One row per scenario name, e.g. `Empty Form` — "User has not entered any data yet"]

The implementation must render correctly for every scenario listed above.

## Acceptance Tests

[If `acceptance.feature` exists in this section:]
Behavior is defined in Gherkin format in `acceptance.feature` (also bundled at `product-plan/features/[section-id].feature`). Run with [exspec](https://github.com/mnapoli/exspec):

```bash
npx exspec features/[section-id].feature
```

Scenarios covered:
[List each Scenario name from acceptance.feature with a one-line description]

[If no acceptance.feature exists:]
No acceptance tests have been defined for this section yet. Consider running `/write-acceptance-tests` in Design OS before exporting again.
```

## Step 14: Generate Section Test Instructions

For each section, create `product-plan/sections/[section-id]/tests.md` with UI behavior test specs based on the section's spec, user flows, UI design, and (if present) acceptance tests.

`tests.md` is a **companion** to `acceptance.feature`, not a replacement. The Gherkin file is the executable behavior contract; `tests.md` adds context the AI runner benefits from — exact UI text, edge cases, scenario-by-scenario expectations — that would clutter Gherkin.

Follow the same test spec generation guidelines from the original export command:

1. Read the spec.md thoroughly — extract all user flows and requirements
2. Read `acceptance.feature` (if present) — every Scenario there must have a corresponding entry in tests.md with concrete UI text and assertions
3. Study the screen design components — note exact button labels, field names, UI text
4. Review types.ts — understand the data shapes for assertions
5. If `sample-data.json` contains `_scenarios`, write one test block per scenario covering the visible state for that data
6. Include specific UI text — tests should verify exact labels, messages, placeholders
7. Cover success and failure paths — every action should have both tested
8. Always test empty states — primary lists with no items, parent records with no children
9. Be specific about assertions
10. Include edge cases — boundary conditions, transitions between empty and populated states
11. Stay framework-agnostic — describe WHAT to test, not HOW

## Step 15: Generate Design System Files

Generate `tokens.css`, `tailwind-colors.md`, and `fonts.md` in `product-plan/design-system/` following the standard Design OS format.

## Step 16: Generate Data Shapes Files

### data-shapes/README.md

List all entities across sections with brief descriptions and which sections use them.

### data-shapes/overview.ts

Aggregate all section types into one reference file. Only include data shape interfaces (not component Props interfaces).

## Step 17: Generate Prompt Files

Create `product-plan/prompts/` with two prompt files. Adapt the prompts based on export mode:

### one-shot-prompt.md

```markdown
# One-Shot Implementation Prompt

I need you to implement a complete web application based on detailed product specifications and UI designs I'm providing.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary with sections and entity overview
2. **@product-plan/instructions/one-shot-instructions.md** — Complete implementation instructions for all milestones

After reading these, also review:
- **@product-plan/architecture/** — Tech stack, architecture decisions, and integration docs
- **@product-plan/data-shapes/** — Entity descriptions, database schema, and UI data contracts
- **@product-plan/specs/** — Full section specifications with user flows and business rules
- **@product-plan/design-system/** — Color and typography tokens
- **@product-plan/shell/** — Application shell specification and visual reference
- **@product-plan/sections/** — Section screen designs, types, sample data (with `_scenarios` for multi-state screens), and test specs
- **@product-plan/features/** — Gherkin acceptance tests (run with [exspec](https://github.com/mnapoli/exspec)) — these are the executable definition of done
- **@product-plan/notes/** — Additional context and decisions (if present)

**Important:** When `sample-data.json` contains a `_scenarios` key, the UI must render correctly for every named scenario (e.g. "Empty Form", "Completed", "Declined"). When `features/[section-id].feature` exists for a section, every scenario in that file must pass via `npx exspec features/[section-id].feature` before that section is considered complete.

## Before You Begin

Review all the provided files, then ask me clarifying questions about:

1. **Tech stack** — Verify the tech stack documented in `architecture/tech-decisions.md` and ask about anything not covered
2. **Authentication & users** — How users should sign up, log in, and what permissions exist
3. **External integrations** — Any APIs, services, or data sources referenced in the architecture docs
4. **Product requirements** — Anything in the specs or user flows that needs clarification
5. **Anything else** — Whatever you need to know before implementing

Lastly, ask me if I have any additional notes for this implementation.

Once I answer your questions, create a comprehensive implementation plan before coding.
```

### section-prompt.md

```markdown
# Section Implementation Prompt

## Define Section Variables

- **SECTION_NAME** = [Human-readable name]
- **SECTION_ID** = [Folder name in sections/]
- **NN** = [Milestone number — sections start at 02 since 01 is Foundation]

---

I need you to implement the **SECTION_NAME** section of my application.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary for overall context
2. **@product-plan/instructions/incremental/NN-SECTION_ID.md** — Specific instructions for this section
3. **@product-plan/specs/SECTION_ID/spec.md** — Full specification with user flows and business rules

Also review the section assets:
- **@product-plan/specs/SECTION_ID/types.ts** — TypeScript interfaces (data shapes)
- **@product-plan/sections/SECTION_ID/README.md** — Feature overview and design intent
- **@product-plan/sections/SECTION_ID/tests.md** — UI behavior test specs
- **@product-plan/sections/SECTION_ID/acceptance.feature** — Gherkin acceptance tests (if present; also bundled at `@product-plan/features/SECTION_ID.feature`)
- **@product-plan/sections/SECTION_ID/components/** — Screen design visual references
- **@product-plan/sections/SECTION_ID/sample-data.json** — Test data; check for `_scenarios` (multiple named data states the UI must render correctly)

And any architecture docs referenced in the milestone instructions:
- **@product-plan/architecture/** — Relevant integration and configuration docs

## Before You Begin

Review all the provided files, then ask me clarifying questions about:

1. **Integration** — How this section connects to existing features and any APIs already built
2. **Product requirements** — Anything in the specs or user flows that needs clarification
3. **Anything else** — Whatever you need to know before implementing

Lastly, ask me if I have any additional notes for this implementation.

Once I answer your questions, proceed with implementation.

## Definition of Done

The section is complete when:
- All callbacks in the Props interface are wired up
- Every state in `sample-data.json` `_scenarios` (if defined) renders correctly
- Every Scenario in `acceptance.feature` passes when run with `npx exspec features/SECTION_ID.feature`
```

## Step 18: Generate README.md

Create `product-plan/README.md`:

```markdown
# [Product Name] — Design Handoff

This folder contains everything needed to implement [Product Name].

## What's Included

**Ready-to-Use Prompts:**
- `prompts/one-shot-prompt.md` — Prompt template for full implementation
- `prompts/section-prompt.md` — Prompt template for section-by-section implementation

**Instructions:**
- `product-overview.md` — Product summary (provide with every implementation session)
- `instructions/one-shot-instructions.md` — All milestones combined
- `instructions/incremental/` — Milestone-by-milestone instructions

**Specifications:**
- `specs/` — Full section specifications with user flows, business rules, and data shapes
- `data-shapes/` — Entity descriptions, database schema, and combined type reference

**Architecture:**
- `architecture/` — Tech stack decisions, integration docs, configuration specs

**Design Assets:**
- `design-system/` — Colors, fonts, design tokens
- `shell/` — Application shell specification and visual reference
- `sections/` — Section screen designs, test specs, sample data (may include `_scenarios` for multi-state screens), and per-section acceptance.feature

**Acceptance Tests:**
- `features/` — Gherkin acceptance tests aggregated for [exspec](https://github.com/mnapoli/exspec). Run with `npx exspec features/[section-id].feature`. These define the executable contract for "done."

**Notes:**
- `notes/` — Post-build discussion items and deferred decisions (if any)

## How to Use This

### Option A: Incremental (Recommended)

Build your app milestone by milestone:

1. Copy the `product-plan/` folder to your codebase
2. Start with Foundation (`instructions/incremental/01-foundation.md`) — design tokens, shell, database schema
3. For each section:
   - Open `prompts/section-prompt.md`
   - Fill in the section variables at the top
   - Copy/paste into your coding agent
   - Answer questions and implement
4. Review and test after each milestone

### Option B: One-Shot

Build the entire app in one session:

1. Copy the `product-plan/` folder to your codebase
2. Open `prompts/one-shot-prompt.md`
3. Copy/paste into your coding agent
4. Answer the agent's clarifying questions
5. Let the agent plan and implement everything

## Testing

Two artifacts define correct behavior for each section:

- **`features/[section-id].feature`** — Gherkin acceptance tests, runnable with [exspec](https://github.com/mnapoli/exspec): `npx exspec features/[section-id].feature`. These are the executable contract — implementation is not done until they pass.
- **`sections/[section-id]/tests.md`** — Companion UI behavior specs with concrete labels, empty-state assertions, and per-scenario expectations. Framework-agnostic — they describe WHAT to test, not HOW.

If a section's `sample-data.json` includes a `_scenarios` key, the UI must render correctly for every named state listed (e.g. "Empty Form", "Completed", "Declined").

## Tips

- **Read the specs first** — The `specs/` directory contains the authoritative implementation details
- **Use the architecture docs** — They document integration patterns, business rules, and configuration
- **Screen designs are visual references** — Use them to understand the intended UI, then build with your target framework
- **Run the acceptance tests early and often** — `features/` is where "done" is defined. Wire up exspec before writing UI code so you have a feedback loop.
- **Honor every scenario** — `_scenarios` in `sample-data.json` enumerates the states the UI must support; missing one is a bug
- **Check the notes/** — Contains decisions made during planning that may need client discussion

---

*Generated by Design OS*
```

## Step 19: Copy Screenshots

Copy any `.png` files from:
- `product/shell/` → `product-plan/shell/`
- `product/sections/[section-id]/` → `product-plan/sections/[section-id]/`

## Step 20: Create Zip File

```bash
rm -f product-plan.zip
cd . && zip -r product-plan.zip product-plan/
```

## Step 21: Confirm Completion

Let the user know what was created, listing:
- Export mode detected (architecture-first or component-first) and why
- Number of architecture docs included
- Whether database schema was included
- Number of section specs included
- Number of section screen designs included
- Number of screenshots included
- Number of `acceptance.feature` files copied to `features/` (and a list of any sections still missing acceptance tests, so the user knows where to run `/write-acceptance-tests`)
- Number of sections whose `sample-data.json` uses `_scenarios`, with the total count of distinct scenarios across the export
- Whether after-build discussion notes were included
- The prompts available for implementation

## Important Notes

- Always include ALL architecture files, not just tech-decisions.md
- Always include raw spec.md files — generated READMEs summarize but don't replace them
- Always copy `acceptance.feature` files (when present) to BOTH `sections/[section-id]/acceptance.feature` and `features/[section-id].feature`
- Preserve `_meta` and `_scenarios` keys in `sample-data.json` exactly as authored — downstream READMEs, instructions, and tests reference them by name
- In architecture-first mode, screen design components are visual references, not integration code
- Include product-overview.md context with every implementation session
- The export is self-contained — no dependencies on Design OS
- Sections with multiple pages/routes (different shell configurations) should be documented explicitly in the milestone instructions
- After-build discussion notes contain deferred decisions the implementation team should be aware of

## Git: Commit and Push

After generating the export package, immediately commit and push the changes to preserve work:

```bash
git add -A && git commit -m "Generate export package" && git push
```