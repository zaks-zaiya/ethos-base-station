import { test, expect } from '@playwright/test';
import {
  fetchRecentDocumentsOfType,
  deleteDocuments,
} from './helpers/database';
import { takeScreenshot } from './helpers/screenshot';

const baseUrl = 'http://127.0.0.1:9000';
const settingsUrl = baseUrl + '/#/settings';

test.describe('settings', () => {
  test.beforeEach(async ({ page }) => {
    // Give time for database to initialize
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to settings page
    await page.goto(settingsUrl);

    // Type in passcode and click submit
    await page.getByRole('button', { name: '3' }).click();
    await page.getByRole('button', { name: '2' }).click();
    await page.getByRole('button', { name: '1' }).click();
    await page.getByRole('button', { name: '4' }).click();
    await page.getByRole('button', { name: 'submit' }).click();
  });

  test('should be on settings page', async ({ page }) => {
    await expect(page).toHaveURL(settingsUrl);
  });

  test('should set user preferences and save to CouchDB', async ({ page }) => {
    // Select preferences tab
    await page.getByText('assignmentPreferences').click();

    // Select text to speech alerts radio
    const ttsRadio = page
      .getByRole('cell', { name: 'Text to speech alerts' })
      .getByRole('radio');
    await ttsRadio.click();
    expect(await ttsRadio.isChecked()).toBe(true);

    // Select that don't have access to air conditioning
    const tableCell = page
      .locator('tr:has-text("Air conditioning")')
      .getByRole('cell')
      .nth(1);
    await tableCell.click();
    const labelText = await tableCell.textContent();
    expect(labelText).toBe('No');

    // Select that follow up should be done (button to click is next sibling from label)
    const toggleFocusGroup = page
      .locator(
        'div:has-text("Would you be interested in a follow up with a focus group discussion?") + div'
      )
      .nth(0);
    await toggleFocusGroup.click();
    expect(await toggleFocusGroup.textContent()).toBe('Yes');

    await takeScreenshot(page, 'dataPreferences-1.png');

    // Go back home which will trigger settings saving
    await page.getByRole('link', { name: 'go back to home' }).click();

    // Give time for data to post to database
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await takeScreenshot(page, 'dataPreferences-2.png');

    // Check data appears on CouchDB
    const recentPreferenceDocs = await fetchRecentDocumentsOfType(
      'preferences'
    );
    expect(recentPreferenceDocs).toHaveLength(1);

    // Delete the recently created documents
    await deleteDocuments(recentPreferenceDocs);

    // Database should now be reset
    expect(await fetchRecentDocumentsOfType('preferences')).toHaveLength(0);
  });
});
