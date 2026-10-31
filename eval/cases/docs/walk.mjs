// Docs: the long state is a document typed past the window, the failure a short sample hides.

/** A new document with 70 lines typed into it, at a fast typist's pace with Enter as its own key:
 * machine-speed typing broke editors that a person's typing doesn't. */
export async function long(page) {
  await page
    .getByRole('button', { name: /new|新建|新文档/i })
    .filter({ visible: true })
    .first()
    .click();
  await page.waitForTimeout(500);
  await page.locator('[contenteditable="true"], textarea').filter({ visible: true }).last().click();
  for (let i = 1; i <= 70; i++) {
    await page.keyboard.type(`Typed line ${i}.`, { delay: 15 });
    await page.keyboard.press('Enter');
  }
  await page.waitForTimeout(400);
}
