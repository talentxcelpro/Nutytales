// ─── Nuty Tales PLIE — Agent Adapter Contract ─────────────────────────────────

import {
  PlieEnvironmentConfig,
  PlieScenarioDefinition,
  PlieScenarioStep,
  PlieSyntheticPersona,
  PlieFinding,
} from '../types'

export interface PlieScenarioExecutionResult {
  scenarioId: string
  status: 'PASS' | 'FAIL' | 'BLOCKED'
  durationMs: number
  steps: PlieScenarioStep[]
  findings: PlieFinding[]
  artifacts: {
    screenshots?: string[]
    videoPath?: string
    traceZipPath?: string
    harPath?: string
  }
}

export interface PlieAgentAdapter {
  readonly id: string
  readonly name: string
  readonly capabilities: Array<'browser' | 'market_sim' | 'load' | 'security'>

  initialize(env: PlieEnvironmentConfig): Promise<{ ready: boolean; error?: string }>
  healthCheck(): Promise<boolean>
  executeScenario(
    scenario: PlieScenarioDefinition,
    persona: PlieSyntheticPersona,
    executionId: string
  ): Promise<PlieScenarioExecutionResult>
  teardown(): Promise<void>
}
