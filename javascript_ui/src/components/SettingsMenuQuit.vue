<template>
  <div class="settings-menu-quit">
    <q-btn color="negative" label="Quit" @click="quitApp" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
