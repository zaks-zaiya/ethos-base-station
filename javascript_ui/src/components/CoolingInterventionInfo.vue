<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <q-btn icon="arrow_back" color="primary" @click="$emit('back')">
          back
        </q-btn>
        <div class="text-h4 q-ml-md">{{ strategy.name }}</div>
      </div>
      <q-scroll-area
        style="height: 70vh"
        class="q-pr-md"
        :thumb-style="thumbStyle"
        :bar-style="barStyle"
        visible
      >
        <q-card bordered flat class="q-mt-sm">
          <q-chip class="q-mt-md fontsize-14 text-bold">
            How to best use {{ strategy.shortName }}:
          </q-chip>
          <ul class="q-mt-none fontsize-12">
            <li
              v-for="(text, index) in strategy.extraInfo.bestUse"
              :key="index"
            >
              {{ text }}
            </li>
          </ul>
        </q-card>

        <q-card bordered flat class="border-positive q-my-sm">
          <q-chip color="positive" class="q-mt-md fontsize-14 text-bold">
            When {{ strategy.shortName }} should be used:
          </q-chip>
          <ul class="q-mt-none fontsize-12 tick-list">
            <li
              v-for="(text, index) in strategy.extraInfo.whenUse"
              :key="index"
            >
              {{ text }}
            </li>
          </ul>
        </q-card>

        <q-card bordered flat class="border-negative">
          <q-chip
            color="negative"
            class="text-white q-mt-md fontsize-14 text-bold"
          >
            When {{ strategy.shortName }} should not be used:
          </q-chip>
          <ul class="q-mt-none fontsize-12 cross-list">
            <li
              v-for="(text, index) in strategy.extraInfo.whenNotUse"
              :key="index"
            >
              {{ text }}
            </li>
          </ul>
        </q-card>
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
  setup() {
    return {
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: '0.75',
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: '0.2',
      },
    };
  },
});
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
