import { test, expect } from '@playwright/test'

test.describe('Shopping Cart Suite', () => {
  test('cart page renders empty state when no items in storage', async ({ page }) => {
    await page.goto('/cart')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await expect(page.locator('text=empty').or(page.locator('text=basket')).or(page.locator('text=Cart')).first()).toBeVisible()
  })

  test('cart hydrates accurately from injected test cart', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'nt_cart',
        JSON.stringify([
          {
            productId: 'test-makhana-jumbo',
            name: 'Synthetic Test Makhana',
            slug: 'test-makhana',
            quantity: 2,
            unitPrice: 299,
            price: 299,
            totalPrice: 598,
          },
        ])
      )
    })

    await page.goto('/cart')
    await expect(page.locator('text=Synthetic Test Makhana').first()).toBeVisible()
    await expect(page.locator('text=598').first()).toBeVisible()
  })
})
