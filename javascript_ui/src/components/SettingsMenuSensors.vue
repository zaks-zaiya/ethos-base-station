<template>
  <div>
    <!-- For each sensor -->
    <div v-for="(sensor, index) in allSensorData" :key="index" class="q-mb-md">
      <div class="row q-mb-md">
        <!-- Display sensor number -->
        <div class="col-2 text-bold">Sensor {{ index + 1 }}</div>
        <!-- Things that can be edited -->
        <div class="col">
          <q-input
            outlined
            v-model="sensor.name"
            :rules="[
              (val) => (val.length > 0 ? true : 'Please enter sensor location'),
            ]"
            label="Location"
            class="q-mb-sm"
          />
          <q-input
            outlined
            v-model.number="sensor.id"
            :rules="[checkSensorId]"
            type="number"
            label="ID"
            hint="The ID number on the case"
          />
        </div>
      </div>
      <!-- Dividing line between sensors -->
      <q-separator />
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

    const checkSensorId = (id: number) => {
      if (id > 0 && id < 1000) {
        return true;
      }
      return 'Enter valid ID (1-999)';
    };

    console.log(allSensorData);

    return { allSensorData, checkSensorId };
  },
});
</script>
