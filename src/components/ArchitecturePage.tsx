import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AppLayout } from '@/components/AppLayout'
import { EmptyState } from '@/components/EmptyState'
import { StepIndicator, type StepStatus } from '@/components/StepIndicator'
import { NextPhaseButton } from '@/components/NextPhaseButton'
import { loadProductData } from '@/lib/product-loader'

export function ArchitecturePage() {
  const productData = useMemo(() => loadProductData(), [])
  const architecture = productData.architecture

  const hasArchitecture = !!architecture
  const stepStatus: StepStatus = hasArchitecture ? 'completed' : 'current'

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page intro */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Architecture
          </h1>
          <p className="text-stone-600 dark:text-stone-400">
            Document technical decisions, tech stack choices, and architectural patterns for implementation.
          </p>
        </div>

        {/* Step 1: Technical Decisions */}
        <StepIndicator step={1} status={stepStatus} isLast={!hasArchitecture}>
          {!architecture ? (
            <EmptyState type="architecture" />
          ) : (
            <div className="space-y-6">
              {/* Tech Stack */}
              {architecture.techStack.length > 0 && (
                <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Tech Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Group by category */}
                      {groupByCategory(architecture.techStack).map(([category, items]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
                            {category}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {items.map((item, index) => (
                              <div
                                key={index}
                                className="bg-stone-50 dark:bg-stone-800/50 rounded-lg px-4 py-3"
                              >
                                <span className="font-medium text-stone-900 dark:text-stone-100">
                                  {item.name}
                                </span>
                                {item.details && (
                                  <span className="text-stone-600 dark:text-stone-400">
                                    : {item.details}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Architecture Decisions */}
              {architecture.decisions.length > 0 && (
                <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Architecture Decisions
                      <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
                        ({architecture.decisions.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {architecture.decisions.map((decision, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-stone-200 dark:border-stone-700 pl-4"
                        >
                          <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                            {decision.title}
                          </h4>
                          {decision.context && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                Context:{' '}
                              </span>
                              <span className="text-stone-700 dark:text-stone-300">
                                {decision.context}
                              </span>
                            </div>
                          )}
                          {decision.decision && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                Decision:{' '}
                              </span>
                              <span className="text-stone-700 dark:text-stone-300">
                                {decision.decision}
                              </span>
                            </div>
                          )}
                          {decision.consequences && (
                            <div>
                              <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                Consequences:{' '}
                              </span>
                              <span className="text-stone-700 dark:text-stone-300">
                                {decision.consequences}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Integration Notes */}
              {architecture.integrations.length > 0 && (
                <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                      Integration Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {architecture.integrations.map((integration, index) => (
                        <div key={index}>
                          <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
                            {integration.category}
                          </h4>
                          <ul className="space-y-1">
                            {integration.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
                                <span className="text-stone-700 dark:text-stone-300">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Edit hint */}
              <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  To update the technical decisions, run{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">/create-tdd</code>{' '}
                  or edit the file directly at{' '}
                  <code className="font-mono text-stone-800 dark:text-stone-200">
                    product/architecture/tech-decisions.md
                  </code>
                </p>
              </div>
            </div>
          )}
        </StepIndicator>

        {/* Next Phase Button - shown when architecture is complete */}
        {hasArchitecture && (
          <StepIndicator step={2} status="current" isLast>
            <NextPhaseButton nextPhase="export" />
          </StepIndicator>
        )}
      </div>
    </AppLayout>
  )
}

/**
 * Group tech stack items by category
 */
function groupByCategory(items: Array<{ category: string; name: string; details?: string }>) {
  const groups = new Map<string, Array<{ name: string; details?: string }>>()

  for (const item of items) {
    const existing = groups.get(item.category) || []
    existing.push({ name: item.name, details: item.details })
    groups.set(item.category, existing)
  }

  return Array.from(groups.entries())
}
