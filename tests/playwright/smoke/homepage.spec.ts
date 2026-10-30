import { test, expect } from '@playwright/test'

test.describe('Smoke Suite — Core Front Door', () => {
  test('homepage loads and renders brand headings and key navigation', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    // Check title or main heading
    await expect(page).toHaveTitle(/Nuty\s*Tales/i)
    
    // Check navigation contains shop or catalog
    const shopLink = page.locator('a[href*="/shop"]').first()
    await expect(shopLink).toBeVisible()
  })

  test('robots.txt returns valid policy', async ({ page }) => {
    const response = await page.goto('/robots.txt')
    expect(response?.status()).toBe(200)
    const text = await response?.text()
    expect(text).toContain('User-agent:')
  })
})
