import { expect, test, type Page } from '@playwright/test'

/** Journey 4 — Dark/light toggle switches the html class and persists. */

async function chooseTheme(page: Page, toggleLabel: string, itemName: string): Promise<void> {
  await page.getByRole('button', { name: toggleLabel }).click()
  await page.getByRole('menuitem', { name: itemName }).click()
}

test('theme toggle switches to dark, persists on reload, and back to light (en)', async ({
  page,
}) => {
  await page.goto('/en')
  const html = page.locator('html')

  await chooseTheme(page, 'Toggle theme', 'Dark')
  await expect(html).toHaveClass(/dark/)

  // Persistence: next-themes stores the choice in localStorage.
  await page.reload()
  await expect(html).toHaveClass(/dark/)

  await chooseTheme(page, 'Toggle theme', 'Light')
  await expect(html).not.toHaveClass(/dark/)

  await page.reload()
  await expect(html).not.toHaveClass(/dark/)
})

test('theme toggle works with Turkish labels (tr)', async ({ page }) => {
  await page.goto('/tr')
  const html = page.locator('html')

  await chooseTheme(page, 'Temayı değiştir', 'Koyu')
  await expect(html).toHaveClass(/dark/)

  await page.reload()
  await expect(html).toHaveClass(/dark/)
})
