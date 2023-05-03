<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <q-btn icon="arrow_back" color="primary" @click="$emit('back')">
          back
        </q-btn>
        <div class="text-h4 q-ml-md">{{ strategy.text }}</div>
      </div>
      <q-scroll-area style="height: 70vh" visible>
        <div v-html="strategy.description"></div>
      </q-scroll-area>
    </q-card-section>
  </q-card>
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
