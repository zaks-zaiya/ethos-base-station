<template>
  <q-layout view="lHh Lpr lFf" class="bg-blue-grey-2">
    <!-- Register Modals -->
    <modal-no-connection />
    <!-- Main layout -->
    <q-header flat class="transparent">
      <q-toolbar>
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
          v-if="isShowSettingsButton"
          @click="hideSettingsButton"
          class="q-mr-md"
          color="secondary"
          icon="settings"
          to="settings"
        />
        <q-btn
          v-if="$route.path !== '/settings'"
          color="secondary"
          label="help"
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
import SimpleKeyboard from 'src/components/SimpleKeyboard.vue';

export default defineComponent({
  name: 'MainLayout',
  components: { ModalNoConnection, SimpleKeyboard },
  setup() {
    const keyboardStore = useKeyboardStore();
    let isShowSettingsButton = ref(false);

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
      showSettingsButton,
      hideSettingsButton,
    };
  },
});
</script>
