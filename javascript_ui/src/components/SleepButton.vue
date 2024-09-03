<template>
  <q-btn
    icon="power_settings_new"
    class="q-mr-lg fontsize-16"
    color="positive"
    @click="sleepDevice"
  />
</template>

<script>
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    const sleepDevice = () => {
      if ($q.platform.is.electron) {
        window.myElectronAPI?.send('sleep-device');
      } else {
        console.log('Sleep functionality is only available in Electron');
      }
    };

    return {
      sleepDevice,
    };
  },
});
</script>
