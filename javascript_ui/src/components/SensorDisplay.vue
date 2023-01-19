<template>
  <q-card class="full-height" :class="backgroundColor">
    <q-card-section class="full-height">
      <div class="text-h6">
        {{ sensorData.name }} <span v-if="isOffline">(Offline)</span>
      </div>

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
import { defineComponent, PropType, computed } from 'vue';
import { SensorData } from 'components/models';

export default defineComponent({
  name: 'SensorDisplay',
  props: {
    sensorData: {
      type: Object as PropType<SensorData>,
      required: true,
    },
  },
  setup(props) {
    let isOffline = computed(() => {
      let timeDifference = Math.abs(
        props.sensorData.lastSeen.getTime() - Date.now()
      );
      let thirtyMinutes = 1800000; // in ms
      return timeDifference > thirtyMinutes;
    });

    let wetBulbTemperature = computed(() => {
      // Equation taken from:
      // https://physicscalc.com/physics/wet-bulb-calculator/
      let temperature = props.sensorData.temperature;
      let humidity = props.sensorData.humidity;
      let wetBulbTemperature =
        temperature *
          Math.atan(0.151977 * Math.pow(humidity + 8.313659, 1 / 2)) +
        Math.atan(temperature + humidity) -
        Math.atan(humidity - 1.676331) +
        0.00391838 *
          Math.pow(humidity, 3 / 2) *
          Math.atan(0.023101 * humidity) -
        4.686035;
      return wetBulbTemperature;
    });

    let riskLevel = computed(() => {
      if (wetBulbTemperature.value >= 30) {
        return 'high';
      } else if (wetBulbTemperature.value >= 25) {
        return 'medium';
      } else if (wetBulbTemperature.value < 25) {
        return 'low';
      } else {
        console.log('Unable to find correct risk level');
        return '';
      }
    });

    let backgroundColor = computed(() => {
      if (isOffline.value) {
        // Sensor is offline
        return 'bg-grey';
      } else if (riskLevel.value == 'low') {
        // Low risk, background green
        return 'bg-positive';
      } else if (riskLevel.value == 'medium') {
        // Medium risk, background yellow
        return 'bg-warning';
      } else if (riskLevel.value == 'high') {
        // High risk, background red
        return 'bg-negative';
      } else {
        console.error('Unable to find correct background color');
        return 'bg-grey';
      }
    });

    return { isOffline, backgroundColor };
  },
});
</script>
