<template>
  <q-card class="full-height" :class="getBackgroundColor">
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
  computed: {
    isOffline: function () {
      let timeDifference = Math.abs(
        this.sensorData.lastSeen.getTime() - Date.now()
      );
      let thirtyMinutes = 1800000; // in ms
      return timeDifference > thirtyMinutes;
    },
    getWetBulb: function () {
      // Equation taken from:
      // https://physicscalc.com/physics/wet-bulb-calculator/
      let temperature = this.sensorData.temperature;
      let humidity = this.sensorData.humidity;
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
    },
    getRiskLevel: function () {
      if (this.getWetBulb >= 30) {
        return 'high';
      } else if (this.getWetBulb >= 25) {
        return 'medium';
      } else if (this.getWetBulb < 25) {
        return 'low';
      } else {
        console.log('Unable to find correct risk level');
        return '';
      }
    },
    getBackgroundColor: function () {
      let risk = this.getRiskLevel;
      if (this.isOffline) {
        // Sensor is offline
        return 'bg-grey';
      } else if (risk == 'low') {
        // Low risk, background green
        return 'bg-positive';
      } else if (risk == 'medium') {
        // Medium risk, background yellow
        return 'bg-warning';
      } else if (risk == 'high') {
        // High risk, background red
        return 'bg-negative';
      } else {
        console.error('Unable to find correct background color');
        return 'bg-grey';
      }
    },
  },
});
</script>
