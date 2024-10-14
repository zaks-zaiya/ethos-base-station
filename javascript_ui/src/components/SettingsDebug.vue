<template>
  <div>
    <div class="text-h6 q-mb-md">Debug Information</div>

    <!-- Display Python socket info -->
    <div class="debug-section">
      <div class="text-subtitle2">Python Socket Info:</div>
      <div v-if="socketStore.isConnected">Connected</div>
      <div v-else>Not Connected</div>
    </div>

    <!-- Display local PouchDB info -->
    <div class="debug-section">
      <div class="text-subtitle2">Database Info:</div>
      <pre v-if="databaseInfo">{{ JSON.stringify(databaseInfo, null, 2) }}</pre>
      <div v-else>Loading database info...</div>
    </div>

    <!-- Display remote CouchDB info -->
    <div class="debug-section">
      <div class="text-subtitle2">Replication Status:</div>
      <div>{{ databaseStore.replicationStatus }}</div>
      <div>{{ databaseStore.replicationErrorMessage }}</div>
    </div>

    <!-- Sensor debug info -->
    <div class="text-h6 q-mb-md q-mt-xl">Sensor Debug Information</div>
    <div v-for="sensor in visibleSensors" :key="sensor.id" class="q-mb-lg">
      <q-card>
        <q-card-section>
          <div class="text">{{ sensor.location || 'Unknown Location' }}</div>
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>ID: {{ sensor.id || 'Not set' }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Temperature:
                  {{
                    sensor.temperature !== undefined
                      ? `${sensor.temperature}°C`
                      : 'N/A'
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Humidity:
                  {{
                    sensor.humidity !== undefined
                      ? `${sensor.humidity}%`
                      : 'N/A'
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Voltage:
                  {{
                    sensor.voltage !== undefined ? `${sensor.voltage}V` : 'N/A'
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label
                  >RSSI:
                  {{
                    sensor.rssi !== undefined ? `${sensor.rssi} dBm` : 'N/A'
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Last Seen:
                  {{
                    sensor.lastSeen ? formatDate(sensor.lastSeen) : 'Never'
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Core Temperature Delta:
                  {{
                    sensor.coreTemperatureDelta !== undefined
                      ? `${sensor.coreTemperatureDelta}°C`
                      : 'N/A'
                  }}</q-item-label
                >
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label
                  >Risk Level: {{ sensor.riskLevel || 'N/A' }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { date } from 'quasar';
import { storeToRefs } from 'pinia';
import { useDatabaseStore } from 'src/stores/database';
import { useSocketStore } from 'src/stores/socket';
import { useDataSensorStore } from 'src/stores/dataSensor';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const socketStore = useSocketStore();
    const dataSensorStore = useDataSensorStore();
    const { visibleSensors } = storeToRefs(dataSensorStore);
    const databaseStore = useDatabaseStore();
    const databaseInfo: Ref<undefined | string | PouchDB.Core.DatabaseInfo> =
      ref(undefined);

    onMounted(async () => {
      databaseInfo.value = await databaseStore.fetchDatabaseInfo();
    });

    const formatDate = (dateToFormat: Date | undefined) => {
      if (!dateToFormat) return 'N/A';
      const formattedDate = date.formatDate(
        dateToFormat,
        'YYYY-MM-DD HH:mm:ss'
      );
      return formattedDate;
    };

    return {
      socketStore,
      databaseStore,
      databaseInfo,
      visibleSensors,
      formatDate,
    };
  },
});
</script>

<style scoped>
.debug-section {
  border: 1px solid #eee;
  padding: 1em;
  margin: 1em 0;
}
</style>
