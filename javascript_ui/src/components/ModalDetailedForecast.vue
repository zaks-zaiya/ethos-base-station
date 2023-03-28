<template>
  <q-dialog v-model="forecastStore.isShowDetailedForecast" :persistent="true">
    <q-card class="bg-negative text-white text-h6">
      <q-card-section>
        <!-- TODO: Content here -->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useForecastStore } from 'stores/forecast';

export default defineComponent({
  name: 'ModalNoConnection',
  setup() {
    const forecastStore = useForecastStore();
    return {
      forecastStore,
    };
  },
});
</script>
