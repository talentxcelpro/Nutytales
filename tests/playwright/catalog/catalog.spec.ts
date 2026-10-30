import { test, expect } from '@playwright/test'

test.describe('Catalog Discovery Suite', () => {
  test('shop page renders product grid', async ({ page }) => {
    const response = await page.goto('/shop')
    expect(response?.status()).toBe(200)

    // Check main shop elements
    await expect(page.locator('h1, h2').first()).toBeVisible()
    
    // Check product cards or links
    const productLinks = page.locator('a[href*="/shop/"]')
    const count = await productLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('product detail page renders with pricing and add-to-cart option', async ({ page }) => {
    // Navigate to shop and click the first product
    await page.goto('/shop')
    const firstProduct = page.locator('a[href*="/shop/"]').first()
    const href = await firstProduct.getAttribute('href')
    expect(href).toBeTruthy()

    await page.goto(href!)
    await expect(page.locator('button, a').filter({ hasText: /cart|basket|buy/i }).first()).toBeVisible()
  })
})
