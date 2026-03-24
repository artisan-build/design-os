# Agent Directives for Design OS

Design OS is a **product planning and design tool** that helps users define their product vision, sketch out their data shape, design their UI, and prepare export packages for implementation in a separate codebase.

> **Important**: Design OS is a planning tool, not the end product codebase. The screen designs and components generated here are meant to be exported and integrated into your actual product's codebase.

---

## Understanding Design OS Context

When working in Design OS, be aware of two distinct contexts:

### 1. Design OS Application
The React application that displays and manages planning files. When modifying the Design OS UI itself:
- Files live in `src/` (components, pages, utilities)
- Uses the Design OS design system (stone palette, DM Sans, etc.)
- Provides the interface for viewing specs, screen designs, exports, etc.

### 2. Product Design (Screen Designs & Exports)
The product you're planning and designing. When creating screen designs and exports:
- Screen design components live in `src/sections/[section-name]/` and `src/shell/`
- Product definition files live in `product/`
- Exports are packaged to `product-plan/` for integration into a separate codebase
- Follow the design requirements specified in each section's spec

---

## Getting Started — The Planning Flow

Design OS follows a structured planning sequence:

### 1. Product Vision (`/product-vision`)
Define your product overview, roadmap sections, and data shape — all in one conversational flow. After answering clarifying questions, all three files are generated automatically.
**Output:** `product/product-overview.md`, `product/product-roadmap.md`, `product/data-shape/data-shape.md`

Use `/product-roadmap`, `/data-shape` individually to update those files after initial creation.

### 2. Design System (`/design-tokens`)
Choose your color palette (from Tailwind) and typography (from Google Fonts). These tokens are applied to all screen designs.
**Output:** `product/design-system/colors.json`, `product/design-system/typography.json`

### 3. Application Shell (`/design-shell`)
Design the persistent navigation and layout that wraps all sections.
**Output:** `product/shell/spec.md`, `src/shell/components/`

### 4. For Each Section:
- `/shape-section` — Define the specification and generate sample data + types
- `/sample-data` — Update sample data and types (if already created)
- `/design-screen` — Create screen designs
- `/screenshot-design` — Capture screenshots

### 5. Architecture (`/create-tdd`)
Document technical decisions for implementation — tech stack, architecture patterns, and integrations. This phase comes after sections are designed, allowing engineering to add technical context before export.
**Output:** `product/architecture/tech-decisions.md`

### 6. Export (`/export-product`)
Generate the complete export package with all components, types, and handoff documentation.
**Output:** `product-plan/`

---

## File Structure

```
product/                           # Product definition (portable)
├── product-overview.md            # Product description, problems/solutions, features
├── product-roadmap.md             # List of sections with titles and descriptions
│
├── data-shape/                    # Product data shape
│   └── data-shape.md              # Entity names, descriptions, and relationships
│
├── design-system/                 # Design tokens
│   ├── colors.json                # { primary, secondary, neutral }
│   └── typography.json            # { heading, body, mono }
│
├── shell/                         # Application shell
│   └── spec.md                    # Shell specification
│
├── architecture/                  # Technical decisions
│   └── tech-decisions.md          # Tech stack, architecture, integrations
│
└── sections/
    └── [section-name]/
        ├── spec.md                # Section specification
        ├── data.json              # Sample data (supports _scenarios for multiple states)
        ├── types.ts               # TypeScript interfaces
        └── *.png                  # Screenshots

src/
├── shell/                         # Shell design components
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── MainNav.tsx
│   │   ├── UserMenu.tsx
│   │   └── index.ts
│   └── ShellPreview.tsx
│
└── sections/
    └── [section-name]/
        ├── components/            # Exportable components
        │   ├── [Component].tsx
        │   └── index.ts
        └── [ViewName].tsx         # Preview wrapper

product-plan/                      # Export package (generated)
├── README.md                      # Quick start guide
├── product-overview.md            # Product summary
├── prompts/                       # Ready-to-use prompts for coding agents
│   ├── one-shot-prompt.md         # Prompt for full implementation
│   └── section-prompt.md          # Prompt template for incremental
├── instructions/                  # Implementation instructions
│   ├── one-shot-instructions.md   # All milestones combined
│   └── incremental/               # Milestone-by-milestone instructions
│       ├── 01-shell.md
│       └── [NN]-[section-id].md   # Section-specific instructions
├── architecture/                  # Technical decisions (if defined)
│   └── tech-decisions.md
├── design-system/                 # Tokens, colors, fonts
├── data-shapes/                   # UI data contracts (types components expect)
├── shell/                         # Shell components
└── sections/                      # Section components (with tests.md each)
```

