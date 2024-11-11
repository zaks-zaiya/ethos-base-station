<template>
  <q-item class="q-py-sm items-center">
    <q-icon
      :name="sensorState.isOffline ? 'close' : 'check'"
      :color="sensorState.isOffline ? 'negative' : 'positive'"
      size="sm"
      class="q-mx-sm"
    />
    <q-icon
      :name="sensorState.signalStrengthIcon.value"
      size="sm"
      class="q-mx-sm"
    />
    {{ sensor.location || 'Undefined' }}
    ({{ sensor.id || 'No ID' }})
    {{ sensorState.formattedLastSeen }}
  </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SensorData } from 'src/typings/data-types';
import { useSensorState } from 'src/composables/useSensorState';

export default defineComponent({
  name: 'SimpleSensor',
  props: {
    sensor: {
      type: Object as PropType<SensorData>,
      required: true,
    },
  },
  setup(props) {
    const sensorState = useSensorState(props.sensor);
    return {
      sensorState,
    };
  },
});
</script>
