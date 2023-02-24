<template>
  <q-card class="full-height" :class="backgroundColor">
    <q-card-section class="q-pa-sm">
      <div class="text-h6">
        {{ sensorData.name ? sensorData.name : 'Undefined' }}
        {{ sensorData.id ? '' : '(ID Undefined)' }}
        <span v-if="isOffline">(Offline)</span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="full-height q-pa-sm">
      <div class="text-h3">{{ sensorData.temperature }}°C</div>
      <div class="text-h4 q-pb-md">{{ sensorData.humidity }}% RH</div>
      <div class="text-italic">
        Last seen:
        {{
          sensorData.lastSeen ? sensorData.lastSeen.toLocaleString() : 'Never'
        }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { SensorData } from 'components/models';

export default defineComponent({
  name: 'DisplaySensor',
  props: {
    sensorData: {
      type: Object as PropType<SensorData>,
      required: true,
    },
  },
  setup(props) {
    let isUndefined = computed(() => {
      return !props.sensorData.id || !props.sensorData.name;
    });

    let isOffline = computed(() => {
      const lastSeen = props.sensorData.lastSeen?.getTime();
      if (!lastSeen) {
        return true;
      }
      const timeDifference = Math.abs(lastSeen - Date.now());
      const thirtyMinutes = 1800000; // in ms
      return timeDifference > thirtyMinutes;
    });

    let wetBulbTemperature = computed(() => {
      // Equation taken from:
      // https://physicscalc.com/physics/wet-bulb-calculator/
      let temperature = props.sensorData.temperature;
      let humidity = props.sensorData.humidity;
      if (!temperature || !humidity) {
        return undefined;
      }
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
      // Check undefined
      if (!wetBulbTemperature.value) {
        console.log('Unable to find correct risk level (no WBGT defined)');
        return '';
      }
      if (wetBulbTemperature.value >= 30) {
        return 'high';
      } else if (wetBulbTemperature.value >= 25) {
        return 'medium';
      } else if (wetBulbTemperature.value < 25) {
        return 'low';
      } else {
        console.log('Unable to find correct risk level (unknown error)');
        return '';
      }
    });

    let backgroundColor = computed(() => {
      if (
        isUndefined.value ||
        !props.sensorData.temperature ||
        !props.sensorData.humidity
      ) {
        // Sensor is undefined
        return 'bg-grey-8 text-grey';
      } else if (isOffline.value) {
        // Sensor is offline
        return 'bg-grey text-grey-8';
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

    return { isUndefined, isOffline, backgroundColor };
  },
});
</script>
