import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown, Layers } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import type { ParsedSectionData, ScenarioInfo } from '@/types/section'

interface DataMeta {
  models: Record<string, string>
  relationships: string[]
}

interface DataCardProps {
  data: Record<string, unknown> | null
  dataParsed?: ParsedSectionData | null
}

function extractMeta(data: Record<string, unknown>): DataMeta | null {
  const meta = data._meta as DataMeta | undefined
  if (meta && typeof meta === 'object' && meta.models && meta.relationships) {
    return meta
  }
  return null
}

function countRecords(data: Record<string, unknown>): number {
  // Count arrays at the top level as record collections (excluding _meta and _scenarios)
  let count = 0
  for (const [key, value] of Object.entries(data)) {
    if (key !== '_meta' && key !== '_scenarios' && Array.isArray(value)) {
      count += value.length
    }
  }
  return count
}

function countScenarioRecords(scenario: ScenarioInfo): number {
  let count = 0
  for (const [, value] of Object.entries(scenario.data)) {
    if (Array.isArray(value)) {
      count += value.length
    }
  }
  return count
}

export function DataCard({ data, dataParsed }: DataCardProps) {
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null)

  // Empty state
  if (!data) {
    return <EmptyState type="data" />
  }

  const meta = dataParsed?.meta || extractMeta(data)
  const scenarios = dataParsed?.scenarios || []
  const hasMultipleScenarios = scenarios.length > 1

  return (
    <Card className="border-stone-200 dark:border-stone-700 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            Sample Data
          </CardTitle>
          {hasMultipleScenarios && (
            <span className="text-xs font-medium text-lime-600 dark:text-lime-400 bg-lime-100 dark:bg-lime-900/30 px-2 py-0.5 rounded flex items-center gap-1">
              <Layers className="w-3 h-3" strokeWidth={1.5} />
              {scenarios.length} scenarios
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Data Shape Descriptions */}
        {meta && (
          <div className="space-y-6">
            {/* Models - Card Grid */}
            <div>
              <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
                Data Shapes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(meta.models).map(([modelName, description]) => (
                  <div
                    key={modelName}
                    className="bg-stone-50 dark:bg-stone-800/50 rounded-lg p-4"
                  >
                    <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                      {modelName}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Relationships */}
            {meta.relationships.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
                  How They Connect
                </h4>
                <ul className="space-y-2">
                  {meta.relationships.map((relationship, index) => (
                    <li
                      key={index}
                      className="text-stone-700 dark:text-stone-300 flex items-start gap-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 dark:bg-stone-500 mt-2 shrink-0" />
                      {relationship}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Scenarios Section */}
        {hasMultipleScenarios ? (
          <div>
            <h4 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-3">
              Scenarios
            </h4>
            <div className="space-y-2">
              {scenarios.map((scenario) => {
                const isExpanded = expandedScenario === scenario.name
                const recordCount = countScenarioRecords(scenario)
                return (
                  <Collapsible
                    key={scenario.name}
                    open={isExpanded}
                    onOpenChange={(open) => setExpandedScenario(open ? scenario.name : null)}
                  >
                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group">
                      <div className="flex items-center gap-2">
                        <ChevronDown
                          className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                          strokeWidth={1.5}
                        />
                        <span className="font-medium text-stone-700 dark:text-stone-300">
                          {scenario.name}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        {recordCount} {recordCount === 1 ? 'record' : 'records'}
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="bg-stone-50 dark:bg-stone-900 rounded-md p-4 overflow-x-auto mt-2 ml-6">
                        <pre className="text-xs font-mono text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                          {JSON.stringify(scenario.data, null, 2)}
                        </pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </div>
          </div>
        ) : (
          /* Single scenario - show collapsible JSON */
          <Collapsible
            open={expandedScenario === 'json'}
            onOpenChange={(open) => setExpandedScenario(open ? 'json' : null)}
          >
            <CollapsibleTrigger className="flex items-center gap-2 text-left group">
              <ChevronDown
                className={`w-4 h-4 text-stone-400 dark:text-stone-500 transition-transform ${
                  expandedScenario === 'json' ? 'rotate-180' : ''
                }`}
                strokeWidth={1.5}
              />
              <span className="text-xs text-stone-500 dark:text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
                {expandedScenario === 'json' ? 'Hide' : 'View'} JSON
              </span>
              {scenarios[0] && (
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  ({countScenarioRecords(scenarios[0])} records)
                </span>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-stone-50 dark:bg-stone-900 rounded-md p-4 overflow-x-auto mt-3">
                <pre className="text-xs font-mono text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
                  {JSON.stringify(scenarios[0]?.data || {}, null, 2)}
                </pre>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}