---

## Design Requirements

When creating screen designs, follow these guidelines:

- **Mobile Responsive**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to ensure layouts adapt properly across screen sizes.

- **Light & Dark Mode**: Use `dark:` variants for all colors. Test that all UI elements are visible and readable in both modes.

- **Use Design Tokens**: When design tokens are defined, apply the product's color palette and typography. Otherwise, fall back to `stone` for neutrals and `lime` for accents.

- **Props-Based Components**: All screen design components must accept data and callbacks via props. Never import data directly in exportable components.

- **Scenario-Aware Preview Wrappers**: Preview wrappers should use `useSectionData()` from `@/lib/section-data-context` to get sample data. This enables scenario switching when data.json defines multiple states via `_scenarios`.

- **No Navigation in Section Screen Designs**: Section screen designs should not include navigation chrome. The shell handles all navigation.

---

## Tailwind CSS Directives

These rules apply to both the Design OS application and all screen designs/components it generates:

- **Tailwind CSS v4**: We always use Tailwind CSS v4 (not v3). Do not reference or create v3 patterns.

- **No tailwind.config.js**: Tailwind CSS v4 does not use a `tailwind.config.js` file. Never reference, create, or modify one.

- **Use Built-in Utility Classes**: Avoid writing custom CSS. Stick to using Tailwind's built-in utility classes for all styling.

- **Use Built-in Colors**: Avoid defining custom colors. Use Tailwind's built-in color utility classes (e.g., `stone-500`, `lime-400`, `red-600`).

---

## The Planning Phases

Design OS is organized around these main phases:

1. **Product Overview** — The "what" and "why"
   - Product name and description
   - Problems and solutions
   - Key features
   - Sections/roadmap

2. **Data Shape** — The "nouns" of the system
   - Core entity names and descriptions
   - Conceptual relationships between entities
   - Shared vocabulary for consistent naming across sections

3. **Design System** — The "look and feel"
   - Color palette (Tailwind colors)
   - Typography (Google Fonts)

4. **Application Shell** — The persistent chrome
   - Global navigation structure
   - User menu
   - Layout pattern

5. **Sections** — The individual features
   - Specifications and user flows
   - Sample data and TypeScript interfaces
   - Screen designs (React components)
   - **Scenarios** — Multiple data states for showing the same screen in different conditions (e.g., empty form vs completed form)

6. **Architecture** — The technical foundation (optional)
   - Tech stack choices (framework, database, hosting)
   - Architecture decisions and patterns
   - External integrations and key packages

---

## Design System Scope

Design OS separates concerns between its own UI and the product being designed:

- **Design OS UI**: Always uses the stone/lime palette and DM Sans typography
- **Product Screen Designs**: Use the design tokens defined for the product (when available)
- **Shell**: Uses product design tokens to preview the full app experience

---

## Export & Handoff

The `/export-product` command generates a UI design handoff package:

- **Ready-to-use prompts**: Pre-written prompts to copy/paste into coding agents
  - `one-shot-prompt.md`: For full implementation in one session
  - `section-prompt.md`: Template for section-by-section implementation
- **Implementation instructions**: UI-focused guides for each milestone
  - `product-overview.md`: Always provide for context
  - `one-shot-instructions.md`: All milestones combined
  - Incremental instructions in `instructions/incremental/`
- **Architecture decisions**: Tech stack and patterns (if `/create-tdd` was run)
- **Test specs**: Each section includes `tests.md` with UI behavior specs
- **Portable components**: Props-based, ready for any React setup
- **Data shapes**: TypeScript interfaces defining what data the components expect

The handoff focuses on UI designs, product requirements, and user flows. If architecture decisions are documented via `/create-tdd`, they're included in the export to guide the implementation agent on tech stack choices. Otherwise, the prompts guide the agent to ask clarifying questions about tech stack and requirements before building.

---

## Design System (Design OS Application)

The Design OS application itself uses a "Refined Utility" aesthetic:

- **Typography**: DM Sans for headings and body, IBM Plex Mono for code
- **Colors**: Stone palette for neutrals (warm grays), lime for accents
- **Layout**: Maximum 800px content width, generous whitespace
- **Cards**: Minimal borders (1px), subtle shadows, generous padding
- **Motion**: Subtle fade-ins (200ms), no bouncy animations
