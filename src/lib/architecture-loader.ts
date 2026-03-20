/**
 * Architecture / Technical Decisions loading and parsing utilities
 */

import type { TechDecisions, TechStackItem, ArchitectureDecision, IntegrationNote } from '@/types/product'

// Load architecture markdown file at build time
const architectureFiles = import.meta.glob('/product/architecture/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/**
 * Parse tech-decisions.md content into TechDecisions structure
 *
 * Expected format:
 * # Technical Decisions
 *
 * ## Tech Stack
 *
 * ### Framework & Language
 * - **Framework:** Laravel
 * - **Language:** PHP 8.4
 *
 * ### Database
 * - **Primary:** SQLite
 *
 * ## Architecture Decisions
 *
 * ### [Decision Title]
 * **Context:** Why this decision was needed
 * **Decision:** What was decided
 * **Consequences:** Expected impact
 *
 * ## Integration Notes
 *
 * ### External Services
 * - Service name - purpose
 *
 * ### Key Packages
 * - Package name - why chosen
 */
export function parseTechDecisions(md: string): TechDecisions | null {
  if (!md || !md.trim()) return null

  try {
    // Normalize line endings
    const normalizedMd = md.replace(/\r\n/g, '\n')

    const techStack: TechStackItem[] = []
    const decisions: ArchitectureDecision[] = []
    const integrations: IntegrationNote[] = []

    // Extract Tech Stack section
    const techStackSection = normalizedMd.match(/## Tech Stack\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (techStackSection?.[1]) {
      // Parse subsections within Tech Stack
      const subsections = [...techStackSection[1].matchAll(/### (.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const subsection of subsections) {
        const category = subsection[1].trim()
        const content = subsection[2]

        // Parse bullet items
        const items = [...content.matchAll(/- \*\*(.+?):\*\*\s*(.+)/g)]
        for (const item of items) {
          techStack.push({
            category,
            name: item[1].trim(),
            details: item[2].trim(),
          })
        }
      }
    }

    // Extract Architecture Decisions section
    const decisionsSection = normalizedMd.match(/## Architecture Decisions\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (decisionsSection?.[1]) {
      const decisionBlocks = [...decisionsSection[1].matchAll(/### (.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const block of decisionBlocks) {
        const title = block[1].trim()
        const content = block[2]

        const contextMatch = content.match(/\*\*Context:\*\*\s*(.+?)(?=\n\*\*|\n###|$)/s)
        const decisionMatch = content.match(/\*\*Decision:\*\*\s*(.+?)(?=\n\*\*|\n###|$)/s)
        const consequencesMatch = content.match(/\*\*Consequences:\*\*\s*(.+?)(?=\n\*\*|\n###|$)/s)

        decisions.push({
          title,
          context: contextMatch?.[1]?.trim() || '',
          decision: decisionMatch?.[1]?.trim() || '',
          consequences: consequencesMatch?.[1]?.trim() || '',
        })
      }
    }

    // Extract Integration Notes section
    const integrationsSection = normalizedMd.match(/## Integration Notes\s*\n+([\s\S]*?)(?=\n## |\n#[^#]|$)/)
    if (integrationsSection?.[1]) {
      const subsections = [...integrationsSection[1].matchAll(/### (.+)\n+([\s\S]*?)(?=\n### |\n## |$)/g)]
      for (const subsection of subsections) {
        const category = subsection[1].trim()
        const content = subsection[2]

        const items: string[] = []
        const bulletItems = [...content.matchAll(/- (.+)/g)]
        for (const item of bulletItems) {
          items.push(item[1].trim())
        }

        if (items.length > 0) {
          integrations.push({ category, items })
        }
      }
    }

    // Return null if we couldn't parse anything meaningful
    if (techStack.length === 0 && decisions.length === 0 && integrations.length === 0) {
      return null
    }

    return {
      raw: md,
      techStack,
      decisions,
      integrations,
    }
  } catch {
    return null
  }
}

/**
 * Load architecture / technical decisions
 */
export function loadArchitecture(): TechDecisions | null {
  const content = architectureFiles['/product/architecture/tech-decisions.md']
  return content ? parseTechDecisions(content) : null
}

/**
 * Check if architecture has been defined
 */
export function hasArchitecture(): boolean {
  return '/product/architecture/tech-decisions.md' in architectureFiles
}
