<template>
  <q-chip color="transparent" text-color="primary" class="text-bold">
    {{ currentTime }}
  </q-chip>
</template>

<script lang="ts">
export default {
  data() {
    return {
      currentTime: '',
    };
  },
  methods: {
    getCurrentTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
  mounted() {
    this.getCurrentTime();
    setInterval(this.getCurrentTime, 60000);
  },
};
</script>
