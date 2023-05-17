<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <q-btn icon="arrow_back" color="primary" @click="$emit('back')">
          back
        </q-btn>
        <div class="text-h4 q-ml-md">{{ strategy.name }}</div>
      </div>
      <BaseScrollArea>
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
      </BaseScrollArea>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CoolingInterventionInfoSection from './CoolingInterventionInfoSection.vue';
import BaseScrollArea from './BaseScrollArea.vue';

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
    BaseScrollArea,
  },
});
</script>
