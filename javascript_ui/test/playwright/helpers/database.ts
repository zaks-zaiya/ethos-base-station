import { Page } from '@playwright/test';
import axios from 'axios';
import { usernameToDbName } from 'src/helpers/database';

// Database variables
const testingUserId = 999;
const testingUserPassword = '12345';
export const databaseName = usernameToDbName(testingUserId);
const databaseUrl = `http://${testingUserId}:${testingUserPassword}@localhost:5984/${databaseName}`;

interface Doc {
  _id: string;
  _rev: string;
  type: string;
  time: string;
  // anything else the document has
}

export async function setupDatabase(page: Page) {
  // Start awaiting for response from server before initiating request
  const dbResponsePromise = page.waitForResponse((response) => {
    const request = response.request();
    return (
      request.method() === 'GET' &&
      request.url().includes(`${databaseName}/_local/`)
    );
  });
  // Set User ID and Password for Database
  await page.getByLabel('User ID').click();
  await page.locator('div').filter({ hasText: /^9$/ }).click();
  await page.locator('div').filter({ hasText: /^9$/ }).click();
  await page.locator('div').filter({ hasText: /^9$/ }).click();
  await page.getByLabel('User Password').click();
  await page.locator('div').filter({ hasText: /^123$/ }).click();
  await page.locator('div').filter({ hasText: /^1$/ }).click();
  await page.locator('div').filter({ hasText: /^2$/ }).click();
  await page.locator('div').filter({ hasText: /^3$/ }).click();
  await page.locator('div').filter({ hasText: /^4$/ }).click();
  await page.locator('div').filter({ hasText: /^5$/ }).click();
  // Lose focus on keyboard to submit password
  await page.getByText('User Data').nth(1).click();

  // Return promise that resolves when DB is initialized
  return dbResponsePromise;
}

export async function fetchRecentDocumentsOfType(type: string): Promise<Doc[]> {
  // Calculate times for the last minute
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMinutes(endDate.getMinutes() - 1);

  const query = {
    selector: {
      type: type,
      time: {
        $gte: startDate.toISOString(),
        $lt: endDate.toISOString(),
      },
    },
  };

  try {
    const response = await axios.post(`${databaseUrl}/_find`, query);
    return response.data.docs;
  } catch (error) {
    console.error('Failed to fetch recent preferences from CouchDB:', error);
    return [];
  }
}

export async function deleteDocuments(documents: Doc[]): Promise<void> {
  try {
    for (const doc of documents) {
      const deleteURL = `${databaseUrl}/${doc._id}?rev=${doc._rev}`;
      await axios.delete(deleteURL);
    }
  } catch (error) {
    console.error('Failed to delete documents from CouchDB:', error);
  }
}
