<template>
  <base-scroll-area>
    <div class="q-ma-lg">
      <div class="text-h6 q-mb-md">Quit Application</div>
      <!-- Inputs below -->
      <div class="q-mb-sm text">Press below to quit the app</div>
      <q-btn color="negative" label="Quit" @click="quitApp" />
    </div>
  </base-scroll-area>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseScrollArea from './BaseScrollArea.vue';

export default defineComponent({
  methods: {
    quitApp() {
      if (process.env.MODE === 'electron' && window.myElectronAPI) {
        window.myElectronAPI.quit();
      } else {
        window.close();
      }
    },
  },
  components: { BaseScrollArea },
});
</script>

<style scoped>
.settings-menu-quit {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
