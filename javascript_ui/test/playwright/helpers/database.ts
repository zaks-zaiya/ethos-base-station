import axios from 'axios';
import { usernameToDbName } from 'src/helpers/database';

const databaseName = usernameToDbName(
  process.env.USER_ID ? process.env.USER_ID : ''
);
const databaseUrl = `http://${process.env.USER_ID}:${process.env.USER_PASSWORD}@localhost:5984/${databaseName}`;

interface Doc {
  _id: string;
  _rev: string;
  type: string;
  time: string;
  // anything else the document has
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
