// Music: the long state is the whole library of songs, in the pane beside the sidebar.
export async function long(page) {
  await page
    .getByText(/^(songs|all songs|歌曲|全部歌曲)$/i)
    .filter({ visible: true })
    .first()
    .click();
  await page.waitForTimeout(500);
}
