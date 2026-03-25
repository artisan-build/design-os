/**
 * Issues loader for Design OS
 * Loads and parses the generated GitHub issues from product/issues/issues.json
 */

import type { IssuesData, IssueGroup, Issue, IssueLabel } from '@/types/product'

// Load issues.json at build time
const issuesFiles = import.meta.glob('/product/issues/issues.json', {
  eager: true,
}) as Record<string, { default: Record<string, unknown> }>

/**
 * Load and parse issues data
 */
export function loadIssuesData(): IssuesData | null {
  const issuesPath = '/product/issues/issues.json'
  const issuesModule = issuesFiles[issuesPath]

  if (!issuesModule?.default) {
    return null
  }

  const raw = issuesModule.default

  try {
    // Parse _meta
    const rawMeta = raw._meta as Record<string, unknown> | undefined
    if (!rawMeta) {
      return null
    }

    const _meta = {
      targetRepo: String(rawMeta.targetRepo || ''),
      planningRepo: String(rawMeta.planningRepo || ''),
      generatedAt: String(rawMeta.generatedAt || ''),
      totalIssues: Number(rawMeta.totalIssues || 0),
    }

    // Parse groups
    const rawGroups = raw.groups as Array<Record<string, unknown>> | undefined
    if (!rawGroups || !Array.isArray(rawGroups)) {
      return { _meta, groups: [] }
    }

    const groups: IssueGroup[] = rawGroups.map((rawGroup) => {
      const rawIssues = rawGroup.issues as Array<Record<string, unknown>> | undefined

      const issues: Issue[] = (rawIssues || []).map((rawIssue) => ({
        id: String(rawIssue.id || ''),
        title: String(rawIssue.title || ''),
        labels: (rawIssue.labels as IssueLabel[]) || [],
        description: String(rawIssue.description || ''),
        tasks: (rawIssue.tasks as string[]) || [],
        acceptanceCriteria: (rawIssue.acceptanceCriteria as string[]) || [],
        dependsOn: (rawIssue.dependsOn as string[]) || [],
        screenshots: (rawIssue.screenshots as string[]) || [],
        githubIssueNumber: rawIssue.githubIssueNumber as number | null,
      }))

      return {
        name: String(rawGroup.name || ''),
        order: Number(rawGroup.order || 0),
        description: String(rawGroup.description || ''),
        issues,
      }
    })

    // Sort groups by order
    groups.sort((a, b) => a.order - b.order)

    return { _meta, groups }
  } catch {
    return null
  }
}

/**
 * Check if issues have been generated
 */
export function hasIssues(): boolean {
  return '/product/issues/issues.json' in issuesFiles
}

/**
 * Get total issue count
 */
export function getIssueCount(data: IssuesData | null): number {
  if (!data) return 0
  return data.groups.reduce((sum, group) => sum + group.issues.length, 0)
}

/**
 * Get issues by label
 */
export function getIssuesByLabel(data: IssuesData | null, label: IssueLabel): Issue[] {
  if (!data) return []
  return data.groups.flatMap((group) =>
    group.issues.filter((issue) => issue.labels.includes(label))
  )
}

/**
 * Get issue by ID
 */
export function getIssueById(data: IssuesData | null, id: string): Issue | null {
  if (!data) return null
  for (const group of data.groups) {
    const issue = group.issues.find((i) => i.id === id)
    if (issue) return issue
  }
  return null
}

/**
 * Get issues that depend on a given issue
 */
export function getDependentIssues(data: IssuesData | null, issueId: string): Issue[] {
  if (!data) return []
  return data.groups.flatMap((group) =>
    group.issues.filter((issue) => issue.dependsOn.includes(issueId))
  )
}

/**
 * Check if all issues have been created on GitHub
 */
export function allIssuesCreated(data: IssuesData | null): boolean {
  if (!data) return false
  return data.groups.every((group) =>
    group.issues.every((issue) => issue.githubIssueNumber !== null)
  )
}

/**
 * Get screenshot URL for display
 * Returns the raw GitHub URL for the planning repo
 */
export function getScreenshotUrl(planningRepo: string, screenshotPath: string): string {
  // screenshotPath is relative, e.g., "product/sections/dashboard/dashboard-view.png"
  return `https://raw.githubusercontent.com/${planningRepo}/main/${screenshotPath}`
}

/**
 * Get label color for display
 */
export function getLabelColor(label: IssueLabel): { bg: string; text: string } {
  const colors: Record<IssueLabel, { bg: string; text: string }> = {
    foundation: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300' },
    feature: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    ui: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300' },
    infrastructure: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300' },
    'human-task': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300' },
    polish: { bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300' },
  }
  return colors[label] || { bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300' }
}
