<template>
  <q-card>
    <q-card-section ref="header">
      <div class="row items-center">
        <q-btn
          class="fontsize-12"
          icon="arrow_back"
          color="primary"
          @click="$emit('back')"
        >
          back
        </q-btn>
        <div class="fontsize-20 text-bold q-ml-md">{{ strategy.name }}</div>
        <q-space />
        <q-btn
          icon="close"
          color="primary"
          class="fontsize-12"
          @click="$emit('close')"
        >
          Close
        </q-btn>
      </div>
    </q-card-section>
    <BaseScrollArea :height="scrollAreaHeight">
      <q-card-section class="q-pt-none">
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
      </q-card-section>
    </BaseScrollArea>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref } from 'vue';
import CoolingInterventionInfoSection from './CoolingInterventionInfoSection.vue';
import BaseScrollArea from './BaseScrollArea.vue';
import { QCardSection } from 'quasar';

export default defineComponent({
  name: 'CoolingInterventionInfo',
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
  setup() {
    const header: Ref<null | QCardSection> = ref(null);
    const scrollAreaHeight = computed(() => {
      if (header.value) {
        // Subtract header's height from q-card height
        return (
          header.value.$el.parentElement.offsetHeight -
          header.value.$el.offsetHeight +
          'px'
        );
      } else {
        // Default height if header's height can't be calculated
        return '70vh';
      }
    });

    return {
      header,
      scrollAreaHeight,
    };
  },
});
</script>
