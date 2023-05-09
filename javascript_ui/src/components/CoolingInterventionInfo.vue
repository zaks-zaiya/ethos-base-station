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
        <CoolingInterventionInfoSection
          :headingText="`How to best use ${strategy.shortName}`"
          :strategyPoints="strategy.extraInfo.bestUse"
        />

        <CoolingInterventionInfoSection
          :headingText="`When ${strategy.shortName} should be used`"
          :strategyPoints="strategy.extraInfo.whenUse"
          color="positive"
          bullet-style="tick"
        />

        <CoolingInterventionInfoSection
          :headingText="`When ${strategy.shortName} should not be used`"
          :strategyPoints="strategy.extraInfo.whenNotUse"
          color="negative"
          bullet-style="cross"
        />
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CoolingInterventionInfoSection from './CoolingInterventionInfoSection.vue';

export default defineComponent({
  name: 'CoolingStrategyInfo',
  props: {
    strategy: {
      type: Object,
      required: true,
    },
  },
  components: {
    CoolingInterventionInfoSection,
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
