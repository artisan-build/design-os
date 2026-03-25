# Generate Issues

You are helping the user turn their complete product planning into well-shaped GitHub issues that an AI agent (or human) can implement without asking clarifying questions.

This is the final step in the Design OS workflow — transforming planning documents into actionable work items.

## Step 1: Check Prerequisites

Verify that all required planning documents exist:

**Required:**
- `/product/product-overview.md` — Product overview
- `/product/product-roadmap.md` — Sections defined
- `/product/architecture/tech-decisions.md` — Technical decisions
- At least one section with `spec.md`, `data.json`, and `types.ts`

**Check each prerequisite and report status:**

"Let me verify your planning documents are ready for issue generation..."

Read each file and report:

- Product Overview: [exists/missing]
- Product Roadmap: [exists/missing]
- Tech Decisions: [exists/missing]
- Sections with complete specs: [list sections that have spec.md + data.json + types.ts]

**If tech decisions are missing:**

"Before generating issues, you need to document your technical decisions. Please run `/create-tdd` first to define your tech stack, data model, and architecture patterns."

Stop here.

**If no sections have complete specs:**

"I need at least one section with a complete specification (spec.md, data.json, types.ts) to generate meaningful issues. Please run `/shape-section` to define your sections."

Stop here.

**Check for screenshots:**

Look for `.png` files in `product/sections/*/` and `product/shell/`. If screen designs exist but screenshots are missing:

"I found screen designs but no screenshots. Screenshots are embedded in UI-related issues so implementers can see exactly what to build. Would you like to continue without screenshots, or run `/screenshot-design` first?"

Use AskUserQuestion to let them choose.

## Step 2: Gap Analysis

This is the critical phase. Read ALL planning documents and identify what's missing for implementation.

**Read these files:**
- `/product/product-overview.md`
- `/product/product-roadmap.md`
- `/product/data-shape/data-shape.md`
- `/product/design-system/colors.json`
- `/product/design-system/typography.json`
- `/product/shell/spec.md`
- `/product/architecture/tech-decisions.md`
- All section specs: `/product/sections/*/spec.md`
- All section data: `/product/sections/*/data.json`
- All section types: `/product/sections/*/types.ts`

**Analyze for gaps:**

An implementing agent needs to know:

1. **Data Model** — What are all the database tables/models? What are their fields, types, relationships? What indexes are needed?

2. **Authentication Flow** — How does login/registration work? What middleware protects routes? Are there roles/permissions?

3. **Authorization** — Who can do what? Are there team/organization scopes? How is ownership determined?

4. **Events & Side Effects** — What happens when key actions occur? Notifications? Webhooks? Audit logs? Background jobs?

5. **External Integrations** — What APIs are called? What credentials are needed? How is billing handled?

6. **User Flows** — What's the onboarding flow? What happens on first login? How do users navigate between features?

7. **Edge Cases** — What happens when things fail? Rate limits? Validation errors? Empty states?

**Present gaps to user:**

"I've analyzed your planning documents and found some gaps that would cause an implementing agent to ask clarifying questions. Let me walk through each one so we can fill in the details.

