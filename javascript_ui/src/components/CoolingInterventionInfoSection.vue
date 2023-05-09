<template>
  <!-- <q-card bordered flat class="q-mt-sm" :style="`border-color: $${color}`"> -->
  <q-card bordered flat :class="`q-mt-sm border-${color}`">
    <q-chip
      :class="`q-mt-md fontsize-16 text-bold ${
        color === 'negative' ? 'text-white' : 'text-black'
      }`"
      :color="color"
    >
      {{ headingText }}
    </q-chip>
    <ul :class="`q-mt-none fontsize-14 ${bulletStyle}-list`">
      <li v-for="(text, index) in strategyPoints" :key="index">
        {{ text }}
      </li>
    </ul>
  </q-card>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  headingText: string;
  strategyPoints: string[];
  color?: 'positive' | 'negative';
  bulletStyle?: string;
}>();
const { headingText, strategyPoints, color, bulletStyle } = toRefs(props);
</script>

<style scoped lang="scss">
.border-positive {
  border-color: $positive;
}

.border-negative {
  border-color: $negative;
}

.tick-list li {
  list-style-type: none;
  position: relative;
  padding-left: 1.5em;
}

.tick-list li::before {
  content: '✔';
  position: absolute;
  left: 0;
  color: green;
}

.cross-list li {
  list-style-type: none;
  position: relative;
  padding-left: 1.5em;
}

.cross-list li::before {
  content: '✖';
  position: absolute;
  left: 0;
  color: red;
}
</style>
