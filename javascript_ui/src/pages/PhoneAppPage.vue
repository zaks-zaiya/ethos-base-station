<template>
  <q-page class="row items-center justify-center">
    <div class="text-h2 text-grey text-center text-weight-bold text-container">
      You can press the power button at the top right to sleep the device
    </div>
    <q-list>
      <div class="text">Sensor Status:</div>
      <div
        v-for="sensor in dataSensorStore.getSortedSensorData"
        :key="sensor.id"
      >
        <CardSensorBasic :sensor="sensor"></CardSensorBasic>
      </div>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import CardSensorBasic from 'components/CardSensorBasic.vue';
import { useDataSensorStore } from 'src/stores/dataSensor';

const dataSensorStore = useDataSensorStore();
</script>

<style scoped>
.text-container {
  width: 80%;
}
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