**Gap 1: [Category]**
[Describe what's unclear or missing]

[Ask specific question to clarify]"

Ask one gap at a time. Wait for their response before moving to the next gap.

**Update tech-decisions.md:**

As the user answers questions, update `/product/architecture/tech-decisions.md` with the clarified information. This file is the bridge between "what" (product specs) and "how" (implementation details).

Add new sections as needed:
- Data Model (tables, fields, relationships)
- Authentication & Authorization
- Event Flows
- External Integrations
- Business Rules

After filling all gaps:

"I've updated `product/architecture/tech-decisions.md` with all the implementation details we discussed. This document now contains everything an implementer needs to know."

## Step 3: Plan Issue Structure

Based on the complete planning docs, plan the issue structure:

"Now let me organize the implementation into GitHub issues. I'll group them by dependency order so they can be worked on in sequence.

**Proposed structure:**

**Group 1: Foundation** (no dependencies)
- Project scaffolding and package installation
- Database schema and migrations
- Authentication setup
- [etc.]

**Group 2: Core Features** (depends on Group 1)
- [Feature issues based on sections]

**Group 3: UI Implementation** (depends on Group 2)
- [Screen design implementations]

**Group 4: Polish & Launch** (depends on Group 3)
- [Final touches, deployment, etc.]

**Human Tasks** (require manual action)
- [Stripe setup, DNS configuration, API keys, etc.]

Does this structure make sense for your project? Any issues you'd add or reorganize?"

Wait for feedback and adjust.

## Step 4: Generate Issues

Generate each issue with:

- **title**: Clear, action-oriented (e.g., "Implement user authentication flow")
- **labels**: One of: `foundation`, `feature`, `ui`, `infrastructure`, `human-task`, `polish`
- **description**: Context, what needs to be done, why it matters
- **tasks**: Checkbox list of specific subtasks
- **acceptanceCriteria**: How to verify the issue is complete
- **dependsOn**: Array of issue numbers this depends on
- **screenshots**: Array of screenshot paths for UI issues (relative to planning repo)

**For UI issues:**
Reference screenshots from the planning repo. They'll be accessible at:
`https://raw.githubusercontent.com/{org}/{planning-repo}/main/product/sections/{section-id}/{screenshot}.png`

**Quality bar:**
Every issue should be detailed enough that an AI agent can implement it without asking clarifying questions. Include:
- Specific file paths where code should be added
- Code patterns to follow (reference tech-decisions.md)
- Edge cases to handle
- Test scenarios

## Step 5: Ask for Target Repo Info

Before saving, ask:

"Where should these issues be created?

**Target repository** (where code will be implemented):
e.g., `artisan-build/myapp`

**Planning repository** (this repo, for screenshot URLs):
e.g., `artisan-build/myapp-planning`"

Use AskUserQuestion to gather both repo identifiers.

## Step 6: Save Issues to JSON

Create the file at `product/issues/issues.json`:

```json
{
  "_meta": {
    "targetRepo": "[org]/[repo]",
    "planningRepo": "[org]/[planning-repo]",
    "generatedAt": "[ISO timestamp]",
    "totalIssues": [count]
  },
  "groups": [
    {
      "name": "Foundation",
      "order": 1,
      "description": "Core infrastructure with no dependencies",
      "issues": [
        {
          "id": "issue-1",
          "title": "Project scaffolding and package installation",
          "labels": ["foundation"],
          "description": "Set up the Laravel project with all required packages...",
          "tasks": [
            "Create fresh Laravel project with Livewire starter kit",
            "Install required packages: livewire/flux, spatie/laravel-permission, etc."
          ],
          "acceptanceCriteria": [
            "All packages installed without conflicts",
            "php artisan migrate runs successfully",
            "App loads in browser without errors"
          ],
          "dependsOn": [],
          "screenshots": [],
          "githubIssueNumber": null
        }
      ]
    }
  ]
}
```

## Step 7: Confirm and Next Steps

After saving:

"I've generated **[N] issues** organized into **[M] groups** and saved them to `product/issues/issues.json`.

**Summary:**
- Foundation: [count] issues
- Features: [count] issues
- UI: [count] issues
- Human Tasks: [count] issues
- [etc.]

**Next steps:**

1. **Review in Design OS** — Navigate to the Issues tab to see all issues with their full details, dependencies, and embedded screenshots.

2. **Create on GitHub** — When you're ready, run `/create-github-issues` to create these issues on `[target-repo]`.

3. **Adjust as needed** — You can edit `issues.json` directly or re-run `/generate-issues` to regenerate.

The planning repo screenshots will be referenced in issue bodies, so make sure the planning repo is pushed to GitHub before creating issues."

## Important Notes

- The gap analysis phase is where the real value is — don't skip or rush it
- tech-decisions.md is the bridge document that grows during gap analysis
- Every issue must be implementable without clarification
- Screenshots should be captured before running this command for best results
- Issues reference the planning repo for screenshots, not embedded base64
- The JSON format enables the Design OS UI to display issues before GitHub creation
- Human-task issues are for things requiring manual action (Stripe dashboard, DNS, API keys)

## Git: Commit and Push

After generating issues, commit and push all changes:

```bash
git add -A && git commit -m "Generate GitHub issues from planning documents" && git push
```

This saves both the issues.json and any updates to tech-decisions.md from the gap analysis.
