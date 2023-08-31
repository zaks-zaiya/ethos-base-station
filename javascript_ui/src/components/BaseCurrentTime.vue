<template>
  <q-chip color="transparent" text-color="primary" class="text-bold">
    {{ timeString }}
  </q-chip>
</template>

<script lang="ts">
import { useDateTimeStore } from 'src/stores/dateTime';
import { computed } from 'vue';
export default {
  setup() {
    const dateTimeStore = useDateTimeStore();
    const timeString = computed(() =>
      dateTimeStore.currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
    return { timeString };
  },
};
</script>
