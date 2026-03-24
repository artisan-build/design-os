/**
 * Section Data Context - Provides scenario-aware data to preview components
 *
 * Preview wrappers use useSectionData() to get the current scenario's data.
 * The scenario is determined by the ?scenario URL param.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadSectionData, getScenarioData } from '@/lib/section-loader'
import type { ScenarioInfo } from '@/types/section'

interface SectionDataContextValue {
  /** The current scenario's data */
  data: Record<string, unknown>
  /** Name of the current scenario */
  scenarioName: string
  /** All available scenarios */
  scenarios: ScenarioInfo[]
  /** Section ID */
  sectionId: string
}

const SectionDataContext = createContext<SectionDataContextValue | null>(null)

interface SectionDataProviderProps {
  sectionId: string
  children: ReactNode
}

/**
 * Provides section data to preview components based on URL scenario param
 */
export function SectionDataProvider({ sectionId, children }: SectionDataProviderProps) {
  const [searchParams] = useSearchParams()
  const scenarioParam = searchParams.get('scenario')

  const value = useMemo(() => {
    const sectionData = loadSectionData(sectionId)
    const parsed = sectionData.dataParsed

    if (!parsed) {
      return {
        data: {},
        scenarioName: 'Default',
        scenarios: [],
        sectionId,
      }
    }

    // Get the scenario data (defaults to first scenario)
    const scenarioName = scenarioParam || parsed.scenarios[0]?.name || 'Default'
    const data = getScenarioData(parsed, scenarioParam || undefined)

    return {
      data,
      scenarioName,
      scenarios: parsed.scenarios,
      sectionId,
    }
  }, [sectionId, scenarioParam])

  return (
    <SectionDataContext.Provider value={value}>
      {children}
    </SectionDataContext.Provider>
  )
}

/**
 * Hook to access the current scenario's data in preview components
 *
 * @example
 * ```tsx
 * import { useSectionData } from '@/lib/section-data-context'
 *
 * export default function InvoiceListPreview() {
 *   const { invoices } = useSectionData<{ invoices: Invoice[] }>()
 *   return <InvoiceList invoices={invoices} />
 * }
 * ```
 */
export function useSectionData<T = Record<string, unknown>>(): T {
  const context = useContext(SectionDataContext)

  if (!context) {
    throw new Error(
      'useSectionData must be used within a SectionDataProvider. ' +
      'This hook is for preview wrappers rendered in Design OS.'
    )
  }

  return context.data as T
}

/**
 * Hook to access scenario metadata (name, all scenarios, etc.)
 */
export function useSectionDataContext(): SectionDataContextValue {
  const context = useContext(SectionDataContext)

  if (!context) {
    throw new Error(
      'useSectionDataContext must be used within a SectionDataProvider.'
    )
  }

  return context
}
