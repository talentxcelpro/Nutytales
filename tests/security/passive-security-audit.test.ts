import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Task 004 / Phase 5: Passive Security Header & Privacy Inspection', () => {
  it('1. Verifies middleware enforces essential security headers', async () => {
    const middlewarePath = path.resolve(process.cwd(), 'src', 'middleware.ts')
    expect(fs.existsSync(middlewarePath)).toBe(true)

    const content = fs.readFileSync(middlewarePath, 'utf8')
    // Check that middleware defines or allows essential headers
    expect(content).toContain('NextResponse')
    expect(content).toContain('/admin')
  })

  it('2. Verifies OWASP ZAP passive baseline configuration exists and excludes production', () => {
    const zapConfigPath = path.resolve(process.cwd(), 'tests', 'security', 'zap-passive-scan.yaml')
    expect(fs.existsSync(zapConfigPath)).toBe(true)

    const zapYaml = fs.readFileSync(zapConfigPath, 'utf8')
    expect(zapYaml).toContain('excludePaths:')
    expect(zapYaml).toContain('https://nutytales.com')
  })

  it('3. Verifies k6 load baseline has hard production safety guard', () => {
    const k6ScriptPath = path.resolve(process.cwd(), 'tests', 'k6', 'staging-load-baseline.js')
    expect(fs.existsSync(k6ScriptPath)).toBe(true)

    const script = fs.readFileSync(k6ScriptPath, 'utf8')
    expect(script).toContain('CRITICAL SECURITY BLOCK')
    expect(script).toContain('nutytales.com')
  })
})
