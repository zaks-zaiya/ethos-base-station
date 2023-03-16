<template>
  <div>
    <div class="text-h6 q-mb-md">Reset Data</div>
    <!-- Inputs below -->
    <div class="q-mb-sm">
      Press below to delete all data, and reset the app to factory settings
    </div>
    <q-btn color="negative" @click="() => (isShowWarning = true)">
      Press here to reset
    </q-btn>
    <!-- Warning modal with confirmation -->
    <q-dialog v-model="isShowWarning">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Confirm Reset</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <div>
            Are you sure you want to delete all data and reset everything? This
            cannot be undone
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="No go back" color="primary" v-close-popup />
          <q-btn label="Yes delete everything" color="negative" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const isShowWarning = ref(false);
    return { isShowWarning };
  },
});
</script>
