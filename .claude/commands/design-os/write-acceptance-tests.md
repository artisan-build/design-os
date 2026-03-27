# Write Acceptance Tests

You are helping the user write acceptance tests in Gherkin format for a section of their product. These tests define the expected behavior and will be used by [exspec](https://github.com/mnapoli/exspec) to verify the implementation.

## Step 1: Check Prerequisites

First, verify that `/product/product-roadmap.md` exists and has sections defined. If it doesn't:

"I don't see a product roadmap defined yet. Please run `/product-vision` first to define your product, then come back to write acceptance tests."

Stop here if no sections are defined.

## Step 2: Identify the Target Section

Read `/product/product-roadmap.md` to get the list of available sections.

If there's only one section, auto-select it. If there are multiple sections, use the AskUserQuestion tool to ask which section the user wants to write tests for:

"Which section would you like to write acceptance tests for?"

Present the available sections as options.

## Step 3: Load Section Context

Read the section's existing files to understand what to test:

1. **Spec** — `product/sections/[section-id]/spec.md`
   - Overview and user flows
   - UI requirements
2. **Sample Data** — `product/sections/[section-id]/data.json`
   - Data structures and scenarios
3. **Types** — `product/sections/[section-id]/types.ts`
   - Props interfaces and callback functions

If the spec doesn't exist:

"I don't see a specification for **[Section Title]** yet. Please run `/shape-section` first to define the section's user flows and requirements."

Stop here.

## Step 4: Analyze User Flows and Generate Tests

Based on the spec's user flows and UI requirements, generate comprehensive acceptance tests.

**For each user flow, create scenarios covering:**

1. **Happy Path** — The main success scenario
2. **Validation Errors** — What happens when input is invalid
3. **Empty States** — Behavior when no data exists
4. **Edge Cases** — Boundary conditions and special cases

**Gherkin Best Practices:**

- Write from the user's perspective ("I" or "the user")
- Use specific, concrete examples (real data, not placeholders)
- Keep steps focused on observable behavior, not implementation
- Use Given for setup, When for actions, Then for assertions
- Use And for additional steps of the same type

## Step 5: Write the Feature File

Create `product/sections/[section-id]/acceptance.feature` with this structure:

```gherkin
Feature: [Section Title]
  [One-line description of what this section enables users to do]

  Scenario: [Primary happy path]
    Given [initial state or precondition]
    When [user action]
    Then [expected outcome]
    And [additional assertion]

  Scenario: [Secondary flow]
    Given [initial state]
    When [user action]
    Then [expected outcome]

  Scenario: Empty state - no [items] exist
    Given there are no [items] in the system
    When I navigate to the [section] page
    Then I should see "[empty state message]"
    And I should see a "[create first item]" button

  Scenario: Validation error - [specific error]
    Given I am on the [create/edit form]
    When I leave the [required field] empty
    And I click "[submit button]"
    Then I should see an error message "[field] is required"
    And the form should not be submitted
```

**Example for an Invoices section:**

```gherkin
Feature: Invoices
  Manage invoices for clients including creation, viewing, and status updates

  Scenario: View list of invoices
    Given I have invoices in my account
    When I navigate to the invoices page
    Then I should see a list of invoices
    And each invoice should show the client name, amount, and status

  Scenario: Create a new invoice
    Given I am on the invoices page
    When I click "New Invoice"
    And I select client "Acme Corp"
    And I add a line item "Consulting Services" for $5,000
    And I click "Create Invoice"
    Then I should see "Invoice created successfully"
    And the new invoice should appear in the list

  Scenario: Empty state - no invoices exist
    Given I have no invoices in my account
    When I navigate to the invoices page
    Then I should see "No invoices yet"
    And I should see "Create your first invoice to get started"
    And I should see a "Create Invoice" button

  Scenario: Mark invoice as paid
    Given I have an unpaid invoice for "Acme Corp"
    When I click on the invoice
    And I click "Mark as Paid"
    Then the invoice status should change to "Paid"
    And I should see a success message

  Scenario: Validation error - missing client
    Given I am creating a new invoice
    When I try to create an invoice without selecting a client
    Then I should see an error "Please select a client"
    And the invoice should not be created

  Scenario: View invoice details
    Given I have an invoice for "Acme Corp" with 3 line items
    When I click on the invoice
    Then I should see the invoice details panel
    And I should see all 3 line items with descriptions and amounts
    And I should see the total amount
```

## Step 6: Review and Confirm

Present the generated scenarios to the user:

"I've written acceptance tests for **[Section Title]** based on the spec's user flows:

**Scenarios:**
1. [Scenario name] — [brief description]
2. [Scenario name] — [brief description]
3. [Scenario name] — [brief description]
...

**Coverage:**
- Happy paths: [count]
- Empty states: [count]
- Validation errors: [count]
- Edge cases: [count]

Do these scenarios cover the key behaviors? Would you like to add or modify any scenarios?"

Use AskUserQuestion with options:
- "Looks good, save the tests"
- "Add more scenarios"
- "Modify specific scenarios"

## Step 7: Save and Confirm

After the user approves (or after adjustments):

"I've saved the acceptance tests to `product/sections/[section-id]/acceptance.feature`.

**What's Next:**

1. **Review in Design OS** — Navigate to the section to see the tests displayed
2. **Run with exspec** — After implementation, run `npx exspec features/[section-id].feature` to verify behavior
3. **Export** — When you run `/export-product`, these tests will be exported to `features/` for the implementation codebase

The tests use Gherkin format compatible with [exspec](https://github.com/mnapoli/exspec), which uses AI to interpret and run the tests without step definitions."

## Important Notes

- Write tests from the user's perspective, not technical implementation
- Use concrete examples with realistic data (from sample data when available)
- Cover empty states — they're often overlooked but important for UX
- Include validation error scenarios for forms
- Keep scenarios focused — test one behavior per scenario
- The tests should be readable by non-technical stakeholders

## Git: Commit and Push

After writing acceptance tests, commit and push:

```bash
git add -A && git commit -m "Add acceptance tests for [section-name]" && git push
```
