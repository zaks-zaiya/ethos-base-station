import { test, expect } from '@playwright/test';
import axios from 'axios';

const baseUrl = 'http://127.0.0.1:9000';
const initializeUrl = baseUrl + '/#/initialize';
const settingsUrl = baseUrl + '/#/settings';

interface Doc {
  _id: string;
  _rev: string;
  type: string;
  time: string;
  // anything else the document has
}

interface Row {
  id: string;
  key: string;
  doc: Doc;
}

async function fetchAllDocuments(): Promise<Doc[]> {
  const url = 'http://localhost:5984/user_999/_all_docs?include_docs=true';

  try {
    const response = await axios.get(url);
    return response.data.rows.map((row: Row) => row.doc);
  } catch (error) {
    console.error('Failed to fetch data from CouchDB:', error);
    return [];
  }
}

function filterPreferencesFromLastMinute(docs: Doc[]) {
  const oneMinuteAgo = Date.now() - 60000; // 60,000 ms = 1 minute

  return docs.filter((doc) => {
    return (
      doc.type === 'preferences' && new Date(doc.time).getTime() > oneMinuteAgo
    );
  });
}

test.describe('settings', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to initialize page
    await page.goto(initializeUrl);
    // Setup user ID
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByLabel('User ID (number)').click();
    await page.locator('div').filter({ hasText: /^9$/ }).click();
    await page.locator('div').filter({ hasText: /^9$/ }).click();
    await page.locator('div').filter({ hasText: /^9$/ }).click();
    expect(await page.getByLabel('User ID (number)').inputValue()).toMatch(
      /999/
    );

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

    // Go back home which will trigger settings saving
    await page.getByRole('link', { name: 'go back to home' }).click();
    // TODO: Data not posting correctly for some reason

    // Check data appears on CouchDB
    const recentPreferenceDocs = filterPreferencesFromLastMinute(
      await fetchAllDocuments()
    );
    console.log(recentPreferenceDocs);
    expect(recentPreferenceDocs).toHaveLength(1);
  });

  test.afterAll(() => {
    // TODO: Remove all CouchDB posts made in last x minutes
    // TODO: Or see if a fresh couchdb instance can be used each test
  });
});
