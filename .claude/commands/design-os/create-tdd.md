# Create TDD (Technical Design Document)

You are helping the user document their technical decisions for implementation. This creates a Technical Design Document that captures tech stack choices, architecture decisions, and integration notes.

## Step 1: Check Prerequisites

Verify that the product foundation exists:

**Required:**
- `/product/product-overview.md` — Product overview
- `/product/product-roadmap.md` — Sections defined

If required files are missing:

"Before documenting technical decisions, you need to define your product vision first. Please run `/product-vision` to create the product overview and roadmap."

Stop here if required files are missing.

## Step 2: Gather Context

Read the existing product files to understand the context:

1. `/product/product-overview.md` — Product name, description, features
2. `/product/product-roadmap.md` — List of sections
3. `/product/data-shape/data-shape.md` (if exists) — Entities and relationships

Present a brief summary:

"I've reviewed your product: **[Product Name]**

[Brief 1-2 sentence summary of what the product does]

Now let's document the technical decisions for implementing this product."

## Step 3: Ask About Tech Stack

Ask about the core technology choices. Use the AskUserQuestion tool to gather information conversationally, asking one or two questions at a time.

### Framework & Language
- "What framework and language will you use? (e.g., Laravel/PHP, Next.js/TypeScript, Rails/Ruby)"
- Follow up with version if not specified

### Database
- "What database will you use? (e.g., PostgreSQL, MySQL, SQLite, MongoDB)"
- Any specific considerations (managed service, local dev, etc.)

### Frontend
- "How will you handle the frontend? (e.g., Livewire, React, Vue, Blade templates)"
- CSS framework? (Tailwind, Bootstrap, custom)

### Hosting & Infrastructure
- "Where will this be hosted? (e.g., Laravel Forge, Vercel, AWS, Render)"
- Any CI/CD preferences?

## Step 4: Ask About Architecture Decisions

Ask about key architectural choices that will shape the implementation:

- "Are there any specific architectural patterns you want to use? (e.g., Event Sourcing, CQRS, Repository Pattern)"
- "Any decisions about how data should flow or be structured?"
- "Are there any constraints or requirements that should be documented? (e.g., must support offline, needs real-time updates)"

For each decision mentioned, ask:
- What was the context/reason for this choice?
- What are the expected consequences or trade-offs?

## Step 5: Ask About Integrations

Ask about external services and packages:

- "Will this integrate with any external services? (e.g., payment processors, email providers, analytics)"
- "Are there any specific packages or libraries you plan to use? (e.g., Spatie packages, Stripe SDK)"

For each integration, briefly note why it was chosen.

## Step 6: Create the TDD File

Once you have enough information, create the file at `/product/architecture/tech-decisions.md` with this format:

```markdown
# Technical Decisions

## Tech Stack

### Framework & Language
- **Framework:** [Framework name]
- **Language:** [Language and version]

### Database
- **Primary:** [Database name]

### Frontend
- **Framework:** [Frontend framework]
- **CSS:** [CSS framework]

### Hosting
- **Platform:** [Hosting platform]

## Architecture Decisions

### [Decision Title]
**Context:** [Why this decision was needed]
**Decision:** [What was decided]
**Consequences:** [Expected impact]

[Add more decisions as needed]

## Integration Notes

### External Services
- [Service name] - [purpose/why chosen]

### Key Packages
- [Package name] - [purpose/why chosen]

[Add more categories as needed]
```

## Step 7: Confirm Completion

After creating the file, inform the user:

"I've created the Technical Design Document at `product/architecture/tech-decisions.md`.

**Tech Stack:**
- [Framework]: [version]
- [Database]: [name]
- [Frontend]: [framework]
- [Hosting]: [platform]

**Architecture Decisions:** [N] decisions documented

**Integrations:** [N] services/packages noted

This document will be included when you export your product with `/export-product`. You can view it in Design OS by navigating to the Architecture tab.

To make changes, run `/create-tdd` again or edit the file directly."

## Important Notes

- Be conversational and help the user think through their technical choices
- Don't assume specific technologies — ask about each category
- If the user isn't sure about something, it's okay to leave it as "To be decided" or skip that section
- Keep the document concise and focused on decisions that matter for implementation
- The format must match exactly for the app to parse it correctly
- If a `tech-decisions.md` file already exists, ask if the user wants to update it or start fresh

## Git: Commit and Push

After creating or updating the TDD file, immediately commit and push the changes to preserve work:

```bash
git add -A && git commit -m "Add technical decisions" && git push
```

This ensures planning documents are saved to the remote repository in case the session ends unexpectedly.
