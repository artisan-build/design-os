import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, FlaskConical, CheckCircle2 } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { AcceptanceFeature, GherkinStep } from '@/types/section'

interface AcceptanceTestsCardProps {
  feature: AcceptanceFeature | null
}

function getStepColor(keyword: GherkinStep['keyword']): string {
  switch (keyword) {
    case 'Given':
      return 'text-blue-600 dark:text-blue-400'
    case 'When':
      return 'text-amber-600 dark:text-amber-400'
    case 'Then':
      return 'text-emerald-600 dark:text-emerald-400'
    case 'And':
    case 'But':
      return 'text-stone-500 dark:text-stone-400'
    default:
      return 'text-stone-600 dark:text-stone-300'
  }
}

export function AcceptanceTestsCard({ feature }: AcceptanceTestsCardProps) {
  const [expandedScenarios, setExpandedScenarios] = useState<Set<number>>(new Set([0]))

  if (!feature) {
    return <EmptyState type="acceptance-tests" />
  }

  const toggleScenario = (index: number) => {
    setExpandedScenarios((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-3">
          <FlaskConical className="w-5 h-5 text-violet-500" strokeWidth={1.5} />
          Acceptance Tests
          <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
            ({feature.scenarios.length} {feature.scenarios.length === 1 ? 'scenario' : 'scenarios'})
          </span>
        </CardTitle>
        {feature.description && (
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
            {feature.description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {feature.scenarios.map((scenario, index) => (
          <Collapsible
            key={index}
            open={expandedScenarios.has(index)}
            onOpenChange={() => toggleScenario(index)}
          >
            <div className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden">
              <CollapsibleTrigger asChild>
                <button className="w-full px-4 py-3 flex items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors text-left">
                  <div className="flex items-center gap-3 min-w-0">
                    <CheckCircle2
                      className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0"
                      strokeWidth={1.5}
                    />
                    <span className="font-medium text-stone-900 dark:text-stone-100 truncate">
                      {scenario.name}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {scenario.steps.length} steps
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 transition-transform shrink-0 ${
                      expandedScenarios.has(index) ? 'rotate-180' : ''
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="space-y-2 font-mono text-sm">
                    {scenario.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-2">
                        <span className={`font-semibold w-12 shrink-0 ${getStepColor(step.keyword)}`}>
                          {step.keyword}
                        </span>
                        <span className="text-stone-700 dark:text-stone-300">
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        {/* Edit hint */}
        <div className="bg-stone-100 dark:bg-stone-800 rounded-md px-4 py-3 mt-4">
          <p className="text-sm text-stone-600 dark:text-stone-400">
            To update acceptance tests, run{' '}
            <code className="font-mono text-stone-800 dark:text-stone-200">/write-acceptance-tests</code>{' '}
            or edit{' '}
            <code className="font-mono text-stone-800 dark:text-stone-200">acceptance.feature</code>{' '}
            directly.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
