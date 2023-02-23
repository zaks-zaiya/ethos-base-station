<template>
  <div>
    <!-- For each sensor -->
    <div v-for="(sensor, index) in newSensorData" :key="index" class="q-mb-md">
      <div class="row q-mb-md">
        <!-- Display sensor number -->
        <div class="col-2 text-bold">Sensor {{ index + 1 }}</div>
        <!-- Things that can be edited -->
        <div class="col">
          <q-input
            outlined
            v-model="sensor.name"
            :rules="[(val) => checkAndSetSensorName(val, index)]"
            label="Location"
            class="q-mb-sm"
          />
          <q-input
            outlined
            v-model.number="sensor.id"
            :rules="[(val) => checkAndSetSensorId(val, index)]"
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
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const allSensorData = useSensorDataStore().allSensorData;
    // Get a deep copy of sensor data to prevent modification without verifying inputs
    const newSensorData = ref(useSensorDataStore().getDeepCopySensorData);

    const checkAndSetSensorName = (newName: string, index: number) => {
      if (newName?.length > 0) {
        allSensorData[index].name = newName;
        return true;
      }
      return 'Please enter sensor location';
    };

    const checkAndSetSensorId = (newId: number, index: number) => {
      // Check if ID is valid
      if (newId > 0 && newId < 1000) {
        // Update original value
        allSensorData[index].id = newId;
        return true;
      }
      return 'Enter a valid ID (1-999)';
    };

    return { newSensorData, checkAndSetSensorName, checkAndSetSensorId };
  },
});
</script>
