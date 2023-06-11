<template>
  <q-card class="fontsize-18 bg-grey-2">
    <q-card-section>
      <div class="text-bold">Should you use a fan?</div>
      <div v-for="sensor of dataSensorStore.allSensorData" :key="sensor.name">
        {{ sensor.name }}:
        <q-avatar icon="done" size="lg" color="positive" text-color="white" />
        <!-- <q-icon name="done" color="positive" /> -->
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue';
import { useDataSensorStore } from 'src/stores/dataSensor';

export default defineComponent({
  setup() {
    const dataSensorStore = useDataSensorStore();
    return { dataSensorStore };
  },
});
</script>
