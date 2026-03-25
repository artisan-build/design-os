import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { loadProductData } from '@/lib/product-loader'
import { getLabelColor, getScreenshotUrl, getIssueCount } from '@/lib/issues-loader'
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  ExternalLink,
  GitBranch,
  Image,
  ListChecks,
  Target,
} from 'lucide-react'
import type { Issue, IssueGroup, IssueLabel } from '@/types/product'

export function IssuesPage() {
  const productData = useMemo(() => loadProductData(), [])
  const issuesData = productData.issues

  const hasIssuesData = !!issuesData && issuesData.groups.length > 0
  const issueCount = getIssueCount(issuesData)
  const stepStatus: StepStatus = hasIssuesData ? 'completed' : 'current'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Issues
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Review generated GitHub issues before creating them on your target repository.
          </p>
        </div>

        {/* Step 1: Generated Issues */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasIssuesData}>
          {!issuesData ? (
            <EmptyState type="issues" />
          ) : (
            <div className="space-y-6">
              {/* Meta info */}
              <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-3">
                    Issue Summary
                    <span className="text-sm font-medium text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30 px-2 py-0.5 rounded">
                      {issueCount} issues
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">Target Repo</span>
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {issuesData._meta.targetRepo || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">Planning Repo</span>
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {issuesData._meta.planningRepo || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">Groups</span>
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {issuesData.groups.length}
                      </p>
                    </div>
                    <div>
                      <span className="text-stone-500 dark:text-stone-400">Generated</span>
                      <p className="font-medium text-stone-900 dark:text-stone-100">
                        {formatDate(issuesData._meta.generatedAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issue Groups */}
              {issuesData.groups.map((group) => (
                <IssueGroupCard
                  key={group.name}
                  group={group}
                  planningRepo={issuesData._meta.planningRepo}
                />
              ))}

              {/* Edit hint */}
              <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  To regenerate issues, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/generate-issues</code>.
                  When ready to create on GitHub, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/create-github-issues</code>.
                </p>
              </div>
            </div>
          )}
        </StepIndicator>
      </div>
    </AppLayout>
  )
}

interface IssueGroupCardProps {
  group: IssueGroup
  planningRepo: string
}

function IssueGroupCard({ group, planningRepo }: IssueGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-sm font-medium text-stone-700 dark:text-stone-300">
                  {group.order}
                </span>
                {group.name}
                <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
                  ({group.issues.length} {group.issues.length === 1 ? 'issue' : 'issues'})
                </span>
              </CardTitle>
              <ChevronDown
                className={`w-5 h-5 text-stone-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </div>
            {group.description && (
              <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                {group.description}
              </p>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {group.issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} planningRepo={planningRepo} />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

interface IssueCardProps {
  issue: Issue
  planningRepo: string
}

function IssueCard({ issue, planningRepo }: IssueCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="px-4 py-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {issue.githubIssueNumber ? (
                    <CheckCircle2
                      className="w-4 h-4 text-lime-500 shrink-0"
                      strokeWidth={2}
                    />
                  ) : (
                    <Circle
                      className="w-4 h-4 text-stone-400 shrink-0"
                      strokeWidth={2}
                    />
                  )}
                  <h4 className="font-medium text-stone-900 dark:text-stone-100 truncate">
                    {issue.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {issue.labels.map((label) => (
                    <LabelBadge key={label} label={label} />
                  ))}
                  {issue.dependsOn.length > 0 && (
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <GitBranch className="w-3 h-3" strokeWidth={1.5} />
                      {issue.dependsOn.length} {issue.dependsOn.length === 1 ? 'dependency' : 'dependencies'}
                    </span>
                  )}
                  {issue.screenshots.length > 0 && (
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <Image className="w-3 h-3" strokeWidth={1.5} />
                      {issue.screenshots.length}
                    </span>
                  )}
                  {issue.githubIssueNumber && (
                    <a
                      href={`https://github.com/${planningRepo.split('-planning')[0]}/issues/${issue.githubIssueNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-lime-600 dark:text-lime-400 flex items-center gap-1 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                      #{issue.githubIssueNumber}
                    </a>
                  )}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform shrink-0 mt-1 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-2 border-t border-stone-100 dark:border-stone-800 space-y-4">
            {/* Description */}
            {issue.description && (
              <div>
                <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                  {issue.description}
                </p>
              </div>
            )}

            {/* Tasks */}
            {issue.tasks.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Tasks
                </h5>
                <ul className="space-y-1">
                  {issue.tasks.map((task, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-4 h-4 border border-stone-300 dark:border-stone-600 rounded flex-shrink-0 mt-0.5" />
                      <span className="text-stone-700 dark:text-stone-300">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Acceptance Criteria */}
            {issue.acceptanceCriteria.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Acceptance Criteria
                </h5>
                <ul className="space-y-1">
                  {issue.acceptanceCriteria.map((criterion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 flex-shrink-0" />
                      <span className="text-stone-700 dark:text-stone-300">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dependencies */}
            {issue.dependsOn.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Depends On
                </h5>
                <div className="flex flex-wrap gap-2">
                  {issue.dependsOn.map((dep) => (
                    <span
                      key={dep}
                      className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-1 rounded"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Screenshots */}
            {issue.screenshots.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Screenshots
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {issue.screenshots.map((screenshot, index) => (
                    <a
                      key={index}
                      href={getScreenshotUrl(planningRepo, screenshot)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-stone-200 dark:border-stone-700 rounded overflow-hidden hover:border-lime-500 dark:hover:border-lime-400 transition-colors"
                    >
                      <img
                        src={getScreenshotUrl(planningRepo, screenshot)}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="px-2 py-1 bg-stone-50 dark:bg-stone-800 text-xs text-stone-500 dark:text-stone-400 truncate">
                        {screenshot.split('/').pop()}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function LabelBadge({ label }: { label: IssueLabel }) {
  const colors = getLabelColor(label)
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
      {label}
    </span>
  )
}

function formatDate(isoString: string): string {
  if (!isoString) return 'Unknown'
  try {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return 'Unknown'
  }
}
