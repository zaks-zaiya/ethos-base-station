<!-- CoolingStrategyCard.vue -->
<template>
  <div
    class="cooling-intervention col-4 q-pa-md"
    @click="$emit('click', strategy)"
  >
    <q-card flat bordered class="full-height">
      <q-card-section
        class="bg-no-repeat full-height flex items-center justify-center"
        :style="{
          'background-image': `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${strategy.imageUrl})`,
          'background-size': 'cover',
        }"
      >
        <div class="text-h3 text-white text-center">
          {{ strategy.text }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CoolingStrategyCard',
  props: {
    strategy: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.cooling-intervention {
  height: calc(100vh / 3);
}
</style>
