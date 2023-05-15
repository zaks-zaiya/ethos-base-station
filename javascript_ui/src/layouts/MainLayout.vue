<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-2">
    <!-- Register Modals -->
    <modal-no-connection />
    <modal-cooling-interventions v-model="isShowCoolingModal" />
    <modal-help v-model="isShowHelpModal" />
    <!-- Main layout -->
    <q-header flat class="transparent">
      <q-toolbar class="ethos-toolbar">
        <img
          v-if="$route.path !== '/settings'"
          src="ethos.svg"
          height="30"
          @click="showSettingsButton"
        />
        <q-btn
          v-if="$route.path !== '/' && $route.path !== '/initialize'"
          to="/"
          color="info"
          label="go back to home"
          icon="home"
          class="q-ml-md"
        />
        <q-toolbar-title></q-toolbar-title>

        <q-btn
          v-if="$route.path !== '/settings'"
          @click="isShowCoolingModal = true"
          class="q-mr-lg"
          color="primary"
          label="i need to cool down"
        />
        <q-btn
          v-if="$route.path !== '/settings'"
          @click="isShowHelpModal = true"
          color="secondary"
          label="help me use the app"
        />
        <q-btn
          v-if="isShowSettingsButton"
          @click="hideSettingsButton"
          class="q-ml-md"
          color="info"
          icon="settings"
          to="settings"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer
      class="text-black"
      elevated
      :model-value="keyboardStore.isKeyboardBound"
    >
      <SimpleKeyboard />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import { useKeyboardStore } from 'src/stores/keyboard';

import ModalNoConnection from 'components/ModalNoConnection.vue';
import ModalCoolingInterventions from 'components/ModalCoolingInterventions.vue';
import SimpleKeyboard from 'src/components/SimpleKeyboard.vue';
import ModalHelp from 'src/components/ModalHelp.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    ModalNoConnection,
    ModalCoolingInterventions,
    SimpleKeyboard,
    ModalHelp,
  },
  setup() {
    const keyboardStore = useKeyboardStore();
    let isShowSettingsButton = ref(false);
    let isShowCoolingModal = ref(false);
    let isShowHelpModal = ref(false);

    let timeoutShowSettingsButton: null | number = null;
    let showSettingsPressedCount = 0;

    // Function to show settings button if activated multiple times in quick succession
    let showSettingsButton = () => {
      // Increment pressed count
      showSettingsPressedCount++;
      // Check if the threshold has been met to show the settings button
      if (showSettingsPressedCount >= 7) {
        showSettingsPressedCount = 0;
        isShowSettingsButton.value = true;
        return;
      }
      // Clear the timeout (if it exists)
      if (timeoutShowSettingsButton) {
        clearTimeout(timeoutShowSettingsButton);
      }
      // Set another timeout that resets logo pressed count when it expires
      timeoutShowSettingsButton = window.setTimeout(() => {
        showSettingsPressedCount = 0;
      }, 3000);
    };

    let hideSettingsButton = () => {
      isShowSettingsButton.value = false;
    };

    return {
      keyboardStore,
      isShowSettingsButton,
      isShowCoolingModal,
      isShowHelpModal,
      showSettingsButton,
      hideSettingsButton,
    };
  },
});
</script>

<style lang="scss" scoped>
.ethos-toolbar {
  height: $toolbar-height;
}
</style>
