<template>
  <div class="q-pb-md">
    <div v-for="(sensor, index) in allSensorData" :key="index">
      <div class="text-h6">Sensor {{ index + 1 }}</div>
      <q-separator />
      <q-input
        outlined
        v-model="sensor.name"
        label="Location"
        class="q-my-md"
      />
      <q-input outlined v-model="sensor.id" label="ID" class="q-mb-lg" />
    </div>
  </div>
</template>

<script lang="ts">
import { useSensorDataStore } from 'src/stores/sensorData';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const store = useSensorDataStore();

    const allSensorData = store.allSensorData;

    console.log(allSensorData);

    return { allSensorData };
  },
});
</script>
