<template>
  <q-dialog full-width full-height v-model="surveyStore.isShowSurveyModal">
    <BaseModalScroll>
      <template #header>
        <div class="row items-center">
          <div>Survey</div>
          <q-space />
          <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
        </div>
      </template>
      <template #main>
        <p>
          It appears you have had {{ surveyStore.alertsSinceLastSurvey }} number
          of heat alerts recently. We'd appreciate if you could fill out this
          short survey.
        </p>

        <!-- TODO: Survey Data Here -->
      </template>
    </BaseModalScroll>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseModalScroll from './BaseModalScroll.vue';
import { useSurveyStore } from 'src/stores/survey';

export default defineComponent({
  name: 'ModalSurvey',
  components: { BaseModalScroll },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const surveyStore = useSurveyStore();

    return {
      surveyStore,
    };
  },
});
</script>

<style scoped></style>
