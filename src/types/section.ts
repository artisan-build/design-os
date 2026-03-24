/**
 * Section types for Design OS v2
 */

// =============================================================================
// Scenario Support
// =============================================================================

/** A single scenario's data (everything except _meta and _scenarios) */
export type ScenarioData = Record<string, unknown>

/** Information about available scenarios in a section */
export interface ScenarioInfo {
  /** Scenario name (the key from _scenarios object) */
  name: string
  /** The actual data for this scenario */
  data: ScenarioData
}

/** Parsed data.json with scenario support */
export interface ParsedSectionData {
  /** Metadata describing models and relationships */
  meta: {
    models: Record<string, string>
    relationships: string[]
  } | null
  /** List of available scenarios (first is default) */
  scenarios: ScenarioInfo[]
  /** Raw data object for backward compatibility */
  raw: Record<string, unknown>
}

// =============================================================================
// Section Data
// =============================================================================

export interface SectionData {
  sectionId: string
  spec: string | null
  specParsed: ParsedSpec | null
  data: Record<string, unknown> | null
  /** Parsed data with scenario support */
  dataParsed: ParsedSectionData | null
  screenDesigns: ScreenDesignInfo[]
  screenshots: ScreenshotInfo[]
}

export interface ParsedSpec {
  title: string
  overview: string
  userFlows: string[]
  uiRequirements: string[]
  /** Whether screen designs for this section should be wrapped in the app shell. Defaults to true. */
  useShell: boolean
}

export interface ScreenDesignInfo {
  name: string
  path: string
  componentName: string
}

export interface ScreenshotInfo {
  name: string
  path: string
  url: string
}
