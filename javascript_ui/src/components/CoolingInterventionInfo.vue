<!-- CoolingStrategyInfo.vue -->
<template>
  <q-card-section>
    <q-btn icon="arrow_back" flat round dense @click="$emit('back')" />
    <div class="text-h4">{{ strategy.text }}</div>
    <div>{{ strategy.description }}</div>
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CoolingStrategyInfo',
  props: {
    strategy: {
      type: Object,
      required: true,
    },
  },
});
</script>
