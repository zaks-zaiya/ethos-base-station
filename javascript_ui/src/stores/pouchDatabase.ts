// src/stores/pouchStore.ts
import { defineStore } from 'pinia';
import PouchDB from 'pouchdb-browser';
import { useDataUserStore } from './dataUser';
import {
  AlertDatabaseStructure,
  BaseDatabaseStructure,
  PreferencesDatabaseStructure,
  SensorDatabaseStructure,
  SurveyDatabaseStructure,
  WeatherDatabaseStructure,
} from 'src/typings/database-types';

export const usePouchStore = defineStore({
  id: 'pouchDB',
  state: () => ({
    db: null as null | InstanceType<typeof PouchDB>,
  }),
  actions: {
    /**
     * Function that:
     * 1. If an existing database exists, closes it
     * 2. If a user id is defined sets up a database called user_${id}
     * TODO: 3. Sets up replication on a remote database
     */
    initializeDatabase() {
      const userDataStore = useDataUserStore();
      // 1. If an existing database exists, closes it
      if (this.db) {
        this.db.close();
      }
      // 2. If a user id is defined sets up a database called user_${id}
      if (userDataStore.id) {
        this.db = new PouchDB(`user_${userDataStore.id}`);
      }
      // TODO: 3. Sets up replication on a remote database
    },

    /**
     * Function which will post data to the PouchDB database
     * 1. Check that everything is initialised and ready
     * 2. Construct the data which will be sent to the database
     * 3. Try to send the data to the database and catch any errors
     * @param data The data which will be added to the database
     */
    async postDocument(
      data:
        | SensorDatabaseStructure
        | WeatherDatabaseStructure
        | PreferencesDatabaseStructure
        | SurveyDatabaseStructure
        | AlertDatabaseStructure
    ) {
      // 1. Check that everything is initialised and ready
      const userDataStore = useDataUserStore();
      if (!this.db || !userDataStore.id) {
        console.error('Trying to post data before database is initialized.');
        throw new Error('Trying to post data before database is initialized.');
      }

      // 2. Construct the data which will be sent to the database
      const baseData: BaseDatabaseStructure = {
        time: new Date(Date.now()),
        userId: userDataStore.id,
      };
      const sentData = { ...baseData, ...data };

      // 3. Try to send the data to the database and catch any errors
      try {
        const response = await this.db.post(sentData);
        if (!response.ok) {
          console.error('Database response indicates error has occurred');
          throw new Error('Database response indicates error has occurred');
        }
      } catch (error) {
        console.error('Failed to post document:', error);
        throw error;
      }
    },
  },
});
