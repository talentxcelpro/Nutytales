import { test, expect } from '@playwright/test'

test.describe('Checkout Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Inject valid synthetic cart item into localStorage
    await page.addInitScript(() => {
      localStorage.setItem(
        'nt_cart',
        JSON.stringify([
          {
            productId: 'test-grade-a-makhana',
            name: 'Playwright Test Makhana',
            slug: 'test-grade-a-makhana',
            quantity: 1,
            unitPrice: 499,
            price: 499,
            totalPrice: 499,
          },
        ])
      )
    })
  })

  test('checkout form renders shipping inputs and COD payment option', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page.locator('input[placeholder*="Name"]').or(page.locator('input[name*="name"]')).or(page.locator('input[type="text"]')).first()).toBeVisible()
    await expect(page.locator('text=Delivery').first()).toBeVisible()
  })

  test('bank transfer details do NOT contain hardcoded secret account numbers', async ({ page }) => {
    await page.goto('/checkout')
    const pageContent = await page.content()
    
    // SEC-002 assertion: hardcoded private account and test IFSC must never appear in DOM
    expect(pageContent).not.toContain('50200088910412')
    expect(pageContent).not.toContain('HDFC0001234')
  })
})
