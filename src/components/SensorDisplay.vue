<template>
  <q-card class="full-height bg-positive">
    <q-card-section class="full-height">
      <div class="text-h6">{{ sensorData.name }}</div>

      <q-separator inset />

      <div class="text-h3">{{ sensorData.temperature }}°C</div>
      <div class="text-h4">{{ sensorData.humidity }}% RH</div>
      <div class="text-italic">
        Last seen: {{ sensorData.lastSeen.toLocaleString() }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SensorData } from 'components/models';

export default defineComponent({
  name: 'SensorDisplay',
  props: {
    sensorData: {
      type: Object as PropType<SensorData>,
      required: true,
    },
  },
});
</script>
