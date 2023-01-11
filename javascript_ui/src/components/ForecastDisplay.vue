<template>
  <q-card flat bordered class="full-height">
    <q-card-section>
      <div class="text-h6">Weather Forecast</div>
    </q-card-section>

    <q-separator inset />

    <q-card-section>
      <div>Weather forecast here</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ForecastDisplay',
});
</script>
