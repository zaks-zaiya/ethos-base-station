<template>
  <q-card class="full-height" :class="backgroundColor">
    <q-card-section class="q-pa-sm">
      <div class="text-h6">
        {{ sensor.name ? sensor.name : 'Undefined' }}
        {{ sensor.id ? '' : '(ID Undefined)' }}
        <span v-if="isOffline">(Offline)</span>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="full-height q-pa-sm">
      <div class="text-h3">{{ sensor.temperature }}°C</div>
      <div class="text-h4 q-pb-md">{{ sensor.humidity }}% RH</div>
      <div class="text-italic">
        Last seen:
        {{ sensor.lastSeen ? sensor.lastSeen.toLocaleString() : 'Never' }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { SensorData } from 'components/models';

export default defineComponent({
  name: 'DisplaySensor',
  props: {
    sensor: {
      type: Object as PropType<SensorData>,
      required: true,
    },
  },
  setup(props) {
    // The current time/date
    let currentTime = ref(Date.now());
    // An interval which handles updating the currentTime
    let updateCurrentTimeInterval: NodeJS.Timeout | undefined = undefined;

    // The function which updates the currentTime
    let updateCurrentTime = () => {
      currentTime.value = Date.now();
    };

    // Update currentTime every 5 seconds
    onMounted(() => {
      updateCurrentTimeInterval = setInterval(updateCurrentTime, 5000);
    });

    // Clear the interval when unmounted
    onUnmounted(() => {
      clearInterval(updateCurrentTimeInterval);
    });

    // Calculate whether the sensor is offline using currentTime and lastSeen
    let isOffline = computed(() => {
      const lastSeen = props.sensor.lastSeen?.getTime();
      if (!lastSeen) {
        return true;
      }
      const timeDifference = Math.abs(lastSeen - currentTime.value);
      const thirtyMinutes = 1800000; // in ms
      return timeDifference > thirtyMinutes;
    });

    // Check whether the sensor name or id is undefined
    let isUndefined = computed(() => {
      return !props.sensor.id || !props.sensor.name;
    });

    // Calculate the WBGT for risk level
    let wetBulbTemperature = computed(() => {
      // Equation taken from:
      // https://physicscalc.com/physics/wet-bulb-calculator/
      let temperature = props.sensor.temperature;
      let humidity = props.sensor.humidity;
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

    // Return the risk level as 'high', 'medium', low' or '' (undefined)
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

    // Calculate what background color to use for the form card
    let backgroundColor = computed(() => {
      if (
        isUndefined.value ||
        !props.sensor.temperature ||
        !props.sensor.humidity
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
