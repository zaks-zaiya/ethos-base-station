<template>
  <q-dialog v-model="isDisconnected" :persistent="true">
    <q-card class="bg-negative text-white text-h6">
      <q-card-section>
        <div>
          Error, unable to connect to temperature sensors (socket issue)
        </div>
        <div>Please contact the ethos team at:</div>
        <div class="q-mt-sm">ethos@griffith.edu.au</div>
        <div class="q-mt-sm">5552 7903</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useSensorDataStore } from 'stores/sensorData';

export default defineComponent({
  name: 'ModalNoConnection',
  setup() {
    const store = useSensorDataStore();
    return {
      isDisconnected: computed(() => !store.isConnected),
    };
  },
});
</script>
