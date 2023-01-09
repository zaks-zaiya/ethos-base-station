<template>
  <q-card flat bordered class="full-height">
    <q-card-section>
      <div class="text-h6">{{ sensorData.name }}</div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div>{{ sensorData.temperature }}</div>
      <div>{{ sensorData.humidity }}</div>
      <div>{{ sensorData.lastSeen }}</div>
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
